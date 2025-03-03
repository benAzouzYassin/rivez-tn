import { Button } from "@/components/ui/button"
import { cn } from "@/lib/ui-utils"
import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { Trash2 } from "lucide-react"
interface OptionProps {
    text: string
    id: number
    isDisabled?: boolean
    isSelected?: boolean
    handleRemoveBtn?: () => void
}
export default function FillInTheBlankItem(props: OptionProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
        useDraggable({
            id: props.id,
        })

    const style = {
        transform: CSS.Transform.toString(transform),
    }

    const draggingAttributes = { ...listeners, ...attributes }

    return (
        <div className="relative group">
            {props.isSelected && (
                <button
                    onClick={props.handleRemoveBtn}
                    className="absolute active:scale-90 transition-all z-20 opacity-0 group-hover:opacity-100 cursor-pointer -top-2 p-1 -right-2 bg-red-100/70 border-red-300/50 border-2 rounded-full text-red-500/80"
                >
                    <Trash2 className="w-4 scale-90 h-4" />
                </button>
            )}
            <Button
                ref={setNodeRef}
                style={style}
                {...draggingAttributes}
                variant={"secondary"}
                className={cn(
                    "min-h-[50px] active:translate-y-0  active:shadow-[0px_4px_0px_0px] active:shadow-[#E5E5E5] font-semibold touch-none shadow-[0px_3px_0px_0px] py-3  transition-none duration-200 text-base text-neutral-700  hover:bg-neutral-100 hover:border-neutral-200 hover:shadow-neutral-200",
                    {
                        "opacity-0 ": isDragging,
                    }
                )}
            >
                <p className="max-w-[400px] min-w-[20px] font-bold text-nowrap">
                    {props.text}
                </p>
            </Button>
        </div>
    )
}
