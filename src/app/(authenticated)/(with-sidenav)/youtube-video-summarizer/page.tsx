"use client"

import { ErrorDisplay } from "@/components/shared/error-display"
import GeneralLoadingScreen from "@/components/shared/general-loading-screen"
import { Button } from "@/components/ui/button"
import { handleRefund } from "@/data-access/summarize/youtube-video/handle-refund"
import { summarizeYoutubeVideo } from "@/data-access/summarize/youtube-video/summarize"
import { useRefetchUser } from "@/hooks/use-refetch-user"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"
import { useQueryState } from "nuqs"
import { useEffect, useRef, useState } from "react"
import PagesViewer from "./_components/pages-viewer"

export default function Page() {
    const [youtubeLink] = useQueryState("youtubeLink")
    const [language] = useQueryState("language")
    const refetchUser = useRefetchUser()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [result, setResult] = useState<TResult>({
        files: [] as any,
    })
    const [isStreaming, setIsStreaming] = useState(false)
    const didGenerate = useRef(false)

    useEffect(() => {
        const onStreamChange = (data: TResult) => {
            if (!didGenerate.current) didGenerate.current = true

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
                handleRefund().catch(console.error)
            } else {
                refetchUser()
            }
        }

        if (!youtubeLink) {
            return setIsError(true)
        }
        setIsLoading(true)
        summarizeYoutubeVideo(
            {
                language,
                youtubeLink,
            },
            onStreamChange,
            onStreamEnd
        ).catch((err) => {
            setIsError(true)
            handleRefund().catch(console.error)
            console.error(err)
        })
    }, [language, refetchUser, youtubeLink])
    if (isError) {
        return <ErrorDisplay />
    }
    if (isLoading) {
        return <GeneralLoadingScreen text={"Processing your video"} />
    }
    return (
        <section className=" relative items-center  min-h-[89vh] bg-neutral-50">
            <Button
                onClick={router.back}
                className="absolute font-bold text-neutral-500 top-4 left-4 "
                variant={"secondary"}
            >
                <ChevronLeft className="!w-5 !h-5 -mr-1 stroke-[2.5]" /> Back
            </Button>
            <div className="flex items-center  justify-center">
                {result?.files?.[0]?.markdownPages?.length >= 1 && (
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
            </div>
        </section>
    )
}
type TResult = Parameters<Parameters<typeof summarizeYoutubeVideo>[1]>[0]
