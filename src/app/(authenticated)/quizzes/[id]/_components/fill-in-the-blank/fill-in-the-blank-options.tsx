import { memo } from "react"
import FillInTheBlankItem from "./fill-in-the-blank-item"
import { useDroppable } from "@dnd-kit/core"
import { cn } from "@/lib/ui-utils"

interface Props {
    options: { text: string; id: number }[]
}

function FillInTheBlankOptions(props: Props) {
    const { setNodeRef, isOver } = useDroppable({
        id: "non-selected-options",
    })
    return (
        <div
            ref={setNodeRef}
            className={cn(
                "border-2 border-transparent rounded-xl flex-wrap  flex min-w-full  gap-4 md:py-7 -mt-3 px-3 md:px-4",
                { "border-blue-300/50": isOver }
            )}
        >
            {props.options.map((opt, index) => (
                <FillInTheBlankItem
                    id={opt.id}
                    text={opt.text}
                    key={`option-${opt.id}-${index}`}
                />
            ))}
        </div>
    )
}

export default memo(FillInTheBlankOptions)
