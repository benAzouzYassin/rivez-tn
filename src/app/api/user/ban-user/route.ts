import { authenticateAdmin, isUserIdAdmin } from "@/data-access/users/is-admin"
import { supabaseAdminServerSide } from "@/lib/supabase-server-side"

import { NextRequest, NextResponse } from "next/server"

export async function PATCH(req: NextRequest) {
    try {
        const accessToken = req.headers.get("access-token")
        const refreshToken = req.headers.get("refresh-token")

        if (!accessToken || !refreshToken) {
            return NextResponse.json(false, { status: 401 })
        }

        const userId = (await req.json())["userId"]

        const isAdminRequest = await authenticateAdmin({
            refreshToken,
            accessToken,
        })
        if (!isAdminRequest) {
            return NextResponse.json(false, { status: 403 })
        }

        if (!userId) {
            return NextResponse.json(false, { status: 400 })
        }

        const isUserToBanAdmin = await isUserIdAdmin({
            accessToken,
            refreshToken,
            userId,
        })

        if (isUserToBanAdmin) {
            console.error("admin can't ban another admin")
            return NextResponse.json(false, { status: 403 })
        }

        const supabaseAdmin = await supabaseAdminServerSide()

        const { error: banError } =
            await supabaseAdmin.auth.admin.updateUserById(userId, {
                ban_duration: "876000h", //100 year
            })

        if (banError) {
            throw banError
        }
        await supabaseAdmin
            .from("user_profiles")
            .update({
                is_banned: true,
            })
            .eq("user_id", userId)

        return NextResponse.json(true, { status: 200 })
    } catch (error) {
        console.error("Error banning user:", error)
        return NextResponse.json(false, { status: 500 })
    }
}
