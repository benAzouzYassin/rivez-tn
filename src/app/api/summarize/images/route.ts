import { getUserInServerSide } from "@/data-access/users/authenticate-user-ssr"
import { normalModel, premiumModel } from "@/lib/ai"
import { calculateBase64FileSize } from "@/utils/file"
import { generateText, streamText } from "ai"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { generatePrompt, systemPrompt } from "./prompt"
import { supabaseAdminServerSide } from "@/lib/supabase-server-side"
import { IMAGE_COST } from "./constants"

const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

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
        const imagesBase64 = bodyData.imagesBase64
        let totalSize = 0

        imagesBase64.forEach((img) => {
            totalSize += calculateBase64FileSize(img)
        })

        if (totalSize >= MAX_SIZE_BYTES) {
            return NextResponse.json(
                { error: "Files combined size is too large" },
                { status: 413 }
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
        const result = await generateText({
            temperature: 0,
            model: premiumModel,
            system: `for each image given to you extract it's text in details and without changes.
            - never speak to the user.
            - your output should strictly follow this zod schema : 
            z.array(
                z.object({
                    imageText: z.string(),
                })
            )
            `,
            messages: [
                {
                    role: "user",
                    content: [
                        ...imagesBase64.map((imgBase64) => {
                            return {
                                type: "image",
                                image: `data:image/jpeg;base64,${imgBase64}`,
                            }
                        }),
                    ] as any,
                },
            ],
        })
        const extractedText = result.text
        const prompt = generatePrompt({
            content: extractedText,
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

        const totalCost = IMAGE_COST * imagesBase64.length
        if (userBalance < totalCost) {
            return NextResponse.json(
                {
                    error: "Insufficient balance.",
                },
                { status: 400 }
            )
        }
        const newBalance = userBalance - totalCost

        await supabaseAdmin
            .from("user_profiles")
            .update({
                credit_balance: newBalance,
            })
            .eq("user_id", userId)
            .throwOnError()

        await supabaseAdmin.from("document_summarizations").insert({
            pages_count: imagesBase64.length || 0,
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
    imagesBase64: z.array(z.string()),
    language: z.string().optional().nullable(),
})
export type TSummarizeImages = z.infer<typeof bodySchema>
