import { TMindmapRefund } from "@/app/api/mindmap/handle-refund/route"
import { readCurrentSession } from "../users/read"
import axios from "axios"

export async function handleMindMapRefund(data: TMindmapRefund) {
    const {
        data: { session },
    } = await readCurrentSession()
    if (!session) {
        throw new Error("Session error")
    }
    await axios.post(`/api/mindmap/handle-refund`, data, {
        headers: {
            "access-token": session.access_token,
            "refresh-token": session.refresh_token,
        },
    })
}
