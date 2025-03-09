import { anthropicHaiku } from "@/lib/ai"
import { streamText } from "ai"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { generateQuizPrompt } from "./utils"
import { POSSIBLE_QUESTIONS } from "../constants"
import { isCurrentUserAdmin } from "@/data-access/users/is-admin"

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
        const notes = data.notes || null

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
            notes,
            minQuestions,
            maxQuestions,
            allowQuestions: (data.allowedQuestions as any) || "ALL",
        })

        const llmResponse = streamText({
            system: `
            - Your answers should not include any template strings.
            - Your response should be valid JSON that can be used like this : JSON.parse(response)
            - You should escape special characters for the special characters since your response will be parse with JSON.parse()
            - Your response should not be markdown. 
            - Your responses shouldn't include any example content provided to you. 
            - You should follow any user notes when generating quiz questions.
            - The content of the questions options should and the question should be simple and clear.
            `,

            model: anthropicHaiku,
            prompt,
            temperature: 0.1,
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
    mainTopic: z
        .string()
        .min(1, "Main topic is required")
        .max(100, "Input exceeds maximum length"),
    language: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
    maxQuestions: z.coerce.number().max(999).nullable().optional(),
    minQuestions: z.coerce.number().max(20).nullable().optional(),
    allowedQuestions: z
        .array(
            z.string().refine((arg) => {
                return Object.keys(POSSIBLE_QUESTIONS).includes(arg)
            })
        )
        .optional()
        .nullable(),
})

export type GenerateQuizBodyType = z.infer<typeof bodySchema>

export const maxDuration = 60
