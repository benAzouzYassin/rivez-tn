import { getUserInServerSide } from "@/data-access/users/authenticate-user-ssr"
import { cheapModel, normalModel, premiumModel } from "@/lib/ai"
import { supabaseAdminServerSide } from "@/lib/supabase-server-side"
import { streamText } from "ai"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { PAGE_COST } from "../constants"
import { generatePrompt, systemPrompt } from "./prompt"
import { extractImagesText } from "@/utils/image"

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

        const files = await Promise.all(
            data.files.map(async (f) => {
                return {
                    ...f,
                    pages: await Promise.all(
                        f.pages.map(async (p) => ({
                            textContent: p.textContent,
                            imageContent: p.imageInBase64
                                ? await extractImagesText({
                                      aiModel: cheapModel,
                                      imagesBase64: [p.imageInBase64],
                                  })
                                : "",
                        }))
                    ),
                }
            })
        )
        const prompt = generatePrompt({
            language: data.language,
            files: files,
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

        const totalCost =
            PAGE_COST *
            data.files
                .flatMap((file) => file.pages)
                .filter(
                    (page) => page.textContent.length > 50 || page.imageInBase64
                ).length

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
            pages_count: data.files.flatMap((item) => item.pages).length || 0,
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
    files: z.array(
        z.object({
            name: z.string(),
            pages: z.array(
                z.object({
                    textContent: z.string(),
                    imageInBase64: z.string().optional().nullable(),
                })
            ),
            id: z.string(),
        })
    ),
})

export type TSummarizeMultiplePages = z.infer<typeof bodySchema>

export const maxDuration = 60
