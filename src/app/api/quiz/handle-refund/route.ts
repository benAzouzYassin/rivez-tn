import { getUserInServerSide } from "@/data-access/users/authenticate-user-ssr"
import { supabaseAdminServerSide } from "@/lib/supabase-server-side"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const MONTHLY_ALLOWED_REFUNDS = Number(
    process.env.NEXT_PUBLIC_ALLOWED_REFUNDS_PER_MONTH || "0"
)
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
                "id,credit_cost,author_id,created_at,refunds(count),quizzes_questions(count),quiz_submissions(count)",
                { count: "exact" }
            )
            .eq("id", data.quizId)
            .single()
            .throwOnError()
        if (quizData.author_id !== userId) {
            return NextResponse.json(
                { error: "you don't own this quiz." },
                { status: 400 }
            )
        }

        const { isValidRefund, refundError } = validateQuizRefund(quizData)
        if (isValidRefund) {
            const userProfileData = await supabaseAdmin
                .from("user_profiles")
                .select(`credit_balance`)
                .eq("user_id", userId)
                .single()
                .throwOnError()
            const userBalance = userProfileData.data.credit_balance

            const now = new Date()
            const firstDayOfMonth = new Date(
                now.getFullYear(),
                now.getMonth(),
                1
            ).toISOString()
            const monthRefundsCount =
                (
                    await supabaseAdmin
                        .from("refunds")
                        .select(`id`, { count: "exact" })
                        .eq("user_id", userId)
                        .gte("created_at", firstDayOfMonth)
                        .throwOnError()
                ).count || 0
            const creditToRefund = Number(quizData.credit_cost || 0)
            if (monthRefundsCount >= MONTHLY_ALLOWED_REFUNDS) {
                return NextResponse.json(
                    { error: "you did too much refunds." },
                    { status: 429 }
                )
            }
            await supabaseAdmin
                .from("user_profiles")
                .update({
                    credit_balance: userBalance + creditToRefund,
                })
                .eq("user_id", userId)
                .throwOnError()

            await supabaseAdmin
                .from("refunds")
                .insert({
                    cause: data.cause || "",
                    quiz_id: data.quizId,
                    user_id: userId,
                })
                .throwOnError()

            return NextResponse.json({ success: true }, { status: 200 })
        } else {
            console.error("error while refunding ", refundError)
            return NextResponse.json({ error: refundError }, { status: 400 })
        }
    } catch (error) {
        console.error("error while refunding : ", error)
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
    if (quizData.quizzes_questions?.[0]?.count > 0) {
        return {
            isValidRefund: false,
            refundError: "Quiz already has questions and cannot be refunded",
            status: 400,
        }
    }

    if (quizData.quiz_submissions?.[0]?.count > 0) {
        return {
            isValidRefund: false,
            refundError: "Quiz has submissions and cannot be refunded",
            status: 400,
        }
    }

    if (quizData.refunds?.[0]?.count > 0) {
        return {
            isValidRefund: false,
            refundError: "Quiz has already been refunded",
            status: 400,
        }
    }

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
