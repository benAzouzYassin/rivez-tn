import { readCurrentSession } from "@/data-access/users/read"
import axios from "axios"

export async function handleRefund() {
    const {
        data: { session },
    } = await readCurrentSession()
    if (!session) {
        throw new Error("Session error")
    }

    await axios.post(
        `/api/summarize/images/handle-refund`,
        {},
        {
            headers: {
                "access-token": session.access_token,
                "refresh-token": session.refresh_token,
            },
        }
    )
}
