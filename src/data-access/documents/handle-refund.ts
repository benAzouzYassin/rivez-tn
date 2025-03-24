import axios from "axios"
import { readCurrentSession } from "../users/read"

export async function handleRefund() {
    const {
        data: { session },
    } = await readCurrentSession()
    if (!session) {
        throw new Error("Session error")
    }

    await axios.post(
        `/api/documents/summarize/handle-refund`,
        {},
        {
            headers: {
                "access-token": session.access_token,
                "refresh-token": session.refresh_token,
            },
        }
    )
}
