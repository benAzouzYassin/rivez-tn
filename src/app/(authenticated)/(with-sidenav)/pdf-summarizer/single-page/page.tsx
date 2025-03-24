"use client"
import { ErrorDisplay } from "@/components/shared/error-display"
import { useReactToPrint } from "react-to-print"
import GeneralLoadingScreen from "@/components/shared/general-loading-screen"
import Markdown from "@/components/shared/markdown"
import { Button } from "@/components/ui/button"
import { summarizePage } from "@/data-access/documents/summarize"
import { ChevronLeft, Download, Printer } from "lucide-react"
import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import { usePdfSummarizerStore } from "../store"
import { handleRefund } from "@/data-access/documents/handle-refund"
export default function Page() {
    const [isError, setIsError] = useState(false)
    const [result, setResult] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const openPageLocalId = usePdfSummarizerStore((s) => s.openPageLocalId)
    const getPage = usePdfSummarizerStore((s) => s.getPageContent)
    const pageContent = useMemo(() => {
        if (openPageLocalId) {
            return getPage(openPageLocalId)
        }

        return null
    }, [getPage, openPageLocalId])

    useEffect(() => {
        setIsLoading(true)
        let didGenerate = false
        if (!pageContent) return

        const onChunkReceive = (data: string) => {
            if (!didGenerate) didGenerate = true
            try {
                setResult(data)
            } catch {}
        }

        const onStreamEnd = () => {
            setIsLoading(false)
            if (!didGenerate) {
                setIsError(true)
                handleRefund().catch(console.error)
            }
        }

        summarizePage({ pageContent }, onChunkReceive, onStreamEnd).catch(
            (err) => {
                setIsError(true)
                console.error(err)
                handleRefund().catch(console.error)
            }
        )
    }, [pageContent])

    const markdownRef = useRef<HTMLDivElement>(null)
    const reactToPrintFn = useReactToPrint({
        contentRef: markdownRef,
    })
    if (isError || !pageContent) {
        return <ErrorDisplay />
    }
    if (isLoading) {
        return <GeneralLoadingScreen text={"Summarizing your page"} />
    }
    return (
        <section className="p-6">
            <Link
                href={"/pdf-summarizer?should-reset=false"}
                className="print:hidden"
            >
                <Button variant={"secondary"}>
                    <ChevronLeft className="stroke-[2.5] text-neutral-600" />
                    Back
                </Button>
            </Link>
            {!result && <GeneralLoadingScreen text={"Processing your data"} />}
            <div
                ref={markdownRef}
                className="max-w-[950px]   relative markdown-content print:mt-0 mt-10 mx-auto px-8 pt-8 pb-5 border rounded-2xl"
            >
                <Button
                    className="absolute text-lg !font-medium print:hidden top-4 right-4"
                    onClick={() => reactToPrintFn()}
                    variant={"secondary"}
                >
                    <Download className="!w-5 !h-5" />
                    Save
                </Button>
                <Markdown content={result} />
            </div>
        </section>
    )
}
