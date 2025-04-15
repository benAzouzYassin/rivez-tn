import { getUserInServerSide } from "@/data-access/users/authenticate-user-ssr"
import { supabaseAdminServerSide } from "@/lib/supabase-server-side"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

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
        const data = bodySchema.parse(body)

        const result = await supabaseAdmin
            .from("payments")
            .insert({
                credit_count: data.credits,
                currency_name: "",
                currency_symbol: "",
                paid_amount: 0,
                status: "PENDING",
                updated_at: new Date().toISOString(),
                user_id: userId,
            })
            .select("id")
            .throwOnError()

        if (!result.data[0].id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "error while adding payment to the database",
                },
                { status: 500 }
            )
        }
        return NextResponse.json(
            {
                paymentId: result.data[0].id,
            },
            { status: 200 }
        )
    } catch (error) {
        console.error(error)
        NextResponse.json(error, { status: 500 })
    }
}

const bodySchema = z.object({
    credits: z.number(),
})
