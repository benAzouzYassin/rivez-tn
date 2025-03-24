"use client"
import { ErrorDisplay } from "@/components/shared/error-display"
import GeneralLoadingScreen from "@/components/shared/general-loading-screen"
import { summarizeMultiplePage } from "@/data-access/documents/summarize"
import { useEffect, useRef, useState } from "react"
import { useReactToPrint } from "react-to-print"
import { usePdfSummarizerStore } from "../store"
import PagesViewer from "./_components/pages-viewer"

export default function Page() {
    const [isStreaming, setIsStreaming] = useState(false)
    const [isError, setIsError] = useState(false)
    const [result, setResult] = useState<TResult>({ files: [] })
    const [isLoading, setIsLoading] = useState(false)
    const getSelectedPages = usePdfSummarizerStore((s) => s.getSelectedPages)
    useEffect(() => {
        setIsLoading(true)
        setIsStreaming(true)
        const data = getSelectedPages()
        if (data.length < 1) {
            setIsError(true)
            setIsLoading(false)
            return
        }

        let didGenerate = false
        const onResultChange = (data: TResult) => {
            if (!didGenerate) didGenerate = true
            if (data.files.at(0)?.markdownPages.length) {
                setIsLoading(false)
            }

            setResult((prev) => {
                if (
                    data.files.flatMap((item) => item.markdownPages).length -
                        prev.files.flatMap((item) => item.markdownPages)
                            .length >=
                    0
                ) {
                    return data
                }
                return prev
            })
        }

        const onStreamEnd = () => {
            setIsLoading(false)
            setIsStreaming(false)

            if (!didGenerate) {
                setIsError(true)
            }
        }

        summarizeMultiplePage(
            { files: getSelectedPages() },
            onResultChange,
            onStreamEnd
        ).catch((err) => {
            setIsError(true)
            console.error(err)
        })
    }, [getSelectedPages])

    const markdownRef = useRef<HTMLDivElement>(null)

    const reactToPrintFn = useReactToPrint({
        contentRef: markdownRef,
    })
    if (isError) {
        return <ErrorDisplay />
    }
    if (isLoading) {
        return <GeneralLoadingScreen text={"Summarizing your page"} />
    }
    return (
        <section className="">
            {result.files?.[0]?.markdownPages?.length >= 1 && (
                <PagesViewer
                    isStreaming={isStreaming}
                    files={result.files.map((f) => {
                        return {
                            ...f,
                            markdownPages: f.markdownPages.map((page) =>
                                page?.content?.join("\n")
                            ),
                        }
                    })}
                />
            )}
        </section>
    )
}

type TResult = Parameters<Parameters<typeof summarizeMultiplePage>[1]>[0]
