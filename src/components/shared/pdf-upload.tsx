"use client"

import { FileInput } from "@/components/ui/file-input"
import { deleteFile, uploadFile } from "@/utils/file-management"
import { ReactNode, useRef } from "react"

interface Props {
    pdfUrl: string | null
    className?: string
    isLoading: boolean
    onLoadingChange: (value: boolean) => void
    onPdfUrlChange: (value: Props["pdfUrl"]) => void
    renderEmptyContent?: () => ReactNode
    containerClassName?: string
    imageClassName?: string
    displayCancelBtn?: boolean
    fileName?: string
    onFileNameChange: (value: string | null) => void
}
export default function PdfUpload(props: Props) {
    const abortControllerRef = useRef<AbortController | null>(null)
    const handleCancel = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
            props.onPdfUrlChange(props.pdfUrl || null)
        }
    }

    return (
        <FileInput
            fileName={props.fileName || ""}
            containerClassName={props.containerClassName}
            renderEmptyContent={props.renderEmptyContent}
            className={props.className}
            allowDocument={true}
            allowImage={false}
            previewAsImage={false}
            previewAsDocument={true}
            isLoading={props.isLoading}
            displayCancelBtn={props.displayCancelBtn}
            onCancel={handleCancel}
            preview={props.pdfUrl || undefined}
            onChange={async (file) => {
                if (!file) {
                    if (props.pdfUrl) {
                        deleteFile(props.pdfUrl).catch((err) => {
                            props.onPdfUrlChange(null)
                            console.error("error deleting the image", err)
                        })
                    }

                    return props.onPdfUrlChange(null)
                }
                props.onFileNameChange(file.name || null)
                try {
                    props.onLoadingChange?.(true)
                    const abortController = new AbortController()
                    abortControllerRef.current = abortController
                    const url = await uploadFile(file, abortController)
                    props.onPdfUrlChange(url)
                    props.onLoadingChange?.(false)
                } catch (error) {
                    console.error(error)
                    props.onLoadingChange?.(false)
                } finally {
                    abortControllerRef.current = null
                }
            }}
        />
    )
}
