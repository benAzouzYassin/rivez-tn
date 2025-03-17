import { supabase } from "@/lib/supabase-client-side"

export async function logoutUser() {
    localStorage.setItem("afterAuthRedirect", "/home")
    const { error } = await supabase.auth.signOut()
    return {
        data: {},
        success: !error,
        error: {
            message: error?.message,
            stack: error?.stack,
        },
    }
}
