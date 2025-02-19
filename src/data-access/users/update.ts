import { supabase } from "@/lib/supabase-client-side"
import { readCurrentSession } from "./read"
import axios from "axios"

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

export async function banUser(userId: string) {
    const {
        data: { session },
    } = await readCurrentSession()
    if (!session) {
        throw new Error("Session error")
    }

    try {
        const response = await axios.patch(
            `/api/user/ban-user`,
            {
                userId,
            },
            {
                headers: {
                    "access-token": session.access_token,
                    "refresh-token": session.refresh_token,
                },
            }
        )

        return response.data as string
    } catch (error) {
        console.error("Error banning the user", error)
        throw error
    }
}

export async function unBanUser(userId: string) {
    const {
        data: { session },
    } = await readCurrentSession()
    if (!session) {
        throw new Error("Session error")
    }

    try {
        const response = await axios.patch(
            `/api/user/unban-user`,
            {
                userId,
            },
            {
                headers: {
                    "access-token": session.access_token,
                    "refresh-token": session.refresh_token,
                },
            }
        )

        return response.data as string
    } catch (error) {
        console.error("Error unbanning the user", error)
        throw error
    }
}
