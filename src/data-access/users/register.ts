import { supabase } from "@/lib/supbase-client"

export async function registerUserWithGoogle() {
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

export async function registerUserWithPassword(params: {
    email: string
    password: string
    phone?: string
    username: string
}) {
    console.log(params)
    const { data, error } = await supabase.auth.signUp({
        email: params.email,
        password: params.password,
        phone: params.password,
        options: {
            data: {
                displayName: params.username,
            },
        },
    })
    return {
        data: {
            user: {
                createdAt: data.user?.created_at,
                email: data.user?.email,
                id: data.user?.id,
                phone: data.user?.phone,
                role: data.user?.role,
                displayName:
                    data.user?.identities?.[0].identity_data?.displayName,
            },
        },
        success: !error,
        error: {
            message: error?.message,
            stack: error?.stack,
        },
    }
}
