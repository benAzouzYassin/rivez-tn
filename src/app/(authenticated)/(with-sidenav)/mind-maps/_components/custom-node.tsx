import { Handle, Position } from "@xyflow/react"
import { useState } from "react"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { ChevronRight } from "lucide-react"

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

    return (
        <>
            <Handle
                type="target"
                className="!opacity-0"
                position={Position.Top}
            />
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <div
                        style={{
                            backgroundColor: data.bgColor,
                            borderColor: data.bgColor,
                        }}
                        className="w-56 flex hover:scale-105 active:scale-100  items-center justify-between  min-h-[70px] p-2 border  rounded-md 
                            transition-all duration-200 
                            
                            cursor-pointer"
                        onClick={() => setOpen(true)}
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
                <SheetContent className="p-6 bg-white">
                    <SheetHeader className="mb-4">
                        <SheetTitle className="text-xl font-medium text-neutral-800">
                            {data.title}
                        </SheetTitle>
                    </SheetHeader>
                    <p className="text-sm leading-relaxed text-neutral-600">
                        {data.details}
                    </p>
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
