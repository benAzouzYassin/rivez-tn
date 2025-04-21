"use client"
import { ErrorDisplay } from "@/components/shared/error-display"
import GeneralLoadingScreen from "@/components/shared/general-loading-screen"
import InsufficientCreditsDialog from "@/components/shared/insufficient-credits-dialog"
import { lowPrice } from "@/constants/prices"
import { handleRefund } from "@/data-access/documents/handle-refund"
import { summarizeMultiplePage } from "@/data-access/documents/summarize"
import { readCurrentUser } from "@/data-access/users/read"
import { useRefetchUser } from "@/hooks/use-refetch-user"
import { toastError } from "@/lib/toasts"
import { useSearchParams } from "next/navigation"
import { useRouter } from "nextjs-toploader/app"
import { useEffect, useRef, useState } from "react"
import { usePdfSummarizerStore } from "../store"
import PagesViewer from "./_components/pages-viewer"

export default function Page() {
    const [isInsufficientCredits, setIsInsufficientCredits] = useState(false)
    const refetchUser = useRefetchUser()
    const searchParams = useSearchParams()
    const startedGenerating = useRef(false)
    const [isStreaming, setIsStreaming] = useState(false)
    const [isError, setIsError] = useState(false)
    const [result, setResult] = useState<TResult>({ files: [] })
    const [isLoading, setIsLoading] = useState(false)
    const getSelectedPages = usePdfSummarizerStore((s) => s.getSelectedPages)
    const router = useRouter()
    useEffect(() => {
        if (startedGenerating.current === true) return
        const data = getSelectedPages()
        const price = (lowPrice / 5) * data.length
        setIsLoading(true)
        readCurrentUser()
            .then((currentUser) => {
                if (Number(currentUser?.data.credit_balance) < price) {
                    setIsLoading(false)
                    return setIsInsufficientCredits(true)
                }

                startedGenerating.current = true
                setIsStreaming(true)

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
                            data.files.flatMap((item) => item.markdownPages)
                                .length -
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
                        handleRefund().catch(console.error)
                    } else {
                        refetchUser()
                    }
                }
                const lang = searchParams.get("lang") || null

                summarizeMultiplePage(
                    { files: getSelectedPages(), language: lang },
                    onResultChange,
                    onStreamEnd
                ).catch((err) => {
                    setIsError(true)
                    handleRefund().catch(console.error)
                    console.error(err)
                })
            })
            .catch((err) => {
                setIsLoading(false)
                toastError("something went wrong")
            })
    }, [getSelectedPages, refetchUser, searchParams])

    if (isError) {
        return <ErrorDisplay />
    }
    if (isLoading) {
        return <GeneralLoadingScreen text={"Summarizing your pages"} />
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
            <InsufficientCreditsDialog
                isOpen={isInsufficientCredits}
                onOpenChange={(value) => {
                    if (value === false) {
                        router.back()
                    }
                    setIsInsufficientCredits(value)
                }}
            />
        </section>
    )
}

type TResult = Parameters<Parameters<typeof summarizeMultiplePage>[1]>[0]
