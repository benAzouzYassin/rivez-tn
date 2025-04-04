import { TSummarizeImages } from "@/app/api/summarize/images/route"
import { readCurrentSession } from "@/data-access/users/read"
import { fileToBase64 } from "@/utils/file"
import { partialParseJson } from "@/utils/json"
import { readStream } from "@/utils/stream"
import { z } from "zod"

const MAX_SIZE_BYTES = 3 * 1024 * 1024 // 3 MB

export const summarizeImages = async (
    data: {
        images: File[]
        language: string
    },
    onChange: (newValue: z.infer<typeof ResponseSchema>) => void,
    onFinish?: () => void
) => {
    const {
        data: { session },
    } = await readCurrentSession()
    if (!session) {
        throw new Error("Session error")
    }
    const imagesBase64 = await Promise.all(
        data.images.map(async (img) => await fileToBase64(img))
    )
    const body = {
        imagesBase64,
        language: data.language,
    } satisfies TSummarizeImages

    let totalSize = 0
    data.images.forEach((file) => {
        totalSize += file.size
    })
    if (totalSize > MAX_SIZE_BYTES) {
        throw new Error("Size is too large")
    }
    const response = await fetch("/api/summarize/images/", {
        method: "POST",
        headers: {
            "access-token": session.access_token,
            "refresh-token": session.refresh_token,
        },
        body: JSON.stringify(body),
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
                        ResponseSchema.safeParse(parsedJson)

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

const ResponseSchema = z.object({
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
