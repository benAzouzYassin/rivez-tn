import { getUserInServerSide } from "@/data-access/users/authenticate-user-ssr"
import { supabaseAdminServerSide } from "@/lib/supabase-server-side"
import { NextRequest, NextResponse } from "next/server"

const MONTHLY_ALLOWED_REFUNDS = Number(
    process.env.NEXT_PUBLIC_ALLOWED_REFUNDS_PER_MONTH || "0"
)
const COST = Number(process.env.NEXT_PUBLIC_LOW_CREDIT_COST || 0.2)
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
        const supabaseAdmin = await supabaseAdminServerSide()

        const userProfileData = await supabaseAdmin
            .from("user_profiles")
            .select(`credit_balance`)
            .eq("user_id", userId)
            .single()
            .throwOnError()

        const now = new Date()
        const firstDayOfMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        ).toISOString()
        const monthRefundsCount =
            (
                await supabaseAdmin
                    .from("quizzes_refunds")
                    .select(`id`, { count: "exact" })
                    .eq("user_id", userId)
                    .gte("created_at", firstDayOfMonth)
                    .throwOnError()
            ).count || 0

        const userBalance = userProfileData.data.credit_balance
        if (monthRefundsCount >= MONTHLY_ALLOWED_REFUNDS) {
            return NextResponse.json(
                { error: "you did too much refunds." },
                { status: 429 }
            )
        }

        await supabaseAdmin
            .from("user_profiles")
            .update({
                credit_balance: userBalance + COST,
            })
            .eq("user_id", userId)
            .throwOnError()

        await supabaseAdmin
            .from("quizzes_refunds")
            .insert({
                user_id: userId,
                cause: "hint generation error",
            })
            .throwOnError()

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        console.error("error while refunding a question : ", error)
        return NextResponse.json({ error }, { status: 500 })
    }
}
