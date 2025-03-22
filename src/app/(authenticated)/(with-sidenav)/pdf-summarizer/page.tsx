"use client"

import FilesUpload from "./_components/files-uplod"
import PagesSelection from "./_components/pages-selection"
import { usePdfSummarizerStore } from "./store"

export default function Page() {
    const files = usePdfSummarizerStore((s) => s.files)
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
