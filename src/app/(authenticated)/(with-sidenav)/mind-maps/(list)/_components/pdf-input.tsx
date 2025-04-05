"use client"

import { FileTextIcon } from "lucide-react"
import { FileInput } from "@/components/ui/file-input"
import { dismissToasts, toastError, toastLoading } from "@/lib/toasts"
import { useState } from "react"
import { z } from "zod"

type Props = {
    onPDFPagesChanges: (value: string[]) => void
}
export default function PdfInput(props: Props) {
    const [isUploadingPdf, setIsUploadingPdf] = useState(false)
    const [fileName, setFileName] = useState("")
    return (
        <FileInput
            fileName={fileName}
            isLoading={isUploadingPdf}
            onChange={async (file) => {
                toastLoading("Uploading your pdf...")
                try {
                    if (file) {
                        const workerInstance = new window.Worker(
                            "/pdfjs/pdf-parser-worker.js",
                            { type: "module" }
                        )
                        setIsUploadingPdf(true)
                        workerInstance.postMessage({
                            file,
                        })
                        workerInstance.onmessage = (event) => {
                            if (event.data.result) {
                                const content = event.data.result
                                setIsUploadingPdf(false)
                                const { data, success } = z
                                    .array(z.string())
                                    .safeParse(content)
                                if (success) {
                                    props.onPDFPagesChanges(data || [])
                                    setFileName(file.name)
                                } else {
                                    throw new Error(
                                        "Error while parsing the pdf."
                                    )
                                }
                                workerInstance.terminate()
                            }
                        }
                    } else {
                        setFileName("")
                        props.onPDFPagesChanges([])
                    }
                } catch (error) {
                    toastError("Something went wrong...")
                    setIsUploadingPdf(false)
                } finally {
                    dismissToasts("loading")
                }
            }}
            allowDocument
            previewAsDocument
            previewAsImage={false}
            allowImage={false}
            renderEmptyContent={() => (
                <>
                    <FileTextIcon className="w-10 h-10 mb-2 mx-auto text-red-400" />
                    <p className="text-neutral-600 mb-2">
                        Drag & drop a pdf file here
                    </p>
                    <p className="text-sm text-neutral-500">
                        or click to select a file
                    </p>
                    <p className="text-xs text-neutral-400 mt-2">
                        PDF Documents
                    </p>
                    <p className="text-xs text-neutral-400">up to 5MB</p>
                </>
            )}
        />
    )
}
