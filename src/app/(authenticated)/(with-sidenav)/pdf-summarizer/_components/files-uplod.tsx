"use client"

import { useIsSmallScreen } from "@/hooks/is-small-screen"
import { dismissToasts, toastError, toastLoading } from "@/lib/toasts"
import { getLanguage } from "@/utils/get-language"
import { tryCatchAsync } from "@/utils/try-catch"
import { wait } from "@/utils/wait"
import { FilesIcon } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"
import * as pdfjsLib from "pdfjs-dist"
import {
    ChangeEvent,
    DragEvent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react"
import { z } from "zod"
import { usePdfSummarizerStore } from "../store"
import { getImageData } from "../utils"
import { imageBitmapToBase64 } from "@/utils/image"

pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"

interface Translation {
    [key: string]: {
        [key: string]: string
    }
}

export default function FilesUpload() {
    const isSmallScreen = useIsSmallScreen()
    const router = useRouter()
    const [isDragging, setIsDragging] = useState(false)
    const addFileToState = usePdfSummarizerStore((s) => s.addFile)
    const reset = usePdfSummarizerStore((s) => s.reset)
    const selectPages = usePdfSummarizerStore((s) => s.selectPages)
    const canvasRef = useRef(document.createElement("canvas"))
    const lang = getLanguage()

    const translation: Translation = useMemo(
        () => ({
            en: {
                "Summarize documents": "Summarize documents",
                "Drop PDFs here or click to browse":
                    "Drop PDFs here or click to browse",
                "Only PDF files are supported": "Only PDF files are supported",
                "You can also paste files (Ctrl+V / Cmd+V)":
                    "You can also paste files (Ctrl+V / Cmd+V)",
                "Loading your files...": "Loading your files...",
                "Something went wrong with": "Something went wrong with",
            },
            fr: {
                "Summarize documents": "Résumer des documents",
                "Drop PDFs here or click to browse":
                    "Déposez les fichiers PDF ici ou cliquez pour parcourir",
                "Only PDF files are supported":
                    "Seuls les fichiers PDF sont pris en charge",
                "You can also paste files (Ctrl+V / Cmd+V)":
                    "Vous pouvez également coller des fichiers (Ctrl+V / Cmd+V)",
                "Loading your files...": "Chargement de vos fichiers...",
                "Something went wrong with": "Une erreur est survenue avec",
            },
            ar: {
                "Summarize documents": "تلخيص المستندات",
                "Drop PDFs here or click to browse":
                    "أسقط ملفات PDF هنا أو انقر للتصفح",
                "Only PDF files are supported": "يتم دعم ملفات PDF فقط",
                "You can also paste files (Ctrl+V / Cmd+V)":
                    "يمكنك أيضًا لصق الملفات (Ctrl+V / Cmd+V)",
                "Loading your files...": "جارٍ تحميل ملفاتك...",
                "Something went wrong with": "حدث خطأ مع",
            },
        }),
        []
    )

    const t = translation[lang]

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        reset()
        const selectedFiles = Array.from(e?.target?.files || []).filter(
            (file) => file.type === "application/pdf"
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

        const droppedFiles = Array.from(e.dataTransfer.files).filter(
            (file) => file.type === "application/pdf"
        )
        handleFiles(droppedFiles || [])
    }

    const handleFiles = useCallback(
        async (files: File[]) => {
            toastLoading(t["Loading your files..."])
            for await (const file of files) {
                const { data: result, error } = await tryCatchAsync(
                    Promise.all([getFileData(file), getFilePages(file)])
                )
                if (error) {
                    dismissToasts("loading")
                    return toastError(
                        `${t["Something went wrong with"]} ${file.name}`
                    )
                }
                const [fileData, pages] = result
                const pagesData = await Promise.all(
                    pages.map(async (p, i) => {
                        const imageData =
                            (await getImageData(fileData, i + 1).catch((err) =>
                                console.error(err)
                            )) || undefined
                        const imageInBase64 = imageData
                            ? imageBitmapToBase64(
                                  imageData?.bitmap,
                                  canvasRef.current
                              )
                            : null
                        return {
                            content: p,
                            localId: crypto.randomUUID(),
                            index: i,
                            imageInBase64: imageInBase64,
                        }
                    })
                )
                const fileToAdd = {
                    localId: crypto.randomUUID(),
                    file: fileData,
                    name: file.name,
                    pages: pagesData,
                }
                addFileToState(fileToAdd)
                selectPages(fileToAdd.pages.map((item) => item.localId))
            }

            dismissToasts("loading")
            if (isSmallScreen) {
                router.push("pdf-summarizer/multiple-pages")
            }
        },
        [addFileToState, isSmallScreen, router, selectPages, t]
    )

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

    const getFilePages = (file: File): Promise<string[]> => {
        return new Promise((resolve, reject) => {
            let done = false
            const workerInstance = new window.Worker(
                "/pdfjs/pdf-parser-worker.js",
                { type: "module" }
            )
            workerInstance.postMessage({
                file,
            })
            workerInstance.onmessage = (event) => {
                if (event.data.result) {
                    done = true
                    const content = event.data.result
                    const { data, success } = z
                        .array(z.string())
                        .safeParse(content)
                    if (success) {
                        resolve(data)
                    } else {
                        reject("Error while parsing the pdf.")
                    }
                    workerInstance.terminate()
                }
            }
            wait(4000).then(() => {
                if (done === false) {
                    reject("timed out")
                }
            })
        })
    }

    const handlePaste = useCallback(
        (event: ClipboardEvent) => {
            const items = event.clipboardData?.items

            if (!items) return

            const pastedFiles: File[] = []

            for (let i = 0; i < items.length; i++) {
                const item = items[i]

                if (item.type === "application/pdf") {
                    const file = item.getAsFile()
                    if (file) {
                        pastedFiles.push(file)
                    }
                }
            }

            if (pastedFiles.length > 0) {
                handleFiles(pastedFiles)
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

    return (
        <div className="w-full max-w-3xl pt-20 md:px-0 px-3 md:pt-28 space-y-6">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-neutral-600 mb-5">
                    {t["Summarize documents"]}
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
                    accept="application/pdf"
                    multiple
                    onChange={handleFileChange}
                />

                <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center h-full w-full justify-center p-6"
                >
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                        <FilesIcon className="h-10 w-10 text-red-400/90" />
                    </div>
                    <p className="text-xl font-bold text-neutral-500 mb-1 text-center">
                        {t["Drop PDFs here or click to browse"]}
                    </p>
                    <p className="text-sm font-semibold text-neutral-500 text-center">
                        {t["Only PDF files are supported"]}
                    </p>
                    <p className="text-sm text-blue-500 font-medium text-center">
                        {t["You can also paste files (Ctrl+V / Cmd+V)"]}
                    </p>
                </label>
            </div>
        </div>
    )
}
