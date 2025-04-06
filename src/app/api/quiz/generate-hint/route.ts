import { getUserInServerSide } from "@/data-access/users/authenticate-user-ssr"
import { llama4Maverick } from "@/lib/ai"
import { supabaseAdminServerSide } from "@/lib/supabase-server-side"
import { streamText } from "ai"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const COST = Number(process.env.NEXT_PUBLIC_LOW_CREDIT_COST || 0.2)
export async function POST(req: NextRequest) {
    try {
        const accessToken = req.headers.get("access-token") || ""
        const refreshToken = req.headers.get("refresh-token") || ""
        const userId = await getUserInServerSide({ accessToken, refreshToken })
        if (!userId) {
            return NextResponse.json(
                {
                    error: "this feature is available for authenticated users only",
                },
                { status: 403 }
            )
        }
        const supabaseAdmin = await supabaseAdminServerSide()
        const body = await req.json()
        const { success, data, error } = bodySchema.safeParse(body)

        if (!success) {
            return NextResponse.json({ error }, { status: 400 })
        }

        const prompt = generatePrompt(data)
        const llmResponse = streamText({
            model: llama4Maverick,
            prompt,
            temperature: 0.2,
            system: `
            You are an expert tutor specializing in explaining subject of quiz questions so people can answer the questions.
            Your explanations should be detailed, include examples, and guide users toward understanding without directly giving away answers.
            Format your hints using html to enhance readability.
            Your answer should start with <h2> html tag .
            You shouldn't talk to the user you should start explaining the topic provided to you directly. 
            `,
        })

        const userBalance = (
            await supabaseAdmin
                .from("user_profiles")
                .select(`credit_balance`)
                .eq("user_id", userId)
                .single()
                .throwOnError()
        ).data.credit_balance

        if (userBalance < COST) {
            return NextResponse.json(
                {
                    error: "Insufficient balance.",
                },
                { status: 400 }
            )
        }
        const newBalance = userBalance - COST

        await supabaseAdmin
            .from("user_profiles")
            .update({
                credit_balance: newBalance,
            })
            .eq("user_id", userId)
            .throwOnError()
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
