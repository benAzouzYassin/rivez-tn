import { supabase } from "@/lib/supabase-client-side"

export async function readCurrentUser() {
    const { data, error } = await supabase.auth.getUser()
    return {
        data: {
            id: data.user?.id,
            email: data.user?.email,
            emailConfirmedAt: data.user?.email_confirmed_at,
            isEmailConfirmed: !!data.user?.email_confirmed_at,

            phone: data.user?.phone,
            phoneConfirmedAt: data.user?.phone_confirmed_at,
            isPhoneConfirmed: !!data.user?.phone_confirmed_at,

            identities: data.user?.identities?.map((identity) => ({
                avatar: identity?.identity_data?.avatar_url,
                displayName:
                    identity?.identity_data?.displayName ||
                    identity?.identity_data?.name,
            })),

            createdAt: data.user?.created_at,
        },
        success: !error,
        error: {
            message: error?.message,
            stack: error?.stack,
        },
    }
}
export async function readCurrentSession() {
    const { data, error } = await supabase.auth.getSession()
    return {
        data: data,
        success: !error,
        error: {
            message: error?.message,
            stack: error?.stack,
        },
    }
}
