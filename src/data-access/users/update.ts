import { supabase } from "@/lib/supbase-client"

export async function updateUserPassword(params: { password: string }) {
    const { error } = await supabase.auth.updateUser({
        password: params.password,
    })
    return {
        data: {},
        success: !error,
        error: {
            message: error?.message,
            stack: error?.stack,
        },
    }
}
