import PopoverList from "@/components/ui/popover-list"
import { cn } from "@/lib/ui-utils"
import { Edit, MoreVerticalIcon, Star, Trash2 } from "lucide-react"
import { useState } from "react"

interface Props {
    itemId: number
    className?: string
}
export default function MoreButton(props: Props) {
    const [isUpdating, setIsUpdating] = useState(false)

    return (
        <>
            <PopoverList
                contentClassName="-translate-x-4 "
                items={[
                    {
                        icon: <Star className="w-5 h-5" />,
                        label: "Add favorite",
                        onClick: () => setIsUpdating(true),
                    },
                    {
                        icon: <Edit className="w-5 h-5" />,
                        label: "Update",
                        onClick: () => setIsUpdating(true),
                    },

                    {
                        icon: <Trash2 className="w-5 h-5" />,
                        label: "Delete",
                        className: "focus:bg-red-200",
                        isDanger: true,
                    },
                ]}
            >
                <button
                    onClick={(e) => e.stopPropagation()}
                    role="button"
                    className={cn(
                        "h-8 border-2 bg-white hover:bg-neutral-50 flex items-center justify-center rounded-lg w-8 p-0 hover:cursor-pointer active:scale-95",
                        props.className
                    )}
                >
                    <MoreVerticalIcon className="!h-6 !w-6 text-neutral-600 dark:text-neutral-100" />
                </button>
            </PopoverList>
        </>
    )
}
