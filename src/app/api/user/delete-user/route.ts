import { isCurrentUserAdmin, isUserIdAdmin } from "@/data-access/users/is-admin"
import { supabaseAdminServerSide } from "@/lib/supabase-server-side"

import { NextRequest, NextResponse } from "next/server"

export async function DELETE(req: NextRequest) {
    try {
        const accessToken = req.headers.get("access-token")
        const refreshToken = req.headers.get("refresh-token")

        if (!accessToken || !refreshToken) {
            return NextResponse.json(false, { status: 401 })
        }

        const isAdminRequest = await isCurrentUserAdmin({
            refreshToken,
            accessToken,
        })
        if (!isAdminRequest) {
            return NextResponse.json(false, { status: 403 })
        }

        const { searchParams } = new URL(req.url)
        const userId = decodeURIComponent(searchParams.get("user_id") as string)

        if (!userId) {
            return NextResponse.json(false, { status: 400 })
        }

        const isUserToDeleteAdmin = await isUserIdAdmin({
            accessToken,
            refreshToken,
            userId,
        })

        if (isUserToDeleteAdmin) {
            console.error("admin can't delete another admin")
            return NextResponse.json(false, { status: 403 })
        }

        const supabaseAdmin = await supabaseAdminServerSide()
        const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
        if (error) {
            throw error
        }
        return NextResponse.json(true, { status: 200 })
    } catch (error) {
        console.error("Error deleting user:", error)
        return NextResponse.json(false, { status: 500 })
    }
}
