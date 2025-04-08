"use client"

import { MultipleFileInput } from "@/components/ui/multiple-file-input"
import { dismissToasts, toastError, toastLoading } from "@/lib/toasts"
import { fileToBase64 } from "@/utils/file"
import { ImageIcon } from "lucide-react"
import { useState } from "react"

type Props = {
    onChange: (base64Images: string[]) => void
}
export default function ImagesInput(props: Props) {
    const [isUploading, setIsUploading] = useState(false)
    return (
        <MultipleFileInput
            isLoading={isUploading}
            onChange={async (files) => {
                toastLoading("Uploading your image...")
                try {
                    if (files.length) {
                        setIsUploading(true)

                        const imagesInBase64 = await Promise.all(
                            files.map(async (f) => {
                                return await fileToBase64(f)
                            })
                        )

                        props.onChange(imagesInBase64)
                        setIsUploading(false)
                    } else {
                        props.onChange([])
                    }
                } catch (error) {
                    toastError("Something went wrong...")
                    setIsUploading(false)
                } finally {
                    dismissToasts("loading")
                }
            }}
            previewAsImage={false}
            allowImage={true}
            allowDocument={false}
            renderEmptyContent={() => (
                <>
                    <ImageIcon className="w-10 h-10 mb-2 mx-auto text-indigo-400" />
                    <p className="text-neutral-600 mb-2">
                        Drag & drop a image file here
                    </p>
                    <p className="text-sm text-neutral-500">
                        or click to select a file
                    </p>
                    <p className="text-xs text-neutral-400 mt-2">
                        Images (PNG, WEBP, JPG, GIF)
                    </p>
                    <p className="text-xs text-neutral-400">up to 5MB</p>
                </>
            )}
        />
    )
}
