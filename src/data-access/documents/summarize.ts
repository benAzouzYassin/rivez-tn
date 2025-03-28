import { TSummarizeMultiplePages } from "@/app/api/documents/summarize/multiple-pages/route"
import { BodyType } from "@/app/api/documents/summarize/single-page/route"
import { partialParseJson } from "@/utils/json"
import { readStream } from "@/utils/stream"
import { z } from "zod"
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
export const summarizeMultiplePage = async (
    data: TSummarizeMultiplePages,
    onChange: (newValue: z.infer<typeof MultiplePagesResponseSchema>) => void,
    onFinish?: () => void
) => {
    const {
        data: { session },
    } = await readCurrentSession()
    if (!session) {
        throw new Error("Session error")
    }

    const response = await fetch("/api/documents/summarize/multiple-pages", {
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
                        MultiplePagesResponseSchema.safeParse(parsedJson)

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

const MultiplePagesResponseSchema = z.object({
    files: z.array(
        z.object({
            id: z.string(),
            markdownPages: z.array(
                z.object({
                    number: z.number(),
                    content: z.array(z.string()),
                })
            ),
            name: z.string(),
        })
    ),
})
