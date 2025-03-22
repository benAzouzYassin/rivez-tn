import { Button } from "@/components/ui/button"
import { dismissToasts, toastError, toastLoading } from "@/lib/toasts"
import { tryCatch } from "@/utils/try-catch"
import { wait } from "@/utils/wait"
import { Upload } from "lucide-react"
import * as pdfjsLib from "pdfjs-dist"
import { z } from "zod"
import { usePdfSummarizerStore } from "../store"
import { ChangeEvent } from "react"

export default function AddFilesButton() {
    const addFileToState = usePdfSummarizerStore((s) => s.addFile)
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
    const handleFiles = async (files: File[]) => {
        toastLoading("Loading your files...")
        for await (const file of files) {
            const { data: result, error } = await tryCatch(
                Promise.all([getFileData(file), getFilePages(file)])
            )
            if (error) {
                return toastError(`Something went wrong with ${file.name}`)
            }
            const [fileData, pages] = result
            addFileToState({
                localId: crypto.randomUUID(),
                file: fileData,
                name: file.name,
                pages: pages.map((p, i) => ({
                    content: p,
                    localId: crypto.randomUUID(),
                    index: i,
                })),
            })
        }

        dismissToasts("loading")
    }
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e?.target?.files || []).filter(
            (file) => file.type === "application/pdf"
        )
        handleFiles(selectedFiles || [])
    }
    return (
        <Button
            className="text-base absolute font-extrabold rounded-xl w-full text-neutral-500 z-50 bottom-5 mt-0"
            variant={"secondary"}
        >
            <input
                id="file-upload"
                accept="application/pdf"
                multiple
                onChange={handleFileChange}
                type="file"
                className="w-full cursor-pointer h-full opacity-0  absolute border-2"
            />
            <Upload className="min-w-5 min-h-5" /> Upload Files
        </Button>
    )
}
