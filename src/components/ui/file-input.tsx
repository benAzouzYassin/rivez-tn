"use client"

import { toastError } from "@/lib/toasts"
import { cn } from "@/lib/ui-utils"
import { FileTextIcon, Loader2, Upload, X } from "lucide-react"
import { useCallback } from "react"
import { useDropzone } from "react-dropzone"

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
}: Props) {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0]
            if (file) {
                if (file.size > 10 * 1024 * 1024) {
                    // 10MB limit
                    toastError("File size too large. Maximum size is 10MB")
                    return
                }
                onChange(file)
            }
        },
        [onChange]
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
        maxFiles: 1,
        disabled: disabled || isLoading,
    })

    const removeFile = () => {
        onChange(null)
    }

    return (
        <div
            className={cn(
                "relative flex items-center justify-center",
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
                        ? "border-blue-500 bg-blue-50"
                        : "border-neutral-300 hover:bg-[#F7F7F7] bg-[#F7F7F7]/50",
                    (disabled || isLoading) && "opacity-50 cursor-not-allowed",
                    preview ? "p-4" : "p-8"
                )}
            >
                <input {...getInputProps()} />

                {isLoading ? (
                    <div className="relative hover:cursor-not-allowed min-w-[350px] w-full h-full">
                        <div className="flex flex-col w-full h-full items-center justify-center">
                            <Loader2 className="w-7 h-7  animate-spin duration-[animation-duration:350ms] text-black" />
                        </div>
                    </div>
                ) : preview ? (
                    <div className="relative min-w-[350px] w-full h-full">
                        {(previewAsImage ||
                            (previewAsImage === undefined &&
                                !previewAsDocument)) && (
                            <img
                                src={preview}
                                alt="Preview"
                                className="rounded-lg h-[200px] w-full object-contain"
                            />
                        )}
                        {previewAsDocument && (
                            <div className="flex flex-col items-center justify-center h-full">
                                <FileTextIcon className="w-16 h-16 text-neutral-500 mb-2" />
                                <p className="text-base text-neutral-700 text-center font-semibold break-all">
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
                                    "hover:bg-red-600 transition-colors"
                                )}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="text-center min-w-[350px] border-red-500">
                        <Upload className="w-10 h-10 mb-2 mx-auto text-neutral-400" />
                        <p className="text-neutral-600 mb-2">
                            {isDragActive
                                ? "Drop the file here"
                                : "Drag & drop a file here"}
                        </p>
                        <p className="text-sm text-neutral-500">
                            or click to select a file
                        </p>
                        <p className="text-xs text-neutral-400 mt-2">
                            Images (PNG, JPG, GIF) or Documents (PDF, DOC, DOCX,
                            XLS, XLSX)
                        </p>
                        <p className="text-xs text-neutral-400">up to 10MB</p>
                    </div>
                )}
            </div>
        </div>
    )
}
