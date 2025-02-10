"use client"

import { FileInput } from "@/components/ui/file-input"
import { deleteFile, uploadFile } from "@/utils/file-management"
import { ReactNode, useRef } from "react"

interface Props {
    imageUrl: string | null
    className?: string
    isLoading: boolean
    onLoadingChange: (value: boolean) => void
    onImageUrlChange: (value: Props["imageUrl"]) => void
    renderEmptyContent?: () => ReactNode
    containerClassName?: string
    imageClassName?: string
    displayCancelBtn?: boolean
}
export default function ImageUpload(props: Props) {
    const abortControllerRef = useRef<AbortController | null>(null)
    const handleCancel = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
            props.onImageUrlChange(props.imageUrl || null)
        }
    }

    return (
        <FileInput
            imageClassName={props.imageClassName}
            containerClassName={props.containerClassName}
            renderEmptyContent={props.renderEmptyContent}
            className={props.className}
            allowDocument={false}
            allowImage
            previewAsImage
            isLoading={props.isLoading}
            displayCancelBtn={props.displayCancelBtn}
            onCancel={handleCancel}
            preview={props.imageUrl || undefined}
            onChange={async (file) => {
                if (!file) {
                    if (props.imageUrl) {
                        deleteFile(props.imageUrl).catch((err) => {
                            props.onImageUrlChange(null)
                            console.error("error deleting the image", err)
                        })
                    }
                    return props.onImageUrlChange(null)
                }
                try {
                    props.onLoadingChange?.(true)
                    const abortController = new AbortController()
                    abortControllerRef.current = abortController
                    const url = await uploadFile(file, abortController)
                    props.onImageUrlChange(url)
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
