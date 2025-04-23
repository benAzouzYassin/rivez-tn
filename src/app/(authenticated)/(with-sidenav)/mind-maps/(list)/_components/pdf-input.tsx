"use client"

import { FileTextIcon } from "lucide-react"
import { FileInput } from "@/components/ui/file-input"
import { dismissToasts, toastError, toastLoading } from "@/lib/toasts"
import { useState, useMemo } from "react"
import { z } from "zod"
import { getLanguage } from "@/utils/get-language"

type Props = {
    onPDFPagesChanges: (value: string[]) => void
}

export default function PdfInput(props: Props) {
    const [isUploadingPdf, setIsUploadingPdf] = useState(false)
    const [fileName, setFileName] = useState("")

    const lang = getLanguage()
    const t = useMemo(
        () =>
            ({
                en: {
                    "Uploading your pdf...": "Uploading your pdf...",
                    "Drag & drop a pdf file here":
                        "Drag & drop a pdf file here",
                    "or click to select a file": "or click to select a file",
                    "PDF Documents": "PDF Documents",
                    "up to 5MB": "up to 5MB",
                    "Error while parsing the pdf.":
                        "Error while parsing the pdf.",
                    "Something went wrong...": "Something went wrong...",
                },
                fr: {
                    "Uploading your pdf...": "Téléchargement de votre PDF...",
                    "Drag & drop a pdf file here":
                        "Glissez-déposez un fichier PDF ici",
                    "or click to select a file":
                        "ou cliquez pour sélectionner un fichier",
                    "PDF Documents": "Documents PDF",
                    "up to 5MB": "jusqu'à 5 Mo",
                    "Error while parsing the pdf.":
                        "Erreur lors de l'analyse du PDF.",
                    "Something went wrong...": "Une erreur est survenue...",
                },
                ar: {
                    "Uploading your pdf...": "جارٍ رفع ملف PDF الخاص بك...",
                    "Drag & drop a pdf file here": "اسحب وأفلت ملف PDF هنا",
                    "or click to select a file": "أو انقر لاختيار ملف",
                    "PDF Documents": "ملفات PDF",
                    "up to 5MB": "حتى 5 ميغابايت",
                    "Error while parsing the pdf.":
                        "حدث خطأ أثناء تحليل ملف PDF.",
                    "Something went wrong...": "حدث خطأ ما...",
                },
            }[lang]),
        [lang]
    )

    return (
        <FileInput
            fileName={fileName}
            isLoading={isUploadingPdf}
            onChange={async (file) => {
                toastLoading(t["Uploading your pdf..."])
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
                                setIsUploadingPdf(false)
                                const { data, success } = z
                                    .array(z.string())
                                    .safeParse(content)
                                if (success) {
                                    props.onPDFPagesChanges(data || [])
                                    setFileName(file.name)
                                } else {
                                    throw new Error(
                                        t["Error while parsing the pdf."]
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
                    toastError(t["Something went wrong..."])
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
                        {t["Drag & drop a pdf file here"]}
                    </p>
                    <p className="text-sm text-neutral-500">
                        {t["or click to select a file"]}
                    </p>
                    <p className="text-xs text-neutral-400 mt-2">
                        {t["PDF Documents"]}
                    </p>
                    <p className="text-xs text-neutral-400">{t["up to 5MB"]}</p>
                </>
            )}
        />
    )
}
