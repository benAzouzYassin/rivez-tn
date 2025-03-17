import { getUserInServerSide } from "@/data-access/users/authenticate-user-ssr"
import { supabaseAdminServerSide } from "@/lib/supabase-server-side"
import { NextRequest, NextResponse } from "next/server"
import { QUESTION_COST } from "../generate-quiz/constants"

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
        console.log("handling question refund")
        const supabaseAdmin = await supabaseAdminServerSide()

        const userProfileData = await supabaseAdmin
            .from("user_profiles")
            .select(`credit_balance,allowed_error_credit_refund`)
            .eq("user_id", userId)
            .single()
            .throwOnError()
        const userBalance = userProfileData.data.credit_balance
        const allowedErrorCreditRefund =
            userProfileData.data.allowed_error_credit_refund

        if (!allowedErrorCreditRefund) {
            return NextResponse.json(
                { error: "you did too much refunds." },
                { status: 429 }
            )
        }
        await supabaseAdmin
            .from("user_profiles")
            .update({
                credit_balance: userBalance + QUESTION_COST,
                allowed_error_credit_refund:
                    (allowedErrorCreditRefund || 0) - QUESTION_COST,
            })
            .eq("user_id", userId)
            .throwOnError()

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        console.error("error while refunding a question : ", error)
        return NextResponse.json({ error }, { status: 500 })
    }
}
