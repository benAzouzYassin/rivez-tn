import Markdown from "@/components/shared/markdown"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Handle, Position, useReactFlow } from "@xyflow/react"
import { ChevronRight, Download, Loader2, Trash2Icon } from "lucide-react"
import { memo, useRef, useState } from "react"
import { useReactToPrint } from "react-to-print"

interface CustomNodeProps {
    data: {
        id: string
        title: string
        description: string
        details: string
        bgColor: string
        isLoading?: boolean
    }
}

function CustomNode({ data }: CustomNodeProps) {
    const [open, setOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const contentRef = useRef<HTMLDivElement>(null)
    const reactToPrintFn = useReactToPrint({
        contentRef,
        onAfterPrint: () => setIsSaving(false),
    })
    const reactFlow = useReactFlow()

    return (
        <>
            <Handle
                type="target"
                className="!opacity-0"
                position={Position.Top}
            />
            <Sheet modal={false} open={open} onOpenChange={setOpen}>
                <SheetTrigger
                    onClick={(e) => {
                        e.stopPropagation()
                    }}
                    asChild
                >
                    <div
                        onDoubleClick={() => setOpen(true)}
                        onClick={() => setOpen(true)}
                        style={{
                            backgroundColor: data.bgColor,
                            borderColor: data.bgColor,
                        }}
                        className="w-56 group  flex hover:scale-105 items-center justify-between min-h-[70px] p-2 border rounded-md transition-all duration-200 cursor-pointer"
                    >
                        <button
                            onClick={(e) => {
                                e.stopPropagation()

                                reactFlow.deleteElements({
                                    nodes: reactFlow.getNode(data.id)
                                        ? [reactFlow.getNode(data.id) as any]
                                        : [],
                                })
                            }}
                            className="absolute group-hover:opacity-100 opacity-0  w-fit p-1 rounded-full border bg-red-100 border-red-400/50 text-red-400 -top-2 -right-2"
                        >
                            <Trash2Icon className="w-3 scale-110 h-3 stroke-[2.5]" />
                        </button>
                        {data.isLoading ? (
                            <div className="flex items-center absolute top-0 left-0 w-full h-full justify-center">
                                <Loader2 className="text-neutral-400 w-5 h-5 stroke-[2.5] duration-300 animate-spin" />
                            </div>
                        ) : (
                            <>
                                <div className="grow">
                                    <h3 className="text-sm font-bold text-neutral-600 font-sans first-letter:uppercase">
                                        {data.title}
                                    </h3>
                                    <p className="text-[8px] font-semibold text-neutral-500">
                                        {data.description}
                                    </p>
                                </div>
                                <ChevronRight className="w-4 stroke-neutral-600 stroke-[2.4] h-4" />
                            </>
                        )}
                    </div>
                </SheetTrigger>
                <SheetContent className="p-0 bg-white w-[calc(100vw-450px)] min-w-[calc(100vw-450px)]">
                    <div className="scale-x-[-1] overflow-y-auto">
                        <div className="h-full scale-x-[-1]">
                            <Button
                                isLoading={isSaving}
                                onClick={() => {
                                    reactToPrintFn()
                                    setIsSaving(true)
                                }}
                                className="absolute top-8 font-extrabold right-16"
                                variant={"secondary"}
                            >
                                <Download /> Save
                            </Button>

                            <div className="p-5" ref={contentRef}>
                                <Markdown content={data.details} />
                            </div>
                            <SheetTitle className="text-xl font-medium text-neutral-800"></SheetTitle>
                            <SheetDescription></SheetDescription>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
            <Handle
                className="!opacity-0"
                type="source"
                position={Position.Bottom}
                id="a"
            />
        </>
    )
}

export default memo(CustomNode)
