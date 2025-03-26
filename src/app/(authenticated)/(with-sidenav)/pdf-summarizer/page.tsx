"use client"

import { useEffect } from "react"

import PagesSelection from "./_components/pages-selection"
import { usePdfSummarizerStore } from "./store"
import { useSearchParams } from "next/navigation"
import dynamic from "next/dynamic"
const FilesUpload = dynamic(() => import("./_components/files-uplod"), {
    ssr: false,
})
export default function Page() {
    const files = usePdfSummarizerStore((s) => s.files)
    const searchParams = useSearchParams()
    const shouldReset = searchParams.get("should-reset")
    const reset = usePdfSummarizerStore((s) => s.reset)

    useEffect(() => {
        if (shouldReset === "false") {
            return
        }
        reset()
    }, [reset, shouldReset])

    return (
        <section className=" items-center  min-h-[89vh] bg-neutral-50">
            {files.length ? (
                <div className="px-6 bg-white ">
                    <PagesSelection />
                </div>
            ) : (
                <div className="flex items-center  justify-center">
                    <FilesUpload />
                </div>
            )}
        </section>
    )
}
