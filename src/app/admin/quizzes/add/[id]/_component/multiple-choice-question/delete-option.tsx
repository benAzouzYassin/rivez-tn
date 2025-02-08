import { Trash2 } from "lucide-react"
import { memo } from "react"

interface Props {
    onClick: () => void
}
function DeleteOption(props: Props) {
    return (
        <button
            onClick={props.onClick}
            className="absolute z-10 -left-2 hover:cursor-pointer active:scale-95 -top-2 p-[4px] bg-red-100 border border-red-400 rounded-full text-red-500/90 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-200 hover:border-red-500 hover:text-red-600"
        >
            <Trash2 className="w-4 h-4 stroke-2" />
        </button>
    )
}
export default memo(DeleteOption)
