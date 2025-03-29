import { TMindMapItemExplanation } from "@/app/api/mindmap/generate/explanation/route"
import { readCurrentSession } from "../users/read"
import { readStream } from "@/utils/stream"

export const explainNode = async (
    data: TMindMapItemExplanation,
    onChange: (newValue: string) => void,
    onFinish?: () => void
) => {
    const {
        data: { session },
    } = await readCurrentSession()
    if (!session) {
        throw new Error("Session error")
    }

    const response = await fetch("/api/mindmap/generate/explanation", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "access-token": session.access_token,
            "refresh-token": session.refresh_token,
        },
        body: JSON.stringify(data),
    })
    if (response.status !== 200) {
        throw new Error("error while generating the response ")
    }
    const reader = response?.body?.getReader()

    let result = ""
    if (reader) {
        readStream(
            reader,
            (chunk) => {
                result += chunk
                onChange(result)
            },
            onFinish
        )
    } else {
        throw new Error("no stream to read data")
    }
}
