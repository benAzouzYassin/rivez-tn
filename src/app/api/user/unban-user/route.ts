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

        const isUserToUnbanAdmin = await isUserIdAdmin({
            accessToken,
            refreshToken,
            userId,
        })

        if (isUserToUnbanAdmin) {
            console.error("admin can't remove another admin ban")
            return NextResponse.json(false, { status: 403 })
        }

        const supabaseAdmin = await supabaseAdminServerSide()

        const { error: unBanError } =
            await supabaseAdmin.auth.admin.updateUserById(userId, {
                ban_duration: "none",
            })

        if (unBanError) {
            throw unBanError
        }
        await supabaseAdmin
            .from("user_profiles")
            .update({
                is_banned: false,
            })
            .eq("user_id", userId)

        return NextResponse.json(true, { status: 200 })
    } catch (error) {
        console.error("Error unbanning user:", error)
        return NextResponse.json(false, { status: 500 })
    }
}
