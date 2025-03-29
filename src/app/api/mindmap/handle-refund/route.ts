import { getUserInServerSide } from "@/data-access/users/authenticate-user-ssr"
import { supabaseAdminServerSide } from "@/lib/supabase-server-side"
import { NextRequest, NextResponse } from "next/server"
import { CHEAP_COST, NORMAL_COST } from "../generate/constants"
import { z } from "zod"

const MONTHLY_ALLOWED_REFUNDS = Number(
    process.env.NEXT_PUBLIC_ALLOWED_REFUNDS_PER_MONTH || "0"
)
// TODO make this refund stricter
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
        const body = await req.json()
        const { success, data: bodyData } = bodySchema.safeParse(body)
        if (!success) {
            return NextResponse.json(
                { error: "non valid body" },
                { status: 400 }
            )
        }
        const cost =
            bodyData.generationType === "NORMAL" ? NORMAL_COST : CHEAP_COST

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
                credit_balance: userBalance + cost,
            })
            .eq("user_id", userId)
            .throwOnError()

        await supabaseAdmin
            .from("refunds")
            .insert({
                user_id: userId,
                cause: "mindmap generation.",
            })
            .throwOnError()

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        console.error("error while refunding a question : ", error)
        return NextResponse.json({ error }, { status: 500 })
    }
}

const bodySchema = z.object({
    generationType: z.enum(["NORMAL", "CHEAP"]),
})

export type TMindmapRefund = z.infer<typeof bodySchema>
