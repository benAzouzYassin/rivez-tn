"use client"
import { ErrorDisplay } from "@/components/shared/error-display"
import GeneralLoadingScreen from "@/components/shared/general-loading-screen"
import { Button } from "@/components/ui/button"
import { summarizePage } from "@/data-access/documents/summarize"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import ReactMarkdown from "react-markdown"
import { usePdfSummarizerStore } from "../store"
import "./styles.css"
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
            }
        }

        summarizePage({ pageContent }, onChunkReceive, onStreamEnd).catch(
            (err) => {
                setIsError(true)
                console.error(err)
            }
        )
    }, [pageContent])

    if (isError || !pageContent) {
        return <ErrorDisplay />
    }
    if (isLoading) {
        return <GeneralLoadingScreen text={"Summarizing your page"} />
    }
    return (
        <section className="p-6">
            <Link href={"/pdf-summarizer?should-reset=false"}>
                <Button variant={"secondary"}>
                    <ChevronLeft className="stroke-[2.5] text-neutral-600" />
                    Back
                </Button>
            </Link>
            {!result && <GeneralLoadingScreen text={"Processing your data"} />}
            <div className="max-w-[950px] markdown-content mt-10 mx-auto px-8 pt-8 pb-5 border rounded-2xl">
                <ReactMarkdown>{result}</ReactMarkdown>
            </div>
        </section>
    )
}
