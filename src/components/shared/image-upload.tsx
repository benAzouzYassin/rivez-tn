"use client"

import { FileInput } from "@/components/ui/file-input"
import { deleteFile, uploadFile } from "@/utils/file-management"

interface Props {
    imageUrl: string | null
    className?: string
    isLoading: boolean
    onLoadingChange: (value: boolean) => void
    onImageUrlChange: (value: Props["imageUrl"]) => void
}
export default function ImageUpload(props: Props) {
    return (
        <FileInput
            className={props.className}
            allowDocument={false}
            allowImage
            previewAsImage
            isLoading={props.isLoading}
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
                    const url = await uploadFile(file)
                    props.onImageUrlChange(url)
                    props.onLoadingChange?.(false)
                } catch (error) {
                    console.error(error)
                    props.onLoadingChange?.(false)
                }
            }}
        />
    )
}
