import { getUserInServerSide } from "@/data-access/users/authenticate-user-ssr"
import { normalModel } from "@/lib/ai"
import { supabaseAdminServerSide } from "@/lib/supabase-server-side"
import { getYtVideoTranscriptions } from "@/utils/youtube"
import { streamText } from "ai"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { generatePrompt, systemPrompt } from "./prompt"
import { COST } from "./constants"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const {
            data: bodyData,
            success,
            error: parsingErr,
        } = bodySchema.safeParse(body)
        if (!success) {
            return NextResponse.json({ error: parsingErr }, { status: 400 })
        }
        const language = bodyData.language || null
        const youtubeLink = bodyData.youtubeLink || null
        if (!youtubeLink) {
            return NextResponse.json(
                {
                    error: "invalid youtube link.",
                },
                { status: 400 }
            )
        }
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
        const extractedText = await getYtVideoTranscriptions(youtubeLink)
        if (!extractedText) {
            return NextResponse.json(
                { error: "error while getting the video content." },
                { status: 400 }
            )
        }
        const prompt = generatePrompt({
            content: extractedText.join(" "),
            language: language,
        })

        const llmResponse = streamText({
            model: normalModel,
            prompt,
            temperature: 0.1,
            system: systemPrompt,
        })

        const supabaseAdmin = await supabaseAdminServerSide()

        const userBalance = (
            await supabaseAdmin
                .from("user_profiles")
                .select(`credit_balance`)
                .eq("user_id", userId)
                .single()
                .throwOnError()
        ).data.credit_balance

        if (userBalance < COST) {
            return NextResponse.json(
                {
                    error: "Insufficient balance.",
                },
                { status: 400 }
            )
        }
        const newBalance = userBalance - COST

        await supabaseAdmin
            .from("user_profiles")
            .update({
                credit_balance: newBalance,
            })
            .eq("user_id", userId)
            .throwOnError()

        await supabaseAdmin.from("summarizations_logs").insert({
            pages_count: 1,
            user_id: userId,
        })

        return llmResponse.toTextStreamResponse()
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error }, { status: 500 })
    }
}

export const maxDuration = 60

const bodySchema = z.object({
    youtubeLink: z.string(),
    language: z.string().optional().nullable(),
})
export type TSummarizeYoutubeVideo = z.infer<typeof bodySchema>
