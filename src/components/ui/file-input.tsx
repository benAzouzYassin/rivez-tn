"use client"

import { toastError } from "@/lib/toasts"
import { cn } from "@/lib/ui-utils"
import { FileTextIcon, Loader2, Upload, X } from "lucide-react"
import { ReactNode, useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "./button"
import { getLanguage } from "@/utils/get-language"

interface Props {
    onChange: (file: File | null) => void
    disabled?: boolean
    className?: string
    allowImage?: boolean
    allowDocument?: boolean
    preview?: string
    isLoading?: boolean
    previewAsImage?: boolean
    previewAsDocument?: boolean
    fileName?: string
    renderEmptyContent?: () => ReactNode
    containerClassName?: string
    imageClassName?: string
    onCancel?: () => void
    displayCancelBtn?: boolean
}

export function FileInput({
    onChange,
    disabled,
    className,
    allowDocument = true,
    allowImage = true,
    preview,
    isLoading = false,
    previewAsDocument,
    previewAsImage,
    fileName,
    renderEmptyContent,
    containerClassName,
    imageClassName,
    displayCancelBtn,
    onCancel,
}: Props) {
    const lang = getLanguage()
    const t = translation[lang]

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0]
            if (file) {
                if (file.size > 10 * 1024 * 1024) {
                    // 10MB limit
                    toastError(t["File size too large"])
                    return
                }
                onChange(file)
            }
        },
        [onChange, t]
    )

    const acceptedImagesTypes = allowImage
        ? {
              "image/*": [".png", ".jpg", ".jpeg", ".gif"],
          }
        : null

    const acceptedDocumentTypes = allowDocument
        ? {
              "application/pdf": [".pdf"],
              "application/msword": [".doc"],
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                  [".docx"],
              "application/vnd.ms-excel": [".xls"],
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                  [".xlsx"],
          }
        : null

    const handlePaste = useCallback(
        (event: ClipboardEvent) => {
            const items = event.clipboardData?.items

            if (!items) return

            const pastedFiles: File[] = []

            for (let i = 0; i < items.length; i++) {
                const item = items[i]

                // Check if the pasted item is an image
                const isValidImage = item.type.startsWith("image/")
                const isValidPDF = item.type === "application/pdf"
                if (
                    (allowImage && isValidImage) ||
                    (allowDocument && isValidPDF)
                ) {
                    const file = item.getAsFile()
                    if (file) {
                        pastedFiles.push(file)
                    }
                }
            }

            if (pastedFiles.length > 0) {
                onChange(pastedFiles[0])
            }
        },
        [allowDocument, allowImage, onChange]
    )
    useEffect(() => {
        window.addEventListener("paste", handlePaste)

        return () => {
            window.removeEventListener("paste", handlePaste)
        }
    }, [handlePaste])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            ...acceptedImagesTypes,
            ...acceptedDocumentTypes,
        },
        maxFiles: 1,
        disabled: disabled || isLoading,
    })

    const removeFile = () => {
        onChange(null)
    }

    return (
        <div
            className={cn(
                "relative flex items-center justify-center w-full",
                className
            )}
        >
            <div
                {...getRootProps()}
                className={cn(
                    "w-full min-h-[200px] hover:cursor-pointer relative border-2 border-dashed rounded-xl",
                    "transition-all duration-200 ease-in-out",
                    "flex items-center justify-center",
                    isDragActive
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                        : "border-neutral-300 dark:border-neutral-700 hover:bg-[#F7F7F7] dark:hover:bg-neutral-800 bg-[#F7F7F7]/50 dark:bg-neutral-900/40",
                    disabled && "opacity-50 cursor-not-allowed",
                    preview ? "p-4" : "p-4 md:p-8",
                    containerClassName,
                    {
                        "hover:bg-white dark:hover:bg-neutral-800": isLoading,
                    }
                )}
            >
                <input {...getInputProps()} />

                {isLoading ? (
                    <div className="relative hover:cursor-not-allowed w-full h-full">
                        <div className="flex flex-col w-full h-full items-center justify-center">
                            <Loader2 className="w-7 h-7 animate-spin duration-[animation-duration:350ms] text-blue-400 dark:text-blue-300" />
                            {displayCancelBtn && (
                                <Button
                                    onClick={onCancel}
                                    type="button"
                                    variant={"outline-red"}
                                    className="h-10 font-extrabold mt-5"
                                >
                                    {t["Cancel"]}
                                </Button>
                            )}
                        </div>
                    </div>
                ) : preview || fileName ? (
                    <div className="relative w-full h-full">
                        {(previewAsImage ||
                            (previewAsImage === undefined &&
                                !previewAsDocument)) && (
                            <img
                                src={preview}
                                alt={t["Preview"]}
                                className={cn(
                                    "rounded-lg h-[200px] w-full object-contain",
                                    imageClassName
                                )}
                            />
                        )}
                        {previewAsDocument && (
                            <div className="flex flex-col items-center justify-center h-full">
                                <FileTextIcon className="w-12 h-12 md:w-16 md:h-16 text-red-400 dark:text-red-300 mb-2" />
                                <p className="text-sm md:text-base text-neutral-700 dark:text-neutral-200 text-center font-semibold max-w-[250px] truncate px-4 break-all">
                                    {fileName}
                                </p>
                            </div>
                        )}
                        {!disabled && !isLoading && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    removeFile()
                                }}
                                className={cn(
                                    "absolute -top-2 -right-2 p-1",
                                    "bg-red-500 rounded-full text-white",
                                    "hover:bg-red-600 dark:hover:bg-red-700 transition-colors",
                                    { "-top-10": previewAsDocument }
                                )}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="text-center w-full px-2">
                        {renderEmptyContent ? (
                            renderEmptyContent()
                        ) : (
                            <>
                                <Upload className="w-8 h-8 md:w-10 md:h-10 mb-2 mx-auto text-neutral-400 dark:text-neutral-500" />
                                <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-200 mb-1 md:mb-2">
                                    {isDragActive
                                        ? t["Drop the file here"]
                                        : t["Drag & drop a file here"]}
                                </p>
                                <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400">
                                    {t["or click to select a file"]}
                                </p>
                                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 md:mt-2">
                                    {t["Accepted file types"]}
                                </p>
                                <p className="text-xs text-neutral-400 dark:text-neutral-500">
                                    {t["up to 10MB"]}
                                </p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

const translation = {
    en: {
        Cancel: "Cancel",
        Preview: "Preview",
        "Drop the file here": "Drop the file here",
        "Drag & drop a file here": "Drag & drop a file here",
        "or click to select a file": "or click to select a file",
        "Accepted file types":
            "Images (PNG, JPG, GIF) or Documents (PDF, DOC, DOCX, XLS, XLSX)",
        "up to 10MB": "up to 10MB",
        "File size too large": "File size too large. Maximum size is 10MB",
    },
    ar: {
        Cancel: "إلغاء",
        Preview: "معاينة",
        "Drop the file here": "أفلت الملف هنا",
        "Drag & drop a file here": "اسحب وأفلت ملفًا هنا",
        "or click to select a file": "أو انقر لتحديد ملف",
        "Accepted file types":
            "الصور (PNG, JPG, GIF) أو المستندات (PDF, DOC, DOCX, XLS, XLSX)",
        "up to 10MB": "حتى 10 ميجابايت",
        "File size too large":
            "حجم الملف كبير جدًا. الحد الأقصى للحجم هو 10 ميجابايت",
    },
    fr: {
        Cancel: "Annuler",
        Preview: "Aperçu",
        "Drop the file here": "Déposez le fichier ici",
        "Drag & drop a file here": "Glissez et déposez un fichier ici",
        "or click to select a file": "ou cliquez pour sélectionner un fichier",
        "Accepted file types":
            "Images (PNG, JPG, GIF) ou Documents (PDF, DOC, DOCX, XLS, XLSX)",
        "up to 10MB": "jusqu'à 10 Mo",
        "File size too large":
            "Taille du fichier trop grande. La taille maximale est de 10 Mo",
    },
}
