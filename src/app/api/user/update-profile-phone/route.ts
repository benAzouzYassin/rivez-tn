import { supabaseAdminServerSide } from "@/lib/supabase-server-side"
import { verify } from "jsonwebtoken"

import { NextRequest, NextResponse } from "next/server"

export async function PATCH(req: NextRequest) {
    try {
        const supabase = await supabaseAdminServerSide()
        const accessToken = req.headers.get("access-token") || ""
        const userId = verify(accessToken, process.env.SUPABASE_JWT_SECRET!).sub
        if (typeof userId !== "string") {
            return NextResponse.json({ success: false }, { status: 400 })
        }
        const phone = (await req.json())["phone"]

        await supabase
            .from("user_profiles")
            .update({
                phone,
            })
            .eq("user_id", userId)
            .throwOnError()
        return NextResponse.json(true, { status: 200 })
    } catch (error) {
        console.error("Error updating user:", error)
        return NextResponse.json(false, { status: 500 })
    }
}
