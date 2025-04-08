"use client"
import { ErrorDisplay } from "@/components/shared/error-display"
import GeneralLoadingScreen from "@/components/shared/general-loading-screen"
import Markdown from "@/components/shared/markdown"
import { Button } from "@/components/ui/button"
import { handleRefund } from "@/data-access/documents/handle-refund"
import { summarizePage } from "@/data-access/documents/summarize"
import { useRefetchUser } from "@/hooks/use-refetch-user"
import { ChevronLeft, Download, HelpCircle } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { useReactToPrint } from "react-to-print"
import GenerateQuizDialog from "../_components/generate-quiz-dialog"
import { usePdfSummarizerStore } from "../store"
export default function Page() {
    const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false)
    const refetchUser = useRefetchUser()
    const [isError, setIsError] = useState(false)
    const [result, setResult] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const searchParams = useSearchParams()
    const startedGenerating = useRef(false)
    const [isPrinting, setIsPrinting] = useState(false)
    const openPageLocalId = usePdfSummarizerStore((s) => s.openPageLocalId)
    const getPage = usePdfSummarizerStore((s) => s.getPageContent)
    const pageContent = useMemo(() => {
        if (openPageLocalId) {
            return getPage(openPageLocalId)
        }

        return null
    }, [getPage, openPageLocalId])

    useEffect(() => {
        if (startedGenerating.current === true) return
        startedGenerating.current = true
        setIsLoading(true)
        let didGenerate = false
        if (!pageContent) return

        const onChunkReceive = (data: string) => {
            if (!didGenerate) didGenerate = true
            try {
                setIsLoading(false)
                setResult(data)
            } catch {}
        }

        const onStreamEnd = () => {
            setIsLoading(false)
            if (!didGenerate) {
                setIsError(true)
                handleRefund().catch(console.error)
            } else {
                refetchUser()
            }
        }
        const lang = searchParams.get("lang") || null

        summarizePage(
            { pageContent, language: lang },
            onChunkReceive,
            onStreamEnd
        ).catch((err) => {
            setIsError(true)
            console.error(err)
            handleRefund().catch(console.error)
        })
    }, [pageContent, refetchUser, searchParams])

    const markdownRef = useRef<HTMLDivElement>(null)
    const reactToPrintFn = useReactToPrint({
        contentRef: markdownRef,
        documentTitle: generateShortTitle(result),
        onAfterPrint: () => {
            setIsPrinting(false)
        },
    })
    const handleConvertToQuiz = () => {
        setIsQuizDialogOpen(true)
    }
    if (isError || !pageContent) {
        return <ErrorDisplay />
    }
    if (isLoading) {
        return <GeneralLoadingScreen text={"Summarizing your page"} />
    }
    return (
        <section className="p-6">
            {!result && <GeneralLoadingScreen text={"Processing your data"} />}
            <div
                ref={markdownRef}
                className="max-w-[950px]   relative markdown-content print:mt-0 mt-2 mx-auto px-8 pt-8 pb-5 border rounded-2xl"
            >
                <div className="absolute flex items-center gap-4  print:hidden top-4 right-4">
                    <Button
                        className=" text-lg !font-medium"
                        onClick={() => {
                            setIsPrinting(true)
                            reactToPrintFn()
                        }}
                        isLoading={isPrinting}
                    >
                        <Download className="!w-5 !h-5" />
                        Save
                    </Button>
                    <Button
                        className=" text-lg !font-medium"
                        onClick={handleConvertToQuiz}
                        variant={"blue"}
                        isLoading={isPrinting}
                    >
                        <HelpCircle className="!w-5 !h-5" />
                        Convert to quiz
                    </Button>
                </div>
                <Markdown content={result} />
            </div>
            <GenerateQuizDialog
                content={result}
                isOpen={isQuizDialogOpen}
                onOpenChange={setIsQuizDialogOpen}
            />
        </section>
    )
}
function generateShortTitle(page: string): string {
    const title = page?.split("\n")?.[0]?.replace?.("# ", "")
    if (title.includes(":")) {
        return title.split(":")[1].trim()
    } else if (title.length > 20) {
        return title.substring(0, 20) + "..."
    } else {
        return title || "Overview"
    }
}
