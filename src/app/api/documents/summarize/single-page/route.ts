import { getUserInServerSide } from "@/data-access/users/authenticate-user-ssr"
import { normalModel, premiumModel } from "@/lib/ai"
import { supabaseAdminServerSide } from "@/lib/supabase-server-side"
import { streamText } from "ai"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { PAGE_COST } from "../constants"
import { generatePrompt, systemPrompt } from "./prompt"

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

        const prompt = generatePrompt({
            documentContent: data.pageContent,
            language: data.language,
        })
        const llmResponse = streamText({
            model: normalModel,
            prompt,
            temperature: 0.1,
            system: systemPrompt,
        })

        const userBalance = (
            await supabaseAdmin
                .from("user_profiles")
                .select(`credit_balance`)
                .eq("user_id", userId)
                .single()
                .throwOnError()
        ).data.credit_balance

        if (userBalance < PAGE_COST) {
            return NextResponse.json(
                {
                    error: "Insufficient balance.",
                },
                { status: 400 }
            )
        }
        const newBalance = userBalance - PAGE_COST

        await supabaseAdmin
            .from("user_profiles")
            .update({
                credit_balance: newBalance,
            })
            .eq("user_id", userId)
            .throwOnError()

        await supabaseAdmin.from("document_summarizations").insert({
            pages_count: 1,
            user_id: userId,
        })
        return llmResponse.toTextStreamResponse()
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error }, { status: 500 })
    }
}
const bodySchema = z.object({
    language: z.string().optional().nullable(),
    pageContent: z.string(),
    exampleCount: z.number().max(5).nullable().optional(),
})

export type BodyType = z.infer<typeof bodySchema>
export const maxDuration = 60
