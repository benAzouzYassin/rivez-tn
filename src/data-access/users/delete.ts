import axios from "axios"
import { readCurrentSession } from "./read"

export async function deleteUser(userId: string) {
    const {
        data: { session },
    } = await readCurrentSession()
    if (!session) {
        throw new Error("Session error")
    }

    try {
        const response = await axios.delete(
            `/api/user/delete-user?user_id=${userId}`,
            {
                headers: {
                    "access-token": session.access_token,
                    "refresh-token": session.refresh_token,
                },
            }
        )

        return response.data as string
    } catch (error) {
        console.error("Error deleting the user", error)
        throw error
    }
}
