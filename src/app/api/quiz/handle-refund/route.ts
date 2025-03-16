import { getUserInServerSide } from "@/data-access/users/authenticate-user-ssr"
import { supabaseAdminServerSide } from "@/lib/supabase-server-side"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const REFUND_TIME_WINDOW = 10 * 60 * 1000 //10 minutes
export async function POST(req: NextRequest) {
    try {
        const accessToken = req.headers.get("access-token") || ""
        const refreshToken = req.headers.get("refresh-token") || ""
        const userId = await getUserInServerSide({ accessToken, refreshToken })
        if (!userId) {
            return NextResponse.json(
                { error: "invalid tokens" },
                { status: 401 }
            )
        }

        const body = await req.json()
        const supabaseAdmin = await supabaseAdminServerSide()
        const { success, data, error } = bodySchema.safeParse(body)
        if (!success) {
            return NextResponse.json({ error }, { status: 400 })
        }
        const { data: quizData } = await supabaseAdmin
            .from("quizzes")
            .select(
                "id,credit_cost,created_at,quizzes_refunds(count),quizzes_questions(count),quiz_submissions(count)",
                { count: "exact" }
            )
            .eq("id", data.quizId)
            .single()
            .throwOnError()
        const { isValidRefund, refundError } = validateQuizRefund(quizData)
        if (isValidRefund) {
            const userBalance = (
                await supabaseAdmin
                    .from("user_profiles")
                    .select(`credit_balance`)
                    .eq("user_id", userId)
                    .single()
                    .throwOnError()
            ).data.credit_balance

            await supabaseAdmin
                .from("user_profiles")
                .update({
                    credit_balance:
                        userBalance + Number(quizData.credit_cost || 0),
                })
                .eq("user_id", userId)
                .throwOnError()

            await supabaseAdmin
                .from("quizzes_refunds")
                .insert({
                    cause: "",
                    quiz_id: data.quizId,
                })
                .throwOnError()

            return NextResponse.json({ success: true }, { status: 200 })
        } else {
            console.log("error while refunding ", refundError)
            return NextResponse.json({ error: refundError }, { status: 400 })
        }
    } catch (error) {
        console.error(
            "error while refunding : ",
            error,
            "request body ==>",
            await req.json().catch((err) => console.error(err))
        )
        return NextResponse.json({ error }, { status: 500 })
    }
}

const bodySchema = z.object({
    quizId: z.number(),
    cause: z.string().optional().nullable(),
})

export const maxDuration = 60

function validateQuizRefund(quizData: any) {
    if (!quizData) {
        return {
            isValidRefund: false,
            refundError: "Quiz is undefined",
            status: 400,
        }
    }
    // Make sure the quiz has no questions
    if (quizData.quizzes_questions > 0) {
        return {
            isValidRefund: false,
            refundError: "Quiz already has questions and cannot be refunded",
            status: 400,
        }
    }

    // Make sure the quiz has no submissions
    if (quizData.quiz_submissions > 0) {
        return {
            isValidRefund: false,
            refundError: "Quiz has submissions and cannot be refunded",
            status: 400,
        }
    }

    // Make sure the quiz has no old refunds
    if (quizData.quizzes_refunds > 0) {
        return {
            isValidRefund: false,
            refundError: "Quiz has already been refunded",
            status: 400,
        }
    }

    // Make sure the quiz is created in the last 10 mins
    const createdAt = new Date(quizData.created_at).getTime()
    const timeSinceCreation = Date.now() - createdAt

    if (timeSinceCreation > REFUND_TIME_WINDOW) {
        return {
            isValidRefund: false,
            refundError:
                "Quiz was created more than 10 minutes ago and cannot be refunded",
            status: 400,
        }
    }

    return { isValidRefund: true }
}
