import { cn } from "@/lib/ui-utils"
import { X } from "lucide-react"
import { memo, useState } from "react"

import { wait } from "@/utils/wait"

type Props = {
    localId: string
    name: string
    isSelected: boolean
}

function AsideItem(props: Props) {
    const removeItem = () => {}
    const selectItem = () => {}
    const [isDeleting, setIsDeleting] = useState(false)

    const handleRemove = () => {
        setIsDeleting(true)
        wait(300).then(removeItem)
    }

    return (
        <div
            className={cn(
                "relative group  h-[120px] pb-3 transform transition-all duration-300 ease-in-out",
                {
                    "opacity-0 scale-95 -translate-y-2": isDeleting,
                    "opacity-100 scale-100 translate-y-0": !isDeleting,
                }
            )}
        >
            <button
                onClick={handleRemove}
                className="absolute right-0 hover:cursor-pointer active:scale-95 -top-2 p-[2px] bg-red-100 border-2 border-red-400 rounded-full text-red-500/90 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-200 hover:border-red-500 hover:text-red-600"
            >
                <X className="w-4 h-4 stroke-3" />
            </button>
            <button
                onClick={() => {
                    selectItem()
                    window.scrollTo({
                        behavior: "smooth",
                        top: 0,
                    })
                }}
                className={cn(
                    "h-full flex items-center justify-center w-[98%] overflow-hidden hover:bg-blue-300/10  transition-all duration-200 border rounded-xl hover:cursor-pointer  border-neutral-300",
                    {
                        "bg-blue-50/90 border-blue-400/60 shadow-lg shadow-blue-200/60 border-2 hover:bg-blue-100/90":
                            props.isSelected,
                    }
                )}
            >
                <div className="max-h-[90%] h-fit overflow-hidden  ">
                    <span className="text-sm line-clamp-2 pr-2 text-neutral-400 font-medium">
                        {props.name}
                    </span>
                </div>
            </button>
        </div>
    )
}
export default memo(AsideItem)
