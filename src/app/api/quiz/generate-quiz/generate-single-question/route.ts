import { anthropicHaiku } from "@/lib/ai"
import { streamText, generateText } from "ai"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { generateSingleQuestionPrompt } from "./utils"
import { POSSIBLE_QUESTIONS } from "../constants"
import { getUserInServerSide } from "@/data-access/users/authenticate-user-ssr"
import { supabaseAdminServerSide } from "@/lib/supabase-server-side"

const QUESTION_COST =
    Number(process.env.NEXT_PUBLIC_LOW_MODEL_LOW_TOKENS_QUIZ_CREDIT_COST || 1) /
    6
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

        // question generation
        const questionLanguage = data.language || "english"
        const notes = data.notes || null

        const prompt = generateSingleQuestionPrompt({
            mainTopic: data.mainTopic,
            language: questionLanguage,
            notes,
            questionType:
                (data.questionType as any) || "MULTIPLE_CHOICE_WITHOUT_IMAGE",
        })

        const userBalance = (
            await supabaseAdmin
                .from("user_profiles")
                .select(`credit_balance`)
                .eq("user_id", userId)
                .single()
                .throwOnError()
        ).data.credit_balance

        if (userBalance < QUESTION_COST) {
            return NextResponse.json(
                {
                    error: "Insufficient balance.",
                },
                { status: 400 }
            )
        }
        const newBalance = userBalance - QUESTION_COST

        await supabaseAdmin
            .from("user_profiles")
            .update({
                credit_balance: newBalance,
            })
            .eq("user_id", userId)
            .throwOnError()
        const llmResponse = await generateText({
            system: `
            - Your answer should start with this character "{".
            - Your answer should not include any template strings.
            - Your response should be valid JSON that can be used like this : JSON.parse(response)
            - You should escape special characters for the special characters since your response will be parse with JSON.parse()
            - Your response should not be markdown. 
            - Your responses shouldn't include any example content provided to you. 
            - You should follow any user notes when generating the question.
            - The content of the question options and the question should be simple and clear.
            - Any code comment that starts with "//" is important and should not be ignored.
            - Difficulty of the question should be ${
                data.difficulty || "NORMAL"
            }
            `,

            model: anthropicHaiku,
            prompt,
            temperature: 0.1,
        })
        return NextResponse.json({ result: llmResponse.text }, { status: 200 })
    } catch (error) {
        console.error(error)

        return NextResponse.json({ error }, { status: 500 })
    }
}

const bodySchema = z.object({
    mainTopic: z
        .string()
        .min(1, "Main topic is required")
        .max(100, "Input exceeds maximum length"),
    language: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
    difficulty: z.string().nullable().optional(),
    questionType: z.string().refine((arg) => {
        return Object.keys(POSSIBLE_QUESTIONS).includes(arg)
    }),
})

export type GenerateSingleQuestionBodyType = z.infer<typeof bodySchema> & {
    questionType: keyof typeof POSSIBLE_QUESTIONS
}

export const maxDuration = 60
