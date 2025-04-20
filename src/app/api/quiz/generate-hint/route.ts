import { getUserInServerSide } from "@/data-access/users/authenticate-user-ssr"
import { premiumModel } from "@/lib/ai"
import { supabaseAdminServerSide } from "@/lib/supabase-server-side"
import { streamText } from "ai"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getSystemPrompt, getUserPrompt } from "./prompt"
import { COST } from "./constants"

const FREE_HINTS_PER_DAY = 100
export async function POST(req: NextRequest) {
    try {
        let isFree = true
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
        const { data: hintToGenerate } = await supabaseAdmin
            .from("questions_hints")
            .select("*")
            .eq("id", data.hintId)
            .single()
        if (!hintToGenerate) {
            return NextResponse.json(
                { error: "hint was not found" },
                { status: 404 }
            )
        }

        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const todayIsoString = today.toISOString()

        const { count: todayHintsCount } = await supabaseAdmin
            .from("questions_hints")
            .select("count(*)", { count: "exact" })
            .gte("created_at", todayIsoString)
            .eq("author_id", userId)
        if (todayHintsCount && todayHintsCount >= FREE_HINTS_PER_DAY) {
            isFree = false
        }

        const userBalance = (
            await supabaseAdmin
                .from("user_profiles")
                .select(`credit_balance`)
                .eq("user_id", userId)
                .single()
                .throwOnError()
        ).data.credit_balance

        if (isFree === false && userBalance < COST) {
            return NextResponse.json(
                {
                    error: "Insufficient balance.",
                },
                { status: 400 }
            )
        }
        if (isFree === false) {
            const newBalance = userBalance - COST
            await supabaseAdmin
                .from("user_profiles")
                .update({
                    credit_balance: newBalance,
                })
                .eq("user_id", userId)
                .throwOnError()
        }
        const llmResponse = streamText({
            model: premiumModel,
            prompt: getUserPrompt(data),
            temperature: 0.2,
            system: getSystemPrompt(),
        })
        return llmResponse.toTextStreamResponse()
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error }, { status: 500 })
    }
}
const bodySchema = z.object({
    hintId: z.number(),
    questionText: z.string(),
    questionOptions: z.string(),
})
export const maxDuration = 60
export type GenerateHintEndpointBody = z.infer<typeof bodySchema>
