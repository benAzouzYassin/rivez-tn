import { BodyType } from "@/app/api/documents/summarize/single-page/route"
import { readStream } from "@/utils/stream"
import { readCurrentSession } from "../users/read"

export const summarizePage = async (
    data: BodyType,
    onChange: (newValue: string) => void,
    onFinish?: () => void
) => {
    const {
        data: { session },
    } = await readCurrentSession()
    if (!session) {
        throw new Error("Session error")
    }

    const response = await fetch("/api/documents/summarize/single-page", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "access-token": session.access_token,
            "refresh-token": session.refresh_token,
        },
        body: JSON.stringify(data),
    })
    if (response.status !== 200) {
        throw new Error("error while generating the quiz ")
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
