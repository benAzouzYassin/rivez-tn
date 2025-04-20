import { getUserInServerSide } from "@/data-access/users/authenticate-user-ssr"
import { premiumModel } from "@/lib/ai"
import { supabaseAdminServerSide } from "@/lib/supabase-server-side"
import { getYtVideoTranscriptions } from "@/utils/youtube"
import { streamText } from "ai"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { HIGH_COST } from "../constants"
import { getSystemPrompt, getUserPrompt } from "./prompt"

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
        const extractedContent = await getYtVideoTranscriptions(data.youtubeUrl)
        if (!extractedContent) {
            return NextResponse.json({
                error: "error while extracting video content",
            })
        }
        const prompt = getUserPrompt({
            ...data,
            content: extractedContent.join(" "),
        })

        const userBalance = (
            await supabaseAdmin
                .from("user_profiles")
                .select(`credit_balance`)
                .eq("user_id", userId)
                .single()
                .throwOnError()
        ).data.credit_balance

        if (userBalance < HIGH_COST) {
            return NextResponse.json(
                {
                    error: "Insufficient balance.",
                },
                { status: 400 }
            )
        }
        const newBalance = userBalance - HIGH_COST

        await supabaseAdmin
            .from("user_profiles")
            .update({
                credit_balance: newBalance,
            })
            .eq("user_id", userId)
            .throwOnError()
        const llmResponse = streamText({
            system: getSystemPrompt(),
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
    youtubeUrl: z.string(),
    language: z.string().max(1000).optional().nullable(),
    additionalInstructions: z.string().max(5000).optional().nullable(),
})

export type TGenMindMapFromYoutube = z.infer<typeof bodySchema>
export const maxDuration = 60
