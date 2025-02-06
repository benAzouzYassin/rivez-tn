import { supabase } from "@/lib/supabase-client-side"

export async function sendResetPasswordMail(params: {
    email: string
    redirectTo: string
}) {
    const { error } = await supabase.auth.resetPasswordForEmail(params.email, {
        redirectTo: params.redirectTo,
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
