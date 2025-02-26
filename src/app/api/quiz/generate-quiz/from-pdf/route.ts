import { isCurrentUserAdmin } from "@/data-access/users/is-admin"
import { llm } from "@/lib/ai"
import { generateObject, streamText } from "ai"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// TODO make rate limiting for each user
const MAX_CHARS_PER_PDF = 100_000
export async function POST(req: NextRequest) {
    try {
        const accessToken = req.headers.get("access-token") || ""
        const refreshToken = req.headers.get("refresh-token") || ""
        const isAdmin = await isCurrentUserAdmin({ refreshToken, accessToken })

        if (!isAdmin) {
            return NextResponse.json(
                { error: "this feature is available for admins only" },
                { status: 403 }
            )
        }
        const body = await req.json()

        const { success, data, error } = bodySchema.safeParse(body)

        if (!success) {
            return NextResponse.json({ error }, { status: 400 })
        }

        const quizLanguage = data.language || "english"
        const rules = data.rules || null

        const maxQuestionsFromConfig = Number(
            process.env.NEXT_PUBLIC_MAX_QUESTION_PER_QUIZ
        )
        const maxQuestions =
            data.maxQuestions !== undefined && data.maxQuestions !== null
                ? Math.min(data.maxQuestions, maxQuestionsFromConfig)
                : maxQuestionsFromConfig

        const minQuestions =
            data.minQuestions !== undefined && data.minQuestions !== null
                ? Math.min(data.minQuestions, maxQuestionsFromConfig)
                : 1

        const charCount = data.pdfPages.join("").length
        if (charCount > MAX_CHARS_PER_PDF) {
            return NextResponse.json(
                { error: "PDF is too large" },
                { status: 400 }
            )
        }
        const pdfPrompt = generatePdfFormatPrompt(data.pdfPages, quizLanguage)
        const pdfFormatResponse = await generateObject({
            model: llm,
            schema: z.object({
                mainTopic: z.string(),
                pages: z.array(z.string()),
            }),
            prompt: pdfPrompt,
            temperature: 0,
        })
        const mainTopic = pdfFormatResponse.object.mainTopic
        const formattedPdfPages = pdfFormatResponse.object.pages
        const prompt = generateQuizPrompt({
            name: data.name,
            language: quizLanguage,
            rules: rules,
            minQuestions,
            maxQuestions,
            mainTopic,
            pdfPages: formattedPdfPages,
        })

        const llmResponse = streamText({
            model: llm,
            prompt,
            temperature: 0,
        })
        return llmResponse.toTextStreamResponse()
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error }, { status: 500 })
    }
}

const bodySchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .max(100, "Input exceeds maximum length"),
    pdfPages: z.array(z.string()),
    language: z.string().nullable().optional(),
    rules: z.string().nullable().optional(),
    maxQuestions: z.coerce.number().max(999).nullable().optional(),
    minQuestions: z.coerce.number().max(20).nullable().optional(),
})

