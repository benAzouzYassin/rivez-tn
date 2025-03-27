import Markdown from "@/components/shared/markdown"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Handle, Position } from "@xyflow/react"
import { ChevronRight, Download } from "lucide-react"
import { useRef, useState } from "react"
import { useReactToPrint } from "react-to-print"

interface CustomNodeProps {
    data: {
        title: string
        description: string
        details: string
        bgColor: string
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
    return (
        <>
            <Handle
                type="target"
                className="!opacity-0"
                position={Position.Top}
            />
            <Sheet modal={false} open={open} onOpenChange={setOpen}>
                <SheetTrigger onClick={(e) => e.stopPropagation()} asChild>
                    <div
                        onDoubleClick={() => setOpen(true)}
                        onClick={() => setOpen(true)}
                        style={{
                            backgroundColor: data.bgColor,
                            borderColor: data.bgColor,
                        }}
                        className="w-56 flex hover:scale-105   items-center justify-between  min-h-[70px] p-2 border  rounded-md 
                            transition-all duration-200 
                            
                            cursor-pointer"
                    >
                        <div className=" grow">
                            <h3 className="text-sm font-bold text-neutral-600 font-sans  first-letter:uppercase ">
                                {data.title}
                            </h3>
                            <p className="text-[8px] font-semibold text-neutral-500">
                                {data.description}
                            </p>
                        </div>
                        <ChevronRight className="w-4 stroke-neutral-600 stroke-[2.4] h-4" />
                    </div>
                </SheetTrigger>
                <SheetContent className="p-0 bg-white  w-[calc(100vw-450px)] min-w-[calc(100vw-450px)]">
                    <div className="scale-x-[-1]  overflow-y-auto">
                        <div className=" h-full scale-x-[-1] ">
                            <Button
                                isLoading={isSaving}
                                onClick={() => {
                                    reactToPrintFn()
                                    setIsSaving(true)
                                }}
                                className="absolute top-8 font-extrabold right-7"
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

export default CustomNode
