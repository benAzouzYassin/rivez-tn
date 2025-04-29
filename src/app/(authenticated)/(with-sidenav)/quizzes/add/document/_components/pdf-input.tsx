"use client"
import * as pdfjsLib from "pdfjs-dist"

import { FileTextIcon } from "lucide-react"
import { FileInput } from "@/components/ui/file-input"
import { dismissToasts, toastError, toastLoading } from "@/lib/toasts"
import { useRef, useState, useMemo } from "react"
import { z } from "zod"
import { getPdfPageImageData } from "@/lib/pdf"
import { imageBitmapToBase64 } from "@/utils/image"
import { getLanguage } from "@/utils/get-language"

pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"

type Props = {
    onPDFPagesChanges: (
        value: { textContent: string; imageInBase64: string | null }[]
    ) => void
}

export default function PdfInput(props: Props) {
    const translation = useMemo(
        () => ({
            en: {
                uploading: "Uploading your pdf...",
                errorParsing: "Error while parsing the pdf.",
                error: "Something went wrong...",
                dragDrop: "Drag & drop a pdf file here",
                clickToSelect: "or click to select a file",
                allowedTypes: "Documents (PDF)",
                maxSize: "up to 10MB",
            },
            fr: {
                uploading: "Téléchargement de votre PDF...",
                errorParsing: "Erreur lors de l'analyse du PDF.",
                error: "Une erreur s'est produite...",
                dragDrop: "Glissez-déposez un fichier PDF ici",
                clickToSelect: "ou cliquez pour sélectionner un fichier",
                allowedTypes: "Documents (PDF)",
                maxSize: "jusqu'à 10 Mo",
            },
            ar: {
                uploading: "جاري رفع ملف PDF الخاص بك...",
                errorParsing: "حدث خطأ أثناء معالجة ملف PDF.",
                error: "حدث خطأ ما...",
                dragDrop: "اسحب وأفلت ملف PDF هنا",
                clickToSelect: "أو انقر لاختيار ملف",
                allowedTypes: " مستندات (PDF)",
                maxSize: "حتى 10 ميجابايت",
            },
        }),
        []
    )
    const lang = getLanguage()
    const t = translation[lang]

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
            className="dark:bg-neutral-800"
            fileName={fileName}
            isLoading={isUploadingPdf}
            onChange={async (file) => {
                toastLoading(t.uploading)
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
                                    throw new Error(t.errorParsing)
                                }
                                workerInstance.terminate()
                            }
                        }
                    } else {
                        setFileName("")
                        props.onPDFPagesChanges([])
                    }
                } catch (error) {
                    toastError(t.error)
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
                    <FileTextIcon className="w-10 h-10 mb-2 mx-auto text-red-400 dark:text-red-500/80" />
                    <p className="text-neutral-600 dark:text-neutral-200 mb-2">
                        {t.dragDrop}
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-300">
                        {t.clickToSelect}
                    </p>
                    <p className="text-xs text-neutral-400 dark:text-neutral-400 mt-2">
                        {t.allowedTypes}
                    </p>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500">
                        {t.maxSize}
                    </p>
                </>
            )}
        />
    )
}
