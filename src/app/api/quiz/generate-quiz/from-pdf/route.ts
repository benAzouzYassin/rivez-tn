import { isCurrentUserAdmin } from "@/data-access/users/is-admin"
import { anthropicHaiku } from "@/lib/ai"
import { streamText } from "ai"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { POSSIBLE_QUESTIONS } from "../constants"
import { generateQuizPrompt } from "./utils"

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

        const charCount = data.pdfPages.join("").length
        if (charCount > MAX_CHARS_PER_PDF) {
            return NextResponse.json(
                { error: "PDF is too large" },
                { status: 400 }
            )
        }
        const formattedPdfPages = data.pdfPages
        const prompt = generateQuizPrompt({
            name: data.name,
            language: quizLanguage,
            notes,
            allowQuestions: (data.allowedQuestions as any) || "ALL",
            minQuestions,
            maxQuestions,
            pdfPages: formattedPdfPages,
        })
        const llmResponse = streamText({
            system: `
            - your answers should not include any template strings.
            - You should escape special characters for the special characters since your response will be parse with JSON.parse()
            - Your response should not be markdown. 
            - Your responses shouldn't include any example content provided to you. 
            - You should follow any user notes when generating quiz questions.
            - The quiz questions should always be base on the pdf content.
            - The content of the questions options should and the question should be simple and clear.
            `,
            model: anthropicHaiku,
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

export const maxDuration = 60
