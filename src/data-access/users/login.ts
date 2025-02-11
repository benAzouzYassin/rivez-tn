import { supabase } from "@/lib/supabase-client-side"

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

export async function loginUserWithGoogle(params?: { redirectTo?: string }) {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: params?.redirectTo },
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
