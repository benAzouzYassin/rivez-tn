import { TGenMindMapFromText } from "@/app/api/mindmap/generate/from-text/route"
import { partialParseJson } from "@/utils/json"
import { readStream } from "@/utils/stream"
import { readCurrentSession } from "../users/read"
import { GeneratedMindmapSchema, TGeneratedMindmap } from "./constants"
import { TGenMindMapFromPDF } from "@/app/api/mindmap/generate/from-pdf/route"

export const generateMindMapFromText = async (
    data: TGenMindMapFromText,
    onChange: (newValue: TGeneratedMindmap) => void,
    onFinish?: () => void
) => {
    const {
        data: { session },
    } = await readCurrentSession()
    if (!session) {
        throw new Error("Session error")
    }

    const response = await fetch("/api/mindmap/generate/from-text", {
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

export const generateMindMapFromPDF = async (
    data: TGenMindMapFromPDF,
    onChange: (newValue: TGeneratedMindmap) => void,
    onFinish?: () => void
) => {
    const {
        data: { session },
    } = await readCurrentSession()
    if (!session) {
        throw new Error("Session error")
    }

    const response = await fetch("/api/mindmap/generate/from-pdf", {
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
