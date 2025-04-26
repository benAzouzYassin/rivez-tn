"use client"

import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import dynamic from "next/dynamic"
import { useSearchParams } from "next/navigation"
import { useRouter } from "nextjs-toploader/app"
import PagesSelection from "./_components/pages-selection"
import { usePdfSummarizerStore } from "./store"
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
            {!files.length && (
                <Button
                    onClick={router.back}
                    className="absolute font-bold text-neutral-500 top-2 left-2 md:top-4 md:left-4 px-6  "
                    variant={"secondary"}
                >
                    <ArrowLeft className="!w-5 !h-5 scale-125 -mr-1 stroke-[2.5]" />{" "}
                </Button>
            )}
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
