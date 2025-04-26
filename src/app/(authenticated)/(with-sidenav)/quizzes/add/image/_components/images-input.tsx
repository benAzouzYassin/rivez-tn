"use client"

import { MultipleFileInput } from "@/components/ui/multiple-file-input"
import { dismissToasts, toastError, toastLoading } from "@/lib/toasts"
import { fileToBase64 } from "@/utils/file"
import { ImageIcon } from "lucide-react"
import { useState, useMemo } from "react"
import { getLanguage } from "@/utils/get-language"

type Props = {
    onChange: (base64Images: string[]) => void
}

export default function ImagesInput(props: Props) {
    const translation = useMemo(
        () => ({
            en: {
                uploading: "Uploading your image...",
                error: "Something went wrong...",
                dragDrop: "Drag & drop an image file here",
                clickToSelect: "or click to select a file",
                allowedTypes: "Images (PNG, WEBP, JPG, GIF)",
                maxSize: "up to 5MB",
            },
            fr: {
                uploading: "Téléchargement de votre image...",
                error: "Une erreur s'est produite...",
                dragDrop: "Glissez-déposez un fichier image ici",
                clickToSelect: "ou cliquez pour sélectionner un fichier",
                allowedTypes: "Images (PNG, WEBP, JPG, GIF)",
                maxSize: "jusqu'à 5 Mo",
            },
            ar: {
                uploading: "جاري رفع الصورة...",
                error: "حدث خطأ ما...",
                dragDrop: "اسحب وأفلت ملف صورة هنا",
                clickToSelect: "أو انقر لاختيار ملف",
                allowedTypes: "صور (PNG, WEBP, JPG, GIF)",
                maxSize: "حتى 5 ميجابايت",
            },
        }),
        []
    )
    const lang = getLanguage()
    const t = translation[lang]

    const [isUploading, setIsUploading] = useState(false)
    return (
        <MultipleFileInput
            isLoading={isUploading}
            onChange={async (files) => {
                toastLoading(t.uploading)
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
                    toastError(t.error)
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
                    <p className="text-neutral-600 mb-2">{t.dragDrop}</p>
                    <p className="text-sm text-neutral-500">
                        {t.clickToSelect}
                    </p>
                    <p className="text-xs text-neutral-400 mt-2">
                        {t.allowedTypes}
                    </p>
                    <p className="text-xs text-neutral-400">{t.maxSize}</p>
                </>
            )}
        />
    )
}
