import { anthropicHaiku } from "@/lib/ai"
import { streamText } from "ai"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { success, data, error } = bodySchema.safeParse(body)

        if (!success) {
            return NextResponse.json({ error }, { status: 400 })
        }

        const prompt = generatePrompt(data)
        const llmResponse = streamText({
            model: anthropicHaiku,
            prompt,
            temperature: 0.7,
            system: `
            You are an expert tutor specializing in explaining subject of quiz questions so people can answer the questions.
            Your explanations should be detailed, include examples, and guide users toward understanding without directly giving away answers.
            Format your hints using html to enhance readability.
            Your answer should start with <h2> html tag .
            You shouldn't talk to the user you should start explaining the topic provided to you directly. 
            `,
        })

        return llmResponse.toTextStreamResponse()
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error }, { status: 500 })
    }
}

const questionTypeSchema = z.union([
    z.object({
        questionText: z.string(),
        type: z.literal("MULTIPLE_CHOICE"),
        options: z.array(
            z.object({
                text: z.string(),
                isCorrect: z.boolean().nullable().optional(),
            })
        ),
    }),
    z.object({
        questionText: z.string(),
        type: z.literal("MATCHING_PAIRS"),
        leftOptions: z.array(z.string()),
        rightOptions: z.array(
            z.object({
                text: z.string(),
                leftOption: z.string(),
            })
        ),
    }),
    z.object({
        questionText: z.string(),
        type: z.literal("FILL_IN_THE_BLANK"),
        content: z.object({
            parts: z.array(z.string()),
            options: z.array(z.string()),
            correct: z.array(
                z.object({
                    option: z.string(),
                    index: z.number(),
                })
            ),
        }),
    }),
])

const bodySchema = z.object({
    question: questionTypeSchema,
    difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
    subject: z.string().max(100).optional(),
})

function generatePrompt(data: {
    question: z.infer<typeof questionTypeSchema>
    difficulty: string
    subject?: string
}) {
    const { question, difficulty, subject } = data

    let formattedQuestion = ""
    let formattedOptions = ""
    let questionType = ""

    switch (question.type) {
        case "MULTIPLE_CHOICE":
            questionType = "multiple choice question"
            formattedQuestion = question.questionText
            formattedOptions = question.options
                .map((opt, i) => `${i + 1}. ${opt}`)
                .join("\n")
            break

        case "MATCHING_PAIRS":
            questionType = "matching pairs question"
            formattedQuestion = question.questionText
            formattedOptions = `Left side options:\n${question.leftOptions
                .map((opt, i) => `${i + 1}. ${opt}`)
                .join("\n")}\n\nRight side options:\n${question.rightOptions
                .map((opt, i) => `${i + 1}. ${opt}`)
                .join("\n")}`
            break

        case "FILL_IN_THE_BLANK":
            questionType = "fill in the blank question"
            const blankedText = question.content.parts.reduce(
                (acc, part, index) => {
                    if (index === question.content.parts.length - 1) {
                        return acc + part
                    }
                    return acc + part + "___"
                },
                ""
            )

            formattedQuestion = `${question.questionText}\n${blankedText}`

            if (question.content.options.length > 0) {
                formattedOptions = `Available options:\n${question.content.options
                    .map((opt, i) => `${i + 1}. ${opt}`)
                    .join("\n")}`
            }
            break
    }

    return `
I need you to generate 1 helpful explanation for the following ${questionType} question:

Question:
${formattedQuestion}
${formattedOptions ? ` Options:\n${formattedOptions}` : ""}
${subject ? `### Subject Area:\n${subject}` : ""}
`.trim()
}

export const maxDuration = 60
export type GenerateHintEndpointBody = z.infer<typeof bodySchema>
