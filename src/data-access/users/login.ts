import { supabase } from "@/lib/supbase-client"

export async function loginUserWithPassword(params: {
    email: string
    password: string
}) {
    const { error } = await supabase.auth.signInWithPassword(params)
    return {
        data: {},
        success: !error,
        error: {
            message: error?.message,
            stack: error?.stack,
        },
    }
}

export async function loginUserWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
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
