import { Trash2 } from "lucide-react"
import { memo } from "react"

interface Props {
    onClick: () => void
}
function DeleteOption(props: Props) {
    return (
        <button
            onClick={props.onClick}
            className="
            absolute z-10 -left-2 -top-2 p-[4px] rounded-full border
            bg-red-100 border-red-400 text-red-500/90
            hover:bg-red-200 hover:border-red-500 hover:text-red-600
            opacity-0 group-hover:opacity-100
            transition-all duration-200 active:scale-95 hover:cursor-pointer
            dark:bg-red-950 dark:border-red-800 dark:text-red-400
            dark:hover:bg-red-900 dark:hover:border-red-500 dark:hover:text-red-300
        "
        >
            <Trash2 className="w-4 h-4 stroke-2" />
        </button>
    )
}
export default memo(DeleteOption)
