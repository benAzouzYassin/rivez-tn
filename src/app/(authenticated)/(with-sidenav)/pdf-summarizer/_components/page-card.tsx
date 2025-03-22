import { Checkbox } from "@/components/ui/checkbox"
import { MouseEvent, useCallback, useEffect, useRef, useState } from "react"
import { usePdfSummarizerStore } from "../store"
import { cn } from "@/lib/ui-utils"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import SinglePagePreview from "./single-page-preview"

interface Props {
    index: number
    pageLocalId: string
    pdfLocalId: string
    isSelected: boolean
    onSelectChange: (value: boolean) => void
}
export default function PageCard(props: Props) {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false)
    const getSelectedFile = usePdfSummarizerStore((s) => s.getSelectedFile)
    const previewContainer = useRef<HTMLDivElement>(null)

    const renderPreview = useCallback(() => {
        const selectedFile = getSelectedFile()
        const canvas = document.createElement("canvas")
        canvas.id = props.pageLocalId
        if (!previewContainer.current) {
            return
        }
        previewContainer.current.innerHTML = ""
        previewContainer.current.appendChild(canvas)
        const ctx = canvas.getContext("2d")
        selectedFile?.file.getPage(props.index + 1).then((page) => {
            const viewport = page.getViewport({ scale: 0.43, offsetY: -10 })
            canvas.height = viewport.height
            canvas.width = viewport.width

            if (!ctx) {
                return
            }
            const renderTask = page.render({
                canvasContext: ctx,
                viewport: viewport,
                intent: "print",
            })

            renderTask.promise.then()
        })
    }, [getSelectedFile, props.index, props.pageLocalId])
    useEffect(() => {
        renderPreview()
    }, [props.pageLocalId, renderPreview])
    const handlePreview = (e: MouseEvent) => {
        e.stopPropagation()
        setIsPreviewOpen(true)
    }

    return (
        <div
            onClick={() => props.onSelectChange(!props.isSelected)}
            className={cn(
                "group h-72 border-2 relative border-neutral-200 bg-white hover:border-blue-300  cursor-pointer transition-all rounded-xl flex flex-col overflow-hidden ",
                { "border-blue-300": props.isSelected }
            )}
        >
            <div className="bg-white z-20 w-5 h-5 rounded-2xl absolute  top-3 right-3">
                <Checkbox
                    onCheckedChange={(value) =>
                        props.onSelectChange(Boolean(value))
                    }
                    checked={props.isSelected}
                    className="w-5 h-5 "
                />
            </div>
            <div
                id={props.pageLocalId}
                onClick={(e) => e.isPropagationStopped()}
                className="flex-grow bg-gray-100 flex items-center justify-center relative"
                ref={previewContainer}
            ></div>

            <Button
                onClick={handlePreview}
                variant={"outline"}
                className=" text-base top-20 group-hover:opacity-100 opacity-0 left-16 px-3 hover:bg-white font-semibold h-9 absolute   right-16"
            >
                <Eye />
                View
            </Button>
            <div className="h-12 border-t left-0 items-center justify-center w-full absolute -bottom-1 border-neutral-200 flex px-4 bg-white">
                <span className="font-semibold text-gray-700">
                    Page - {props.index + 1}
                </span>
            </div>
            <SinglePagePreview
                index={props.index}
                documentLocalId={props.pdfLocalId}
                pageLocalId={props.pageLocalId}
                isOpen={isPreviewOpen}
                onOpenChange={setIsPreviewOpen}
            />
        </div>
    )
}
