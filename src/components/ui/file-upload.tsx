"use client"

import { toastError } from "@/lib/toasts"
import { cn } from "@/lib/ui-utils"
import { FileTextIcon, Upload, X } from "lucide-react"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"

interface FileUploadProps {
    value?: string
    onChange: (file: File | null) => void
    disabled?: boolean
    className?: string
    allowImage?: boolean
    allowDocument?: boolean
}

export function FileUpload({
    value,
    onChange,
    disabled,
    className,
    allowDocument = true,
    allowImage = true,
}: FileUploadProps) {
    const [preview, setPreview] = useState(value || "")
    const [fileType, setFileType] = useState("")
    const [fileName, setFileName] = useState("")

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0]
            if (file) {
                if (file.size > 10 * 1024 * 1024) {
                    // 10MB limit
                    toastError("File size too large. Maximum size is 10MB")
                    return
                }

                setFileName(file.name)
                setFileType(file.type)

                const reader = new FileReader()
                reader.onloadend = () => {
                    const base64String = reader.result as string
                    setPreview(base64String)
                    onChange(file)
                }

                if (file.type.startsWith("image/")) {
                    reader.readAsDataURL(file)
                } else {
                    reader.readAsDataURL(file)
                }
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
        disabled,
    })

    const removeFile = () => {
        setPreview("")
        setFileType("")
        setFileName("")
        onChange(null)
    }

    const isImage = fileType.startsWith("image/")

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
                    "w-full min-h-[200px] hover:cursor-pointer  relative border-2 border-dashed rounded-xl",
                    "transition-all duration-200 ease-in-out",
                    "flex items-center justify-center",
                    isDragActive
                        ? "border-blue-500 bg-blue-50"
                        : "border-neutral-300 hover:bg-[#F7F7F7]  bg-[#F7F7F7]/50",
                    disabled && "opacity-50 cursor-not-allowed",
                    preview ? "p-4" : "p-8"
                )}
            >
                <input {...getInputProps()} />

                {preview ? (
                    <div className="relative w-full h-full">
                        {isImage ? (
                            <img
                                src={preview}
                                alt="Preview"
                                className="rounded-lg h-[200px] w-full  object-contain"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full">
                                <FileTextIcon className="w-16 h-16 text-neutral-500 mb-2" />
                                <p className="text-base text-neutral-700 text-center font-semibold break-all">
                                    {fileName}
                                </p>
                            </div>
                        )}
                        {!disabled && (
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
                    <div className="text-center">
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
