"use client"

import { FileTextIcon } from "lucide-react"

import { FileInput } from "@/components/ui/file-input"
import { dismissToasts, toastError, toastLoading } from "@/lib/toasts"
import { parsePdf } from "client-side-pdf-parser"
import { useState } from "react"

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
                setIsUploadingPdf(true)
                toastLoading("Uploading your pdf...")
                try {
                    if (file) {
                        const content = await parsePdf(file)
                        props.onPDFPagesChanges(content || [])
                        setFileName(file.name)
                    } else {
                        setFileName("")
                        props.onPDFPagesChanges([])
                    }
                } catch (error) {
                    toastError("Something went wrong...")
                } finally {
                    dismissToasts("loading")
                }
                setIsUploadingPdf(false)
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
                        Images (PNG, JPG, GIF) or Documents (PDF, DOC, DOCX,
                        XLS, XLSX)
                    </p>
                    <p className="text-xs text-neutral-400">up to 10MB</p>
                </>
            )}
        />
    )
}
