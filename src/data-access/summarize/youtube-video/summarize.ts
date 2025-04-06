import { TSummarizeYoutubeVideo } from "@/app/api/summarize/youtube-video/route"
import { readCurrentSession } from "@/data-access/users/read"
import { partialParseJson } from "@/utils/json"
import { readStream } from "@/utils/stream"
import { z } from "zod"

export const summarizeYoutubeVideo = async (
    data: {
        youtubeLink: string
        language: string | null
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

    const body = {
        youtubeLink: data.youtubeLink,
        language: data.language,
    } satisfies TSummarizeYoutubeVideo

    const response = await fetch("/api/summarize/youtube-video/", {
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
