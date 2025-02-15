import { supabase } from "@/lib/supabase-client-side"

export async function registerUserWithGoogle(params?: { redirectTo?: string }) {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: params?.redirectTo,
        },
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
    const { data, error } = await supabase.auth.signUp({
        email: params.email,
        password: params.password,
        phone: params.phone,
        options: {
            data: {
                displayName: params.username,
            },
        },
    })

    if (params.phone) {
        await supabase.auth.updateUser({
            phone: params.phone,
        })
        if (data.user?.id) {
            await supabase
                .from("users_profiles")
                .update({
                    phone: params.phone,
                })
                .eq("user_id", data.user.id)
        }
    }

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
