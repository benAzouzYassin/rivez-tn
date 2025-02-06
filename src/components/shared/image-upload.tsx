"use client"

import { FileInput } from "@/components/ui/file-input"
import { deleteFile, uploadFile } from "@/utils/file-management"
import { useState } from "react"

interface Props {
    imageUrl: string | null
    onImageUrlChange: (value: Props["imageUrl"]) => void
}
export default function ImageUpload(props: Props) {
    const [isLoading, setIsLoading] = useState(false)
    return (
        <div className="flex min-h-[50vh] items-center justify-center">
            <FileInput
                allowDocument={false}
                allowImage
                previewAsImage
                isLoading={isLoading}
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
                        setIsLoading(true)
                        const url = await uploadFile(file)
                        props.onImageUrlChange(url)
                        setIsLoading(false)
                    } catch (error) {
                        console.error(error)
                        setIsLoading(false)
                    }
                }}
            />
        </div>
    )
}