interface FinalPromptParams {
    name: string
    mainTopic: string
    language: string
    rules: string | null
    minQuestions: number
    maxQuestions: number
    pdfPages: string[]
}
function generateQuizPrompt(params: FinalPromptParams): string {
    const { mainTopic, language, rules, minQuestions, maxQuestions, pdfPages } =
        params

    const prompt = `
    
    Generate an educational quiz with the following specifications:

QUIZ METADATA:
- Main Topic: ${mainTopic}
- Language: ${language}
${
    rules
        ? `- Rules: 
    ${rules}`
        : ""
}
- Maximum questions count : is ${maxQuestions > 1 ? maxQuestions : 2}
- Minimum questions count : is ${minQuestions} 

QUESTION DISTRIBUTION:
- Aim for a balanced mix of MATCHING_PAIRS and MULTIPLE_CHOICE questions
- For matching pairs, include 3-5 pairs per question
- For multiple choice, vary between 3-4 options with 1-2 correct answers
- Minimum number of questions is ${minQuestions}

QUESTION TYPES AND STRUCTURES:
1. MATCHING_PAIRS Questions:
{
    questionText: string     // Clear instruction for matching the pairs
    type: "MATCHING_PAIRS"
    content: {
        correct: string[][]  // Array of correct pairs, e.g. [["term1", "definition1"], ["term2", "definition2"]]
        leftSideOptions: string[]   // List of all terms/concepts (should be more than 3)
        rightSideOptions: string[]  // List of all definitions/descriptions (should be more than 3)
    }
}

2. MULTIPLE_CHOICE Questions:
{
    questionText: string     // Clear, concise question statement
    type: "MULTIPLE_CHOICE"
    content: {
        correct: string[]    // Array of correct option(s)
        options: string[]    // Array of strictly 4 options
    }
}

QUALITY REQUIREMENTS:
1. Questions should:
   - Be clear and unambiguous
   - Progress from basic to more challenging concepts
   - Use proper terminology relevant to ${mainTopic}
   - Avoid obvious patterns in correct answers
   - In MATCHING_PAIRS questions avoid putting the leftSideOptions and the matching rightSideOptions in the same array index
   - In MULTIPLE_CHOICE questions never group the correct options together

2. Answer options should:
   - Be mutually exclusive
   - Be free of obvious hints or patterns
   - Use consistent formatting

3. Language requirements:
   - Use ${language} exclusively
   - Maintain consistent terminology
   - Use proper grammar and punctuation
   - Avoid colloquialisms unless relevant to the topic

4. Content accuracy:
   - Base all questions strictly on the content from the provided PDF bellow
   - Use exact terminology and concepts as presented in the source material
   - Ensure factual accuracy and current information
   - Reference widely accepted knowledge in the field
   - If no pdf content provided generate the quiz based on the main topic

Please generate the quiz in JSON format, with each question object strictly following the provided type definitions.

IMPORTANT : 
- Your response should be valid JSON that can be used like this : JSON.parse(response)
- Your response should not be markdown. 
- Your response should follow this zod schema :  z.object({
    questionsCount: z.number(),
    questions: z.array(
        z.union([
            z.object({
                questionText: z.string(),
                type: z.literal("MATCHING_PAIRS"),
                content: z.object({
                    correct: z.array(z.array(z.string())),
                    leftSideOptions: z.array(z.string()).min(3),
                    rightSideOptions: z.array(z.string()).min(3),
                }),
            }),
            z.object({
                questionText: z.string(),
                type: z.literal("MULTIPLE_CHOICE"),
                content: z.object({
                    correct: z.array(z.string()),
                    options: z.array(z.string()).min(4),
                }),
            }),
        ])
    ),
})

PDF CONTENT  : 
${pdfPages.reduce((acc, curr, i) => {
    return acc + `\n page ${i + 1}: ${curr}`
}, "")}
`
    return prompt
}

const generatePdfFormatPrompt = (pages: string[], language: string) => {
    return `
    
    You are given an array of PDF document pages. Each item in the array contains a page content. Your task is to analyze each page and generate a topic description summarizing what the page is about.
    the result you are going to give should match this typescript type :  
    Ensure that your response follows this TypeScript type:
    type Result= {
        mainTopic :string 
        pages : string[]
    }

    Guidelines:
      - The pages count should be ${pages.length}
      - Extract the main subject of each page.
      - Output should be in ${language} language.
      - Don't return any empty or blank page.
      
    The pdf document pages are : ${pages.reduce((acc, curr, i) => {
        return acc + `\n page ${i + 1}: ${curr}`
    }, "")}
     `
}

const quizQuestionSchema = z.object({
    questionsCount: z.number(),
    questions: z.array(
        z.union([
            z.object({
                questionText: z.string(),
                type: z.literal("MATCHING_PAIRS"),
                content: z.object({
                    correct: z.array(z.array(z.string())),
                    leftSideOptions: z.array(z.string()),
                    rightSideOptions: z.array(z.string()),
                }),
            }),
            z.object({
                questionText: z.string(),
                type: z.literal("MULTIPLE_CHOICE"),
                content: z.object({
                    correct: z.array(z.string()),
                    options: z.array(z.string()),
                }),
            }),
        ])
    ),
})

export type GeneratedQuizResponse = z.infer<typeof quizQuestionSchema>
export type GenerateQuizBodyType = z.infer<typeof bodySchema>
