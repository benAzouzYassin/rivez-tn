import "server-only"

import { supabaseServerSide } from "@/lib/supabase-server-side"
import { User } from "@supabase/supabase-js"

/**
 * @returns the id of the user or null
 */
export async function getUserInServerSide(params: {
    accessToken: string
    refreshToken: string
}): Promise<null | string> {
    const supabase = await supabaseServerSide()

    const { data, error } = await supabase.auth.setSession({
        access_token: params.accessToken,
        refresh_token: params.refreshToken,
    })

    if (error) {
        return null
    }

    return data.user?.id || null
}
