"use client"

import { readSummaryById } from "@/data-access/summarize/read"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import PagesViewer from "./_components/page-viewer"
import { z } from "zod"
import PagesViewerSkeleton from "./_components/page-viewer-skeleton"
import { wait } from "@/utils/wait"
import { ErrorDisplay } from "@/components/shared/error-display"

export default function Page() {
    const params = useParams()
    const id = Number(params["id"])
    const { data, isFetching, isError } = useQuery({
        enabled: !!id && isNaN(id) === false,
        queryKey: ["summarizations", id],
        queryFn: () => readSummaryById({ id }),
    })
    const content =
        isFetching || isError ? null : schema.safeParse(data?.content)

    if (isFetching) {
        return <PagesViewerSkeleton />
    }

    if (isError) {
        return <ErrorDisplay />
    }
    if (content?.success === false || !content?.data.files.length) {
        return <ErrorDisplay />
    }

    return (
        <div>
            <PagesViewer
                files={content.data.files.map((f) => {
                    return {
                        ...f,
                        markdownPages: f.markdownPages.map((page) =>
                            page?.content?.join("\n")
                        ),
                    }
                })}
            />
        </div>
    )
}

const schema = z.object({
    files: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
            markdownPages: z.array(
                z.object({
                    number: z.number(),
                    content: z.array(z.string()),
                })
            ),
        })
    ),
})
