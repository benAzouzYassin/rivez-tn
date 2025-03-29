import { dismissToasts, toastError, toastLoading } from "@/lib/toasts"
import { tryCatchAsync } from "@/utils/try-catch"
import { wait } from "@/utils/wait"
import { FilesIcon } from "lucide-react"
import * as pdfjsLib from "pdfjs-dist"
import {} from "pdfjs-dist"
import { ChangeEvent, DragEvent, useState } from "react"
import { z } from "zod"
import { usePdfSummarizerStore } from "../store"

pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"

export default function FilesUpload() {
    const [isDragging, setIsDragging] = useState(false)
    const addFileToState = usePdfSummarizerStore((s) => s.addFile)
    const reset = usePdfSummarizerStore((s) => s.reset)
    const selectPages = usePdfSummarizerStore((s) => s.selectPages)
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

    const handleFiles = async (files: File[]) => {
        toastLoading("Loading your files...")
        for await (const file of files) {
            const { data: result, error } = await tryCatchAsync(
                Promise.all([getFileData(file), getFilePages(file)])
            )
            if (error) {
                dismissToasts("loading")
                return toastError(`Something went wrong with ${file.name}`)
            }
            const [fileData, pages] = result
            const fileToAdd = {
                localId: crypto.randomUUID(),
                file: fileData,
                name: file.name,
                pages: pages.map((p, i) => ({
                    content: p,
                    localId: crypto.randomUUID(),
                    index: i,
                })),
            }
            addFileToState(fileToAdd)
            selectPages(fileToAdd.pages.map((item) => item.localId))
        }

        dismissToasts("loading")
    }

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
    return (
        <div className="w-full max-w-3xl   pt-28 space-y-6">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-neutral-600 mb-5">
                    Summarize your documents
                </h1>
            </div>

            <div
                className={`flex active:scale-95 flex-col items-center justify-center h-96 ${
                    isDragging
                        ? "bg-blue-50 border-blue-400"
                        : "bg-white border-gray-300"
                } border-2 border-dashed  rounded-3xl transition-all duration-200 ease-in-out  hover:border-blue-300 hover:bg-blue-50`}
                onDragOver={(e) => handleDragOver}
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
                    <p className="text-xl font-bold text-neutral-500 mb-1">
                        Drop PDFs here or click to browse
                    </p>
                    <p className="text-sm font-semibold text-neutral-500">
                        Only PDF files are supported
                    </p>
                </label>
            </div>
        </div>
    )
}
