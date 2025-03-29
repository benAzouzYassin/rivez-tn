import { TEditMindMap } from "@/app/api/mindmap/generate/edit/route"
import { partialParseJson } from "@/utils/json"
import { readStream } from "@/utils/stream"
import { readCurrentSession } from "../users/read"
import { GeneratedMindmapSchema, TGeneratedMindmap } from "./constants"

export const generateEditedVersion = async (
    data: TEditMindMap,
    onChange: (newValue: TGeneratedMindmap) => void,
    onFinish?: () => void
) => {
    const {
        data: { session },
    } = await readCurrentSession()
    if (!session) {
        throw new Error("Session error")
    }

    const response = await fetch("/api/mindmap/generate/edit", {
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
                try {
                    const parsedJson = partialParseJson(result)

                    const { data, success } =
                        GeneratedMindmapSchema.safeParse(parsedJson)
                    if (data && success) {
                        onChange(parsedJson)
                    }
                } catch {}
            },
            onFinish
        )
    } else {
        throw new Error("no stream to read data")
    }
}
