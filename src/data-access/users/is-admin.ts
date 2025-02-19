import "server-only"

import { supabaseServerSide } from "@/lib/supabase-server-side"

export async function isCurrentUserAdmin(params: {
    accessToken: string
    refreshToken: string
}): Promise<boolean> {
    const supabase = await supabaseServerSide()

    const { data, error } = await supabase.auth.setSession({
        access_token: params.accessToken,
        refresh_token: params.refreshToken,
    })

    if (error) {
        return false
    }

    const isAdmin = data.user?.id
        ? (
              await supabase
                  .from("user_roles")
                  .select("*")
                  .eq("user_id", data.user?.id)
                  .single()
          ).data?.["user_role"] === "ADMIN"
        : false

    return isAdmin
}

export async function isUserIdAdmin(params: {
    accessToken: string
    refreshToken: string
    userId: string
}): Promise<boolean> {
    const supabase = await supabaseServerSide()

    const { data, error } = await supabase.auth.setSession({
        access_token: params.accessToken,
        refresh_token: params.refreshToken,
    })

    if (error) {
        return false
    }

    const isAdmin =
        (
            await supabase
                .from("user_roles")
                .select("*")
                .eq("user_id", params.userId)
                .single()
        ).data?.["user_role"] === "ADMIN"

    return isAdmin
}
