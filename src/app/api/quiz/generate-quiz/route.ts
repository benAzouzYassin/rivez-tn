import { isCurrentUserAdmin } from "@/data-access/users/is-admin"
import { llm } from "@/lib/ai"
import { streamText } from "ai"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// TODO make rate limiting for each user
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

        const prompt = generateQuizPrompt({
            name: data.name,
            mainTopic: data.mainTopic,
            language: quizLanguage,
            rules: rules,
            minQuestions,
            maxQuestions,
            pdfName: data.pdfName,
            pdfUrl: data.pdfUrl,
        })

        const llmResponse = streamText({
            model: llm,
            prompt,
        })
        return llmResponse.toTextStreamResponse()
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error }, { status: 500 })
    }
}

const bodySchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .max(100, "Input exceeds maximum length"),
    mainTopic: z
        .string()
        .min(1, "Main topic is required")
        .max(100, "Input exceeds maximum length"),
    language: z.string().nullable().optional(),
    rules: z.string().nullable().optional(),
    maxQuestions: z.coerce.number().max(999).nullable().optional(),
    minQuestions: z.coerce.number().max(20).nullable().optional(),
    pdfName: z.string().nullable().optional(),
    pdfUrl: z.string().nullable().optional(),
})

interface PromptParams {
    name: string
    mainTopic: string
    language: string
    rules: string | null
    minQuestions: number
    maxQuestions: number
    pdfName: string | null | undefined
    pdfUrl: string | null | undefined
}
function generateQuizPrompt(params: PromptParams): string {
    const {
        mainTopic,
        language,
        rules,
        minQuestions,
        maxQuestions,
        pdfName,
        pdfUrl,
    } = params

    const prompt = `Generate an educational quiz with the following specifications:

QUIZ METADATA:
- Main Topic: ${mainTopic}
- Language: ${language}
${
    rules
        ? `- Rules: 
    ${rules}`
        : ""
}
${pdfName && pdfUrl ? `- Source Material: PDF document "${pdfName}"` : ""}
- Maximum questions count : is ${maxQuestions} zodSchema
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
        leftSideOptions: string[]   // List of all terms/concepts
        rightSideOptions: string[]  // List of all definitions/descriptions
    }
}

2. MULTIPLE_CHOICE Questions:
{
    questionText: string     // Clear, concise question statement
    type: "MULTIPLE_CHOICE"
    content: {
        correct: string[]    // Array of correct option(s)
        options: string[]    // Array of 4 total options
    }
}

QUALITY REQUIREMENTS:
1. Questions should:
   - Be clear and unambiguous
   - Progress from basic to more challenging concepts
   - Use proper terminology relevant to ${mainTopic}
   - Avoid obvious patterns in correct answers
   - In MATCHING_PAIRS questions avoid putting the leftSideOptions and the matching rightSideOptions in the same array index
   - In MULTIPLE_CHOICE questions avoid grouping the correct answers together

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
${
    pdfName && pdfUrl
        ? `   - Base all questions strictly on the content from the provided PDF
   - Use exact terminology and concepts as presented in the source material`
        : `- Ensure factual accuracy and current information
   - Reference widely accepted knowledge in the field`
}

Please generate the quiz in JSON format, with each question object strictly following the provided type definitions.
IMPORTANT : 
- Your response should follow this zod schema :  z.object({
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
`
    return prompt
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
