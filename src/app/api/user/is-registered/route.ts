import { supabaseAdminServerSide } from "@/lib/supabase-server-side"

import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const userEmail = decodeURIComponent(
            searchParams.get("user_email") as string
        )

        if (!userEmail) {
            return NextResponse.json(false, { status: 400 })
        }

        const supabaseAdmin = await supabaseAdminServerSide()
        const { data } = await supabaseAdmin
            .from("user_profiles")
            .select("user_id")
            .eq("email", userEmail)
            .single()
        if (data?.user_id) {
            return NextResponse.json(true, { status: 200 })
        } else {
            return NextResponse.json(false, { status: 404 })
        }
    } catch (error) {
        console.error("Error deleting user:", error)
        return NextResponse.json(false, { status: 500 })
    }
}
