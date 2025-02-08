import { cn } from "@/lib/ui-utils"
import { wait } from "@/utils/wait"
import { X } from "lucide-react"
import { useState } from "react"
import useQuizStore from "../store"
import { QuizQuestionType } from "../types"

type Props = {
    question: QuizQuestionType
}

export default function QuestionPreview({ question }: Props) {
    const selectedQuestionId = useQuizStore((state) => state.selectedQuestionId)
    const setSelectedQuestionId = useQuizStore(
        (state) => state.setSelectedQuestionId
    )
    const setAllQuestions = useQuizStore((state) => state.setAllQuestions)
    const [isDeleting, setIsDeleting] = useState(false)

    const isSelected = selectedQuestionId === question.localId

    const handleRemove = () => {
        setIsDeleting(true)
        wait(300).then(() => {
            const currentQuestions = useQuizStore.getState().allQuestions
            const updated = currentQuestions.filter(
                (q) => q.localId !== question.localId
            )

            if (updated.length && isSelected) {
                setSelectedQuestionId(
                    currentQuestions[updated.length - 1].localId
                )
            }
            setAllQuestions(updated)
        })
    }

    return (
        <div
            className={cn(
                "relative group transform transition-all duration-300 ease-in-out",
                {
                    "opacity-0 scale-95 -translate-y-2": isDeleting,
                    "opacity-100 scale-100 translate-y-0": !isDeleting,
                }
            )}
        >
            <button
                onClick={handleRemove}
                className="absolute -right-2 hover:cursor-pointer active:scale-95 -top-2 p-[2px] bg-red-100 border-2 border-red-400 rounded-full text-red-500/90 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-200 hover:border-red-500 hover:text-red-600"
            >
                <X className="w-4 h-4 stroke-3" />
            </button>
            <button
                onClick={() => {
                    setSelectedQuestionId(question.localId)
                }}
                className={cn(
                    "h-full min-w-36 hover:bg-blue-300/10 p-4 transition-all duration-200 border rounded-xl hover:cursor-pointer hover:shadow-md border-neutral-300",
                    {
                        "bg-blue-50/90 border-blue-400/60 shadow-lg shadow-blue-200/60 border-2 hover:bg-blue-100/90":
                            selectedQuestionId === question.localId,
                    }
                )}
            ></button>
        </div>
    )
}
