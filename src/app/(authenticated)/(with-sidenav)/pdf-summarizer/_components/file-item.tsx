import { FileText, XIcon } from "lucide-react"
import { MouseEvent } from "react"
import { usePdfSummarizerStore } from "../store"
import { cn } from "@/lib/ui-utils"

interface Props {
    localId: string
    name: string
    isSelected: boolean
}
export default function FileItem(props: Props) {
    const setSelected = usePdfSummarizerStore((s) => s.setSelectedFileLocalId)
    const deleteFile = usePdfSummarizerStore((s) => s.deleteFile)
    const handleDelete = (e: MouseEvent) => {
        e.stopPropagation()
        deleteFile(props.localId)
    }
    const handleSelect = () => {
        setSelected(props.localId)
    }
    return (
        <div
            onClick={handleSelect}
            className={cn(
                "w-full  rounded-xl h-14 px-1  hover:bg-stone-100 active:scale-98 transition-all cursor-pointer border-neutral-200 border flex items-center  ",
                {
                    "bg-sky-100/60 border-sky-300/80 hover:bg-sky-100 border-2":
                        props.isSelected,
                }
            )}
        >
            <FileText className="text-red-400/70  min-w-6 min-h-6" />
            <p className=" ml-2 max-w-[150px] truncate">{props.name}</p>
            <button
                onClick={handleDelete}
                className=" active:scale-95 ml-auto opacity-70 hover:opacity-100 transition-all cursor-pointer hover:bg-red-200  text-red-400  rounded-full  p-[2px]"
            >
                <XIcon className="stroke-[2.7] !w-5 scale-95 !h-5" />
            </button>
        </div>
    )
}
