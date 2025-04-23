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

export default function ImageInput(props: Props) {
    const [isUploading, setIsUploading] = useState(false)

    const lang = getLanguage()
    const t = useMemo(
        () =>
            ({
                en: {
                    "Uploading your image...": "Uploading your image...",
                    "Something went wrong...": "Something went wrong...",
                    "Drag & drop a image file here":
                        "Drag & drop a image file here",
                    "or click to select a file": "or click to select a file",
                    "Images (PNG, WEBP, JPG, GIF)":
                        "Images (PNG, WEBP, JPG, GIF)",
                    "up to 5MB": "up to 5MB",
                },
                fr: {
                    "Uploading your image...":
                        "Téléchargement de votre image...",
                    "Something went wrong...": "Une erreur est survenue...",
                    "Drag & drop a image file here":
                        "Glissez-déposez un fichier image ici",
                    "or click to select a file":
                        "ou cliquez pour sélectionner un fichier",
                    "Images (PNG, WEBP, JPG, GIF)":
                        "Images (PNG, WEBP, JPG, GIF)",
                    "up to 5MB": "jusqu'à 5 Mo",
                },
                ar: {
                    "Uploading your image...": "جارٍ رفع صورتك...",
                    "Something went wrong...": "حدث خطأ ما...",
                    "Drag & drop a image file here": "اسحب وأفلت ملف صورة هنا",
                    "or click to select a file": "أو انقر لاختيار ملف",
                    "Images (PNG, WEBP, JPG, GIF)": "صور (PNG، WEBP، JPG، GIF)",
                    "up to 5MB": "حتى 5 ميغابايت",
                },
            }[lang]),
        [lang]
    )

    return (
        <MultipleFileInput
            className="max-w-[90vw] "
            isLoading={isUploading}
            onChange={async (files) => {
                toastLoading(t["Uploading your image..."])
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
                    toastError(t["Something went wrong..."])
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
                        {t["Drag & drop a image file here"]}
                    </p>
                    <p className="text-sm text-neutral-500">
                        {t["or click to select a file"]}
                    </p>
                    <p className="text-xs text-neutral-400 mt-2">
                        {t["Images (PNG, WEBP, JPG, GIF)"]}
                    </p>
                    <p className="text-xs text-neutral-400">{t["up to 5MB"]}</p>
                </>
            )}
        />
    )
}
