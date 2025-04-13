import { getUserInServerSide } from "@/data-access/users/authenticate-user-ssr"
import { supabaseAdminServerSide } from "@/lib/supabase-server-side"

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const CREDIT_FOR_INVITER = 25
const CREDIT_FOR_INVITED = 25
export async function POST(req: NextRequest) {
    try {
        const accessToken = req.headers.get("access-token")
        const refreshToken = req.headers.get("refresh-token")

        if (!accessToken || !refreshToken) {
            return NextResponse.json(false, { status: 401 })
        }

        const userId = await getUserInServerSide({
            refreshToken,
            accessToken,
        })
        if (!userId) {
            return NextResponse.json(false, { status: 403 })
        }
        const supabase = await supabaseAdminServerSide()

        const body = await req.json()
        const { data, success, error } = bodySchema.safeParse(body)
        if (success === false) {
            return NextResponse.json(error, { status: 400 })
        }
        const usersQuery = await supabase
            .from("user_profiles")
            .select("*")
            .in("user_id", [data.invitedId, data.inviterId])
            .throwOnError()

        const inviter = usersQuery.data.find(
            (u) => u.user_id === data.inviterId
        )

        const invited = usersQuery.data.find(
            (u) => u.user_id === data.invitedId
        )
        if (!invited || !inviter) {
            return NextResponse.json("something went wrong.", { status: 500 })
        }
        if (invited === inviter) {
            return NextResponse.json("inviters can't invite themselves.", {
                status: 400,
            })
        }

        const dateMinusTenMinutes = new Date(
            new Date().getTime() - 10 * 60 * 1000
        ).getTime()

        if (new Date(invited?.created_at).getTime() < dateMinusTenMinutes) {
            return NextResponse.json(
                "invited user account was not created in the last 10 minutes .",
                { status: 400 }
            )
        }
        if (invited.inviter) {
            return NextResponse.json("invited user already has an inviter.", {
                status: 400,
            })
        }
        await supabase
            .rpc("handle_user_invite", {
                credit_for_invited: CREDIT_FOR_INVITED,
                credit_for_inviter: CREDIT_FOR_INVITER,
                invited_user_id: data.invitedId,
                inviter_id: data.inviterId,
            })
            .throwOnError()

        return NextResponse.json(true, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json(false, { status: 500 })
    }
}

const bodySchema = z.object({
    inviterId: z.string(),
    invitedId: z.string(),
})
