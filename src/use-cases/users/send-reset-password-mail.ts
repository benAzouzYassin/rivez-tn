import { supabase } from "@/lib/supbase-client"

export async function sendResetPasswordMail(params: { email: string }) {
    const { error } = await supabase.auth.resetPasswordForEmail(params.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
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
