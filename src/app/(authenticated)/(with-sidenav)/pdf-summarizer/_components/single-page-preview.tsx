import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { wait } from "@/utils/wait"
import { Loader2, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"
import { usePdfSummarizerStore } from "../store"

interface Props {
    documentLocalId: string
    pageLocalId: string
    isOpen: boolean
    onOpenChange: (value: boolean) => void
    index: number
}

export default function SinglePagePreview(props: Props) {
    const getFile = usePdfSummarizerStore((s) => s.getFileByLocalId)
    const [isSummarizing, setIsSummarizing] = useState(false)

    useEffect(() => {
        if (props.isOpen) {
            wait(200).then(() => {
                const previewContainer =
                    document.getElementById("pdf-dialog-preview")

                const selectedFile = getFile(props.documentLocalId)?.file

                const canvas = document.createElement("canvas")
                canvas.id = `${props.pageLocalId}-preview`

                if (!previewContainer) {
                    return
                }
                previewContainer.innerHTML = ""
                previewContainer.appendChild(canvas)
                const ctx = canvas.getContext("2d")
                selectedFile?.getPage(props.index + 1).then((page) => {
                    const viewport = page.getViewport({
                        scale: 1,
                        offsetY: -20,
                    })
                    canvas.height = viewport.height
                    canvas.width = viewport.width

                    if (!ctx) {
                        return
                    }

                    const renderTask = page.render({
                        canvasContext: ctx,
                        viewport: viewport,
                        intent: "display",
                    })

                    renderTask.promise.then(() => {})
                })
            })
        }
    }, [
        props.isOpen,
        props.index,
        props.documentLocalId,
        props.pageLocalId,
        getFile,
    ])

    const handleSummarize = async () => {
        setIsSummarizing(true)
        await wait(1500)
    }

    return (
        <Dialog open={props.isOpen} onOpenChange={props.onOpenChange}>
            <DialogContent className="h-[90vh] !px-10 pt-4 min-w-[700px]">
                <div className="flex h-16 mt-5 justify-between items-center ">
                    <DialogTitle>Page {props.index + 1}</DialogTitle>
                    <div className="flex items-center">
                        <Button
                            onClick={() => props.onOpenChange(false)}
                            className="text-lg text-neutral-600 font-bold mr-2 h-[44px]"
                            variant={"secondary"}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant={"blue"}
                            onClick={handleSummarize}
                            isLoading={isSummarizing}
                            className="text-base"
                        >
                            Summarize <Sparkles className="!w-5 !h-5" />
                        </Button>
                    </div>
                </div>

                <div
                    id={`pdf-dialog-preview`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-grow  border flex rounded-xl items-center justify-center relative"
                >
                    <Loader2 className="animate-spin duration-400 opacity-30" />
                </div>

                <DialogDescription></DialogDescription>
            </DialogContent>
        </Dialog>
    )
}
