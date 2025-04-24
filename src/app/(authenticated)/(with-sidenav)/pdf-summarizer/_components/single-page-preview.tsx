import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog"
import { wait } from "@/utils/wait"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
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
    const setOpenPageLocalId = usePdfSummarizerStore(
        (s) => s.setOpenPageLocalId
    )

    useEffect(() => {
        if (props.isOpen) {
            setOpenPageLocalId(props.pageLocalId)
        } else {
            setOpenPageLocalId(null)
        }
    }, [props.isOpen, setOpenPageLocalId, props.pageLocalId])

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

    return (
        <Dialog open={props.isOpen} onOpenChange={props.onOpenChange}>
            <DialogContent className="h-[90vh] !px-20 min-w-fit">
                <div
                    id={`pdf-dialog-preview`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-grow  border flex rounded-xl items-center justify-center relative"
                >
                    <Loader2 className="animate-spin duration-400 opacity-30" />
                </div>
                <DialogTitle className="text-center"></DialogTitle>
                <DialogDescription></DialogDescription>
            </DialogContent>
        </Dialog>
    )
}
