import { ImageIcon } from "lucide-react"
import {
    ChangeEvent,
    DragEvent,
    useState,
    useEffect,
    useCallback,
    useMemo,
} from "react"
import { getLanguage } from "@/utils/get-language"

interface Props {
    handleSummarize: (data: { images: File[]; language: string }) => void
}

export default function ImageUpload(props: Props) {
    const [isDragging, setIsDragging] = useState(false)
    const lang = getLanguage()

    const translation = useMemo(
        () => ({
            en: {
                "Upload the images": "Upload the images",
                "Drop images here or click to browse":
                    "Drop images here or click to browse",
                "Supports JPG, PNG, GIF, and other image formats":
                    "Supports JPG, PNG, GIF, and other image formats",
                "You can also paste images (Ctrl+V / Cmd+V)":
                    "You can also paste images (Ctrl+V / Cmd+V)",
            },
            fr: {
                "Upload the images": "Téléchargez les images",
                "Drop images here or click to browse":
                    "Déposez les images ici ou cliquez pour parcourir",
                "Supports JPG, PNG, GIF, and other image formats":
                    "Prend en charge JPG, PNG, GIF et d'autres formats d'image",
                "You can also paste images (Ctrl+V / Cmd+V)":
                    "Vous pouvez également coller des images (Ctrl+V / Cmd+V)",
            },
            ar: {
                "Upload the images": "قم بتحميل الصور",
                "Drop images here or click to browse":
                    "أسقط الصور هنا أو انقر للتصفح",
                "Supports JPG, PNG, GIF, and other image formats":
                    "يدعم JPG و PNG و GIF وغيرها من تنسيقات الصور",
                "You can also paste images (Ctrl+V / Cmd+V)":
                    "يمكنك أيضًا لصق الصور (Ctrl+V / Cmd+V)",
            },
        }),
        []
    )

    const t = translation[lang]

    const handleFiles = useCallback(
        async (files: File[]) => {
            props.handleSummarize({
                images: files,
                language: "",
            })
        },
        [props]
    )

    const handlePaste = useCallback(
        (event: ClipboardEvent) => {
            const items = event.clipboardData?.items

            if (!items) return

            const imageFiles: File[] = []

            for (let i = 0; i < items.length; i++) {
                const item = items[i]

                if (item.type.startsWith("image/")) {
                    const file = item.getAsFile()
                    if (file) {
                        imageFiles.push(file)
                    }
                }
            }

            if (imageFiles.length > 0) {
                handleFiles(imageFiles)
            }
        },
        [handleFiles]
    )

    useEffect(() => {
        window.addEventListener("paste", handlePaste)

        return () => {
            window.removeEventListener("paste", handlePaste)
        }
    }, [handlePaste])

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e?.target?.files || []).filter(
            (file) => file.type.startsWith("image/")
        )
        handleFiles(selectedFiles || [])
    }

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)

        const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
            file.type.startsWith("image/")
        )
        handleFiles(droppedFiles || [])
    }

    return (
        <div className="w-full max-w-3xl pt-28 space-y-6">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-neutral-600 mb-5">
                    {t["Upload the images"]}
                </h1>
            </div>

            <div
                className={`flex active:scale-95 flex-col items-center justify-center h-64 md:h-96 ${
                    isDragging
                        ? "bg-blue-50 border-blue-400"
                        : "bg-white border-gray-300"
                } border-2 border-dashed rounded-3xl transition-all duration-200 ease-in-out hover:border-blue-300 hover:bg-blue-50`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                />

                <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center h-full w-full justify-center p-6"
                >
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                        <ImageIcon className="h-10 w-10 text-blue-400/90" />
                    </div>
                    <p className="text-xl font-bold text-neutral-500 mb-1 text-center">
                        {t["Drop images here or click to browse"]}
                    </p>
                    <p className="text-sm font-semibold text-neutral-500 text-center mb-2">
                        {t["Supports JPG, PNG, GIF, and other image formats"]}
                    </p>
                    <p className="text-sm text-blue-500 font-medium text-center">
                        {t["You can also paste images (Ctrl+V / Cmd+V)"]}
                    </p>
                </label>
            </div>
        </div>
    )
}
