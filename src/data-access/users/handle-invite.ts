import axios from "axios"
import { readCurrentSession } from "./read"

export async function handleInvite(inviteCode: string) {
    const {
        data: { session },
    } = await readCurrentSession()
    if (inviteCode) {
        await axios.post(
            "/api/user/accept-invite",
            {
                inviterId: inviteCode,
                invitedId: session?.user.id,
            },
            {
                headers: {
                    "access-token": session?.access_token,
                    "refresh-token": session?.refresh_token,
                },
            }
        )
    }
}
