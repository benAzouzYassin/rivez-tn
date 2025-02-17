import { supabase } from "@/lib/supabase-client-side"

export async function readCurrentUser() {
    const userResponse = await supabase.auth.getUser()
    if (userResponse.error) {
        return {
            data: {},
            success: false,
            error: userResponse.error,
        }
    }

    const userRoleResponse = await supabase
        .from("user_roles")
        .select("user_role")
        .eq("user_id", userResponse.data.user.id)
        .single()
    if (userRoleResponse.error) {
        return {
            data: {},
            success: false,
            error: userResponse.error,
        }
    }
    const userData = userRoleResponse.data
    return {
        data: {
            user_role: userData.user_role,
            id: userResponse.data.user?.id,
            email: userResponse.data.user?.email,
            emailConfirmedAt: userResponse.data.user?.email_confirmed_at,
            isEmailConfirmed: !!userResponse.data.user?.email_confirmed_at,
            phone: userResponse.data.user?.phone,
            phoneConfirmedAt: userResponse.data.user?.phone_confirmed_at,
            isPhoneConfirmed: !!userResponse.data.user?.phone_confirmed_at,
            identities: userResponse.data.user?.identities?.map((identity) => ({
                avatar: identity?.identity_data?.avatar_url,
                displayName:
                    identity?.identity_data?.displayName ||
                    identity?.identity_data?.name,
            })),
            createdAt: userResponse.data.user?.created_at,
        },
        success: true,
        error: {
            message: null,
            stack: null,
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
