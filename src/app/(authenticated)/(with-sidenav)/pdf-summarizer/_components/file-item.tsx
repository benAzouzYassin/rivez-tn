import { FileText, XIcon } from "lucide-react"
import { MouseEvent } from "react"
import { usePdfSummarizerStore } from "../store"
import { cn } from "@/lib/ui-utils"

interface Props {
    localId: string
    name: string
    isSelected: boolean
    pagesIds: string[]
}
export default function FileItem(props: Props) {
    const setSelected = usePdfSummarizerStore((s) => s.setSelectedFileLocalId)
    const deleteFile = usePdfSummarizerStore((s) => s.deleteFile)
    const unselectPages = usePdfSummarizerStore((s) => s.unSelectPages)

    const handleDelete = (e: MouseEvent) => {
        e.stopPropagation()
        unselectPages(props.pagesIds)
        deleteFile(props.localId)
    }
    const handleSelect = () => {
        setSelected(props.localId)
    }
    return (
        <div
            onClick={handleSelect}
            className={cn(
                "w-full rounded-xl h-14 px-1 hover:bg-stone-100 dark:hover:bg-neutral-800 active:scale-98 transition-all cursor-pointer border border-neutral-200 dark:border-neutral-700 flex items-center bg-white dark:bg-neutral-900",
                {
                    "bg-sky-100/60 dark:bg-sky-900/40 border-sky-300/80 dark:border-sky-700 hover:bg-sky-100 dark:hover:bg-sky-900/60 border-2":
                        props.isSelected,
                }
            )}
        >
            <FileText className="text-red-400/70 ml-1 dark:text-red-500/70 min-w-6 min-h-6" />
            <p className="ml-2 max-w-[150px] truncate text-neutral-700 dark:text-neutral-200">
                {props.name}
            </p>
            <button
                onClick={handleDelete}
                className="active:scale-95 ml-auto opacity-70 hover:opacity-100 transition-all cursor-pointer hover:bg-red-200 dark:hover:bg-red-900/40 text-red-400 dark:text-red-300 rounded-full p-[2px]"
            >
                <XIcon className="stroke-[2.7] !w-5 scale-95 !h-5" />
            </button>
        </div>
    )
}
