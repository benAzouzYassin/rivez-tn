import { Trash2 } from "lucide-react"
import { memo } from "react"
import useUpdateQuizStore, { FillInTheBlankStoreContent } from "../../store"
import AddOptionButton from "./add-option"
import Item from "./item"
import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { cn } from "@/lib/ui-utils"

interface Props {
    content: FillInTheBlankStoreContent
    questionId: string
}

function Options(props: Props) {
    return (
        <div className="flex relative  w-full max-w-[900px] flex-wrap mt-10 gap-x-5">
            {props.content.options.map((opt) => (
                <DraggableOption
                    text={opt.text}
                    content={props.content}
                    questionId={props.questionId}
                    localId={opt.localId}
                    key={opt.localId}
                />
            ))}
            <AddOptionButton
                questionContent={props.content}
                questionId={props.questionId}
            />
        </div>
    )
}

function DraggableOption({
    content,
    localId,
    text,
    questionId,
}: {
    localId: string
    content: FillInTheBlankStoreContent
    text: string
    questionId: string
}) {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
        useDraggable({
            id: localId,
        })

    const style = {
        transform: CSS.Transform.toString(transform),
    }

    const updateQuestion = useUpdateQuizStore((s) => s.updateQuestion)
    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            className={cn("relative group", { "opacity-0": isDragging })}
        >
            <button
                onClick={() => {
                    updateQuestion(
                        {
                            content: {
                                correct: content.correct,
                                options: content.options.filter(
                                    (item) => item.localId !== localId
                                ),
                                parts: content.parts,
                            },
                        },
                        questionId
                    )
                }}
                className="bg-red-50 z-10 opacity-0 group-hover:opacity-100 transition-all active:scale-95 -right-3 cursor-pointer  absolute rounded-full border-2 p-1 w-fit h-fit border-red-400/30"
            >
                <Trash2 className="text-red-400 w-4 h-4 " />
            </button>
            <div {...listeners}>
                <Item text={text} />
            </div>
        </div>
    )
}
export default memo(Options)
