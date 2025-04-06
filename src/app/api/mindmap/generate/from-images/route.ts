import { getUserInServerSide } from "@/data-access/users/authenticate-user-ssr"
import { llama4Maverick } from "@/lib/ai"
import { supabaseAdminServerSide } from "@/lib/supabase-server-side"
import { calculateBase64FileSize } from "@/utils/file"
import { extractImagesText } from "@/utils/image"
import { tryCatchAsync } from "@/utils/try-catch"
import { streamText } from "ai"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { NORMAL_COST } from "../constants"
import { getSystemPrompt, getUserPrompt } from "./prompt"

const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

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
        let totalSize = 0
        const imagesBase64 = data.imagesBase64
        imagesBase64.forEach((img) => {
            totalSize += calculateBase64FileSize(img)
        })

        if (totalSize >= MAX_SIZE_BYTES) {
            return NextResponse.json(
                { error: "Files combined size is too large" },
                { status: 413 }
            )
        }
        const { data: extractedText } = await tryCatchAsync(
            extractImagesText({
                imagesBase64,
                aiModel: llama4Maverick,
            })
        )
        if (!extractedText) {
            return NextResponse.json(
                {
                    error: "couldn't read image content",
                },
                { status: 400 }
            )
        }
        const prompt = getUserPrompt({ ...data, content: extractedText })

        const userBalance = (
            await supabaseAdmin
                .from("user_profiles")
                .select(`credit_balance`)
                .eq("user_id", userId)
                .single()
                .throwOnError()
        ).data.credit_balance

        if (userBalance < NORMAL_COST) {
            return NextResponse.json(
                {
                    error: "Insufficient balance.",
                },
                { status: 400 }
            )
        }
        const newBalance = userBalance - NORMAL_COST

        await supabaseAdmin
            .from("user_profiles")
            .update({
                credit_balance: newBalance,
            })
            .eq("user_id", userId)
            .throwOnError()
        const llmResponse = streamText({
            system: getSystemPrompt(),
            model: llama4Maverick,
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
    imagesBase64: z.array(z.string()),
    language: z.string().max(1000).optional().nullable(),
    additionalInstructions: z.string().max(5000).optional().nullable(),
})

export type TGenMindMapFromImages = z.infer<typeof bodySchema>
export const maxDuration = 60
