import { premiumModel } from "@/lib/ai"
import { streamText } from "ai"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { generateQuizPrompt } from "./utils"
import { POSSIBLE_QUESTIONS } from "../constants"
import { getUserInServerSide } from "@/data-access/users/authenticate-user-ssr"
import { supabaseAdminServerSide } from "@/lib/supabase-server-side"

const LOW_MODEL_LOW_COST_QUIZ = Number(
    process.env.NEXT_PUBLIC_MEDIUM_CREDIT_COST
)
const DEFAULT_MIN_QUESTIONS = 12
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

        // quiz generation
        const quizLanguage = data.language || ""
        const notes = data.notes || null

        const maxQuestionsFromConfig = Number(
            process.env.NEXT_PUBLIC_MAX_QUESTION_PER_QUIZ
        )
        let maxQuestions =
            data.maxQuestions !== undefined && data.maxQuestions !== null
                ? Math.min(data.maxQuestions, maxQuestionsFromConfig)
                : maxQuestionsFromConfig

        let minQuestions =
            data.minQuestions !== undefined && data.minQuestions !== null
                ? Math.min(data.minQuestions, maxQuestionsFromConfig)
                : DEFAULT_MIN_QUESTIONS

        if (minQuestions < 1) {
            minQuestions = DEFAULT_MIN_QUESTIONS
        }

        if (maxQuestions < 1) {
            maxQuestions = maxQuestionsFromConfig
        }
        if (minQuestions > maxQuestions) {
            minQuestions = maxQuestions
        }

        const prompt = generateQuizPrompt({
            name: data.name,
            mainTopic: data.mainTopic,
            language: quizLanguage,
            notes,
            minQuestions,
            maxQuestions,
            allowQuestions: (data.allowedQuestions as any) || "ALL",
        })

        const userBalance = (
            await supabaseAdmin
                .from("user_profiles")
                .select(`credit_balance`)
                .eq("user_id", userId)
                .single()
                .throwOnError()
        ).data.credit_balance

        if (userBalance < LOW_MODEL_LOW_COST_QUIZ) {
            return NextResponse.json(
                {
                    error: "Insufficient balance.",
                },
                { status: 400 }
            )
        }
        const newBalance = userBalance - LOW_MODEL_LOW_COST_QUIZ

        await supabaseAdmin
            .from("quizzes")
            .update({
                credit_cost: LOW_MODEL_LOW_COST_QUIZ,
            })
            .eq("id", data.quizId)
            .throwOnError()

        await supabaseAdmin
            .from("user_profiles")
            .update({
                credit_balance: newBalance,
            })
            .eq("user_id", userId)
            .throwOnError()
        const llmResponse = streamText({
            system: `
            You are a quiz generator that follows the rules.
            RULES:
                - IMPORTANT do not respond with markdown and only respond with json.
                - Your answer should start with this character "{".
                - If there is a question typed "FILL_IN_THE_BLANK" use all the content.options inside content.correct (only applied in "FILL_IN_THE_BLANK" question type ).
                - Your answer should not include any template strings.
                - Your response should be valid JSON that can be used like this : JSON.parse(response)
                - You should escape special characters for the special characters since your response will be parse with JSON.parse()
                - Your response should not be markdown. 
                - Your responses shouldn't include any example content provided to you. 
                - You should follow any user notes when generating quiz questions.
                - The content of the questions options should and the question should be simple and clear.
                - Any code comment that starts with "//" is important and should not be ignored.
                - Difficulty of the questions should be ${
                    data.difficulty || "NORMAL"
                }
            `,

            model: premiumModel,
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
    quizId: z.number(),
    mainTopic: z
        .string()
        .min(1, "Main topic is required")
        .max(100, "Input exceeds maximum length"),
    language: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
    difficulty: z.string().nullable().optional(),
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
