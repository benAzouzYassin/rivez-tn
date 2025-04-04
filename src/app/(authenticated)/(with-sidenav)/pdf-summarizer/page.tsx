"use client"

import { useEffect } from "react"

import PagesSelection from "./_components/pages-selection"
import { usePdfSummarizerStore } from "./store"
import { useSearchParams } from "next/navigation"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"
const FilesUpload = dynamic(() => import("./_components/files-uplod"), {
    ssr: false,
})
export default function Page() {
    const files = usePdfSummarizerStore((s) => s.files)
    const searchParams = useSearchParams()
    const shouldReset = searchParams.get("should-reset")
    const reset = usePdfSummarizerStore((s) => s.reset)
    const router = useRouter()
    useEffect(() => {
        if (shouldReset === "false") {
            return
        }
        reset()
    }, [reset, shouldReset])

    return (
        <section className=" relative items-center  min-h-[89vh] bg-neutral-50">
            <Button
                onClick={router.back}
                className="absolute font-bold text-neutral-500 top-4 left-4 "
                variant={"secondary"}
            >
                <ChevronLeft className="!w-5 !h-5 -mr-1 stroke-[2.5]" /> Back
            </Button>
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
