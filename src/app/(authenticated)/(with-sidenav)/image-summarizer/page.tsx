"use client"

import { ErrorDisplay } from "@/components/shared/error-display"
import GeneralLoadingScreen from "@/components/shared/general-loading-screen"
import { Button } from "@/components/ui/button"
import { handleRefund } from "@/data-access/summarize/images/handle-refund"
import { summarizeImages } from "@/data-access/summarize/images/summarize"
import { useRefetchUser } from "@/hooks/use-refetch-user"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"
import { useRef, useState } from "react"
import ImageUpload from "./_components/image-upload"
import PagesViewer from "./_components/pages-viewer"

export default function Page() {
    const refetchUser = useRefetchUser()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [result, setResult] = useState<TResult>({
        files: [] as any,
    })
    const [isStreaming, setIsStreaming] = useState(false)
    const didGenerate = useRef(false)

    const handleSummarize = (data: { images: File[]; language: string }) => {
        setIsLoading(true)
        summarizeImages(data, onStreamChange, onStreamEnd).catch((err) => {
            setIsError(true)
            handleRefund().catch(console.error)
            console.error(err)
        })
    }
    const onStreamChange = (data: TResult) => {
        if (!didGenerate.current) didGenerate.current = true

        if (data.files.at(0)?.markdownPages.length) {
            setIsLoading(false)
        }

        setResult((prev) => {
            if (
                data.files.flatMap((item) => item.markdownPages).length -
                    prev.files.flatMap((item) => item.markdownPages).length >=
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
    if (isError) {
        return <ErrorDisplay />
    }
    if (isLoading) {
        return <GeneralLoadingScreen text={"Processing your images"} />
    }
    return (
        <section className=" relative items-center  min-h-[89vh] bg-neutral-50">
            <Button
                onClick={router.back}
                className="absolute font-bold text-neutral-500 top-2 left-2 md:top-4 md:left-4 px-6  "
                variant={"secondary"}
            >
                <ArrowLeft className="!w-5 !h-5 scale-125 -mr-1 stroke-[2.5]" />{" "}
            </Button>
            <div className="flex items-center  justify-center">
                {result?.files?.[0]?.markdownPages?.length >= 1 ? (
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
                ) : (
                    <ImageUpload handleSummarize={handleSummarize} />
                )}
            </div>
        </section>
    )
}
type TResult = Parameters<Parameters<typeof summarizeImages>[1]>[0]
