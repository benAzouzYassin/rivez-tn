"use client"

import { toastError } from "@/lib/toasts"
import { cn } from "@/lib/ui-utils"
import { FileTextIcon, Loader2, Upload, X } from "lucide-react"
import { ReactNode, useCallback, useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "./button"
import ImageWithPreview from "./img-with-preview"

interface Props {
    onChange: (files: File[]) => void
    disabled?: boolean
    className?: string
    allowImage?: boolean
    allowDocument?: boolean
    previewUrls?: string[]
    isLoading?: boolean
    previewAsImage?: boolean
    fileNames?: string[]
    renderEmptyContent?: () => ReactNode
    containerClassName?: string
    imageClassName?: string
    onCancel?: () => void
    displayCancelBtn?: boolean
    maxFiles?: number
}

export function MultipleFileInput({
    onChange,
    disabled,
    className,
    allowDocument = true,
    allowImage = true,
    previewUrls = [],
    isLoading = false,
    previewAsImage,
    fileNames = [],
    renderEmptyContent,
    containerClassName,
    imageClassName,
    displayCancelBtn,
    onCancel,
    maxFiles,
}: Props) {
    const [localPreviewUrls, setLocalPreviewUrls] =
        useState<string[]>(previewUrls)
    const [localFileNames, setLocalFileNames] = useState<string[]>(fileNames)
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const newFiles = acceptedFiles.filter(
                (file) =>
                    !uploadedFiles.some(
                        (uploadedFile) =>
                            uploadedFile.name === file.name &&
                            uploadedFile.size === file.size
                    )
            )

            if (newFiles.length > 0) {
                const validFiles = newFiles.filter((file) => {
                    if (file.size > 10 * 1024 * 1024) {
                        toastError(
                            `File "${file.name}" size is too large. Maximum size is 10MB`
                        )
                        return false
                    }
                    return true
                })

                if (validFiles.length > 0) {
                    setUploadedFiles((prev) => [...prev, ...validFiles])
                    onChange([...uploadedFiles, ...validFiles])

                    const newPreviewUrls: string[] = []
                    const newFileNames: string[] = []
                    validFiles.forEach((file) => {
                        newFileNames.push(file.name)
                        if (allowImage && file.type.startsWith("image/")) {
                            const reader = new FileReader()
                            reader.onload = (e) => {
                                setLocalPreviewUrls((prev) => [
                                    ...prev,
                                    e.target?.result as string,
                                ])
                            }
                            reader.readAsDataURL(file)
                            newPreviewUrls.push(URL.createObjectURL(file))
                        } else {
                            setLocalPreviewUrls((prev) => [...prev, "document"])
                        }
                    })
                    setLocalFileNames((prev) => [...prev, ...newFileNames])
                }
            }
        },
        [onChange, uploadedFiles, allowImage]
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

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            ...acceptedImagesTypes,
            ...acceptedDocumentTypes,
        },
        maxFiles: maxFiles,
        disabled: disabled || isLoading,
    })

    const removeFile = (indexToRemove: number) => {
        const newUploadedFiles = uploadedFiles.filter(
            (_, index) => index !== indexToRemove
        )
        setUploadedFiles(newUploadedFiles)
        onChange(newUploadedFiles)

        const newPreviewUrls = [...localPreviewUrls]
        newPreviewUrls.splice(indexToRemove, 1)
        setLocalPreviewUrls(newPreviewUrls)

        const newFileNames = [...localFileNames]
        newFileNames.splice(indexToRemove, 1)
        setLocalFileNames(newFileNames)
    }

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
                setUploadedFiles((prev) => [...prev, ...pastedFiles])
                onChange([...uploadedFiles, ...pastedFiles])

                const newPreviewUrls: string[] = []
                const newFileNames: string[] = []
                pastedFiles.forEach((file) => {
                    newFileNames.push(file.name)
                    if (allowImage && file.type.startsWith("image/")) {
                        const reader = new FileReader()
                        reader.onload = (e) => {
                            setLocalPreviewUrls((prev) => [
                                ...prev,
                                e.target?.result as string,
                            ])
                        }
                        reader.readAsDataURL(file)
                        newPreviewUrls.push(URL.createObjectURL(file))
                    } else {
                        setLocalPreviewUrls((prev) => [...prev, "document"])
                    }
                })
                setLocalFileNames((prev) => [...prev, ...newFileNames])
            }
        },
        [allowDocument, allowImage, onChange, uploadedFiles]
    )
    useEffect(() => {
        window.addEventListener("paste", handlePaste)

        return () => {
            window.removeEventListener("paste", handlePaste)
        }
    }, [handlePaste])
    return (
        <div
            className={cn(
                "relative flex flex-col items-center justify-center",
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
                    disabled && "opacity-50  cursor-not-allowed",
                    localPreviewUrls.length > 0 ? "p-4" : "p-8",
                    containerClassName,
                    {
                        "hover:bg-white dark:hover:bg-neutral-800": isLoading,
                    }
                )}
            >
                <input {...getInputProps()} multiple />

                {isLoading ? (
                    <div className="relative hover:cursor-not-allowed min-w-[350px] w-full h-full flex items-center justify-center">
                        <div className="flex flex-col items-center justify-center">
                            <Loader2 className="w-7 h-7 animate-spin duration-[animation-duration:350ms] text-blue-400 dark:text-blue-300" />
                            {displayCancelBtn && (
                                <Button
                                    onClick={onCancel}
                                    type="button"
                                    variant={"outline-red"}
                                    className="h-10 font-extrabold mt-5"
                                >
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center min-w-[350px]">
                        {renderEmptyContent ? (
                            renderEmptyContent()
                        ) : (
                            <>
                                <Upload className="w-10 h-10 mb-2 mx-auto text-neutral-400 dark:text-neutral-500" />
                                <p className="text-neutral-600 dark:text-neutral-200 mb-2">
                                    {isDragActive
                                        ? "Drop the files here"
                                        : "Drag & drop files here"}
                                </p>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                    or click to select files
                                </p>
                                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-2">
                                    Images (PNG, JPG, GIF) or Documents (PDF,
                                    DOC, DOCX, XLS, XLSX)
                                </p>
                                <p className="text-xs text-neutral-400 dark:text-neutral-500">
                                    up to 10MB per file
                                </p>
                                {maxFiles && (
                                    <p className="text-xs text-neutral-400 dark:text-neutral-500">
                                        Maximum {maxFiles} files
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
            <div
                className={cn("overflow-y-auto pt-2 w-full", {
                    "min-h-20": localPreviewUrls.length,
                })}
            >
                <div className="relative min-w-[350px] w-full gap-4 flex h-full flex-wrap">
                    {localPreviewUrls.map((previewUrl, index) => (
                        <div
                            key={index}
                            className="relative w-20 border-2 rounded-lg h-20 dark:border-neutral-700 dark:bg-neutral-800"
                        >
                            {previewUrl.startsWith("data:image") && (
                                <ImageWithPreview
                                    src={previewUrl}
                                    alt={`Preview ${index}`}
                                    className={cn(
                                        "rounded-lg top-0 left-0 h-full absolute w-full object-cover object-center",
                                        imageClassName
                                    )}
                                    style={
                                        previewUrl === "document"
                                            ? { backgroundColor: "#f0f0f0" }
                                            : {}
                                    }
                                />
                            )}
                            {previewUrl.startsWith("data:image") === false && (
                                <div className="flex flex-col items-center relative justify-center">
                                    <div className="absolute flex-col mt-2 ml-1 flex items-center justify-center top-0 left-0">
                                        <FileTextIcon className="w-8 h-8 text-red-400 dark:text-red-300 mb-1" />
                                        <p className="text-neutral-700 dark:text-neutral-200 text-center font-semibold text-xs max-w-[70px] truncate">
                                            {localFileNames[index]}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {!disabled && !isLoading && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        removeFile(index)
                                    }}
                                    className={cn(
                                        "absolute -top-2 w-4 h-4 -right-2 flex items-center justify-center",
                                        "bg-red-500 rounded-full text-white",
                                        "hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
                                    )}
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
