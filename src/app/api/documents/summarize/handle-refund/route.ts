import { getUserInServerSide } from "@/data-access/users/authenticate-user-ssr"
import { supabaseAdminServerSide } from "@/lib/supabase-server-side"
import { NextRequest, NextResponse } from "next/server"
import { PAGE_COST } from "../constants"

const MONTHLY_ALLOWED_REFUNDS = Number(
    process.env.NEXT_PUBLIC_ALLOWED_REFUNDS_PER_MONTH || "0"
)
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

        const lastDocumentSummarization = await supabaseAdmin
            .from("summarizations_logs")
            .select("*")
            .order("created_at", {
                ascending: false,
            })
            .eq("user_id", userId)
            .single()
            .throwOnError()

        if (lastDocumentSummarization?.data?.is_refunded) {
            return NextResponse.json(
                { error: "document already refunded" },
                { status: 400 }
            )
        }
        const now = new Date()
        if (
            now.getTime() -
                new Date(lastDocumentSummarization.data.created_at).getTime() >
            5 * 60 * 1000
        ) {
            return NextResponse.json(
                {
                    error: "Refund can only be requested within 5 minutes of summarization",
                },
                { status: 400 }
            )
        }
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
                credit_balance:
                    userBalance +
                    PAGE_COST *
                        Number(
                            lastDocumentSummarization?.data?.pages_count || "0"
                        ),
            })
            .eq("user_id", userId)
            .throwOnError()

        await supabaseAdmin
            .from("refunds")
            .insert({
                user_id: userId,
                cause: "documents page summarization.",
            })
            .throwOnError()
        supabaseAdmin
            .from("summarizations_logs")
            .update({
                is_refunded: true,
            })
            .eq("id", lastDocumentSummarization?.data?.id)
            .throwOnError()
        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        console.error("error while refunding a question : ", error)
        return NextResponse.json({ error }, { status: 500 })
    }
}
