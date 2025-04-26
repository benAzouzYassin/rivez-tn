"use client"
import * as pdfjsLib from "pdfjs-dist"

import { FileTextIcon } from "lucide-react"
import { FileInput } from "@/components/ui/file-input"
import { dismissToasts, toastError, toastLoading } from "@/lib/toasts"
import { useRef, useState } from "react"
import { z } from "zod"
import { getPdfPageImageData } from "@/lib/pdf"
import { imageBitmapToBase64 } from "@/utils/image"

pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"

type Props = {
    onPDFPagesChanges: (
        value: { textContent: string; imageInBase64: string | null }[]
    ) => void
}
export default function PdfInput(props: Props) {
    const [isUploadingPdf, setIsUploadingPdf] = useState(false)
    const [fileName, setFileName] = useState("")
    const canvasRef = useRef(document.createElement("canvas"))

    const getFileData = (file: File): Promise<pdfjsLib.PDFDocumentProxy> => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader()
            fileReader.onload = function () {
                const typedarray = new Uint8Array(this.result as ArrayBuffer)

                pdfjsLib
                    .getDocument(typedarray)
                    .promise.then((pdf) => {
                        resolve(pdf)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            }
            fileReader.readAsArrayBuffer(file)
        })
    }
    return (
        <FileInput
            fileName={fileName}
            isLoading={isUploadingPdf}
            onChange={async (file) => {
                toastLoading("Uploading your pdf...")
                try {
                    if (file) {
                        const workerInstance = new window.Worker(
                            "/pdfjs/pdf-parser-worker.js",
                            { type: "module" }
                        )
                        setIsUploadingPdf(true)
                        workerInstance.postMessage({
                            file,
                        })
                        workerInstance.onmessage = (event) => {
                            if (event.data.result) {
                                const content = event.data.result
                                const { data: pages, success } = z
                                    .array(z.string())
                                    .safeParse(content)
                                if (success) {
                                    setFileName(file.name)
                                    getFileData(file)
                                        .then((pdfDoc) => {
                                            return Promise.all(
                                                pages.map(
                                                    async (page, index) => {
                                                        const imageData =
                                                            (await getPdfPageImageData(
                                                                pdfDoc,
                                                                index + 1
                                                            ).catch((err) =>
                                                                console.error(
                                                                    err
                                                                )
                                                            )) || undefined
                                                        const imageInBase64 =
                                                            imageData
                                                                ? imageBitmapToBase64(
                                                                      imageData?.bitmap,
                                                                      canvasRef.current
                                                                  )
                                                                : null
                                                        return {
                                                            imageInBase64,
                                                            textContent: page,
                                                        }
                                                    }
                                                )
                                            )
                                        })
                                        .then((pages) => {
                                            props.onPDFPagesChanges(pages || [])
                                            setIsUploadingPdf(false)
                                        })
                                } else {
                                    throw new Error(
                                        "Error while parsing the pdf."
                                    )
                                }
                                workerInstance.terminate()
                            }
                        }
                    } else {
                        setFileName("")
                        props.onPDFPagesChanges([])
                    }
                } catch (error) {
                    toastError("Something went wrong...")
                    setIsUploadingPdf(false)
                } finally {
                    dismissToasts("loading")
                }
            }}
            allowDocument
            previewAsDocument
            previewAsImage={false}
            allowImage={false}
            renderEmptyContent={() => (
                <>
                    <FileTextIcon className="w-10 h-10 mb-2 mx-auto text-red-400" />
                    <p className="text-neutral-600 mb-2">
                        Drag & drop a pdf file here
                    </p>
                    <p className="text-sm text-neutral-500">
                        or click to select a file
                    </p>
                    <p className="text-xs text-neutral-400 mt-2">
                        Images (PNG, JPG, GIF) or Documents (PDF, DOC, DOCX,
                        XLS, XLSX)
                    </p>
                    <p className="text-xs text-neutral-400">up to 10MB</p>
                </>
            )}
        />
    )
}
