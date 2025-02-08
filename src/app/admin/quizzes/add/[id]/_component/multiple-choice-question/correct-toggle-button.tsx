import { cn } from "@/lib/ui-utils"
import { MultipleChoiceContent } from "@/schemas/questions-content"
import { memo } from "react"
import { Check, X } from "lucide-react"
import { toastError } from "@/lib/toasts"
import useQuizStore from "../../store"

type Props = {
    index: number
    placeholder: string
}

type QuestionTypeContent = Omit<MultipleChoiceContent, "correct"> & {
    correctOptionsIndexes: number[]
}

function CorrectToggleButton(props: Props) {
    const selectedQuestion = useQuizStore((state) => state.selectedQuestion)
    const setAllQuestions = useQuizStore((state) => state.setAllQuestions)

    const questionContent = selectedQuestion?.content as
        | QuestionTypeContent
        | undefined

    const optionText = questionContent?.options[props.index]
    const isCorrect =
        optionText !== undefined &&
        questionContent?.correctOptionsIndexes.includes(props.index)

    const updateQuestionContent = (content: Partial<QuestionTypeContent>) => {
        setAllQuestions(
            (useQuizStore.getState().allQuestions || []).map((q) => {
                if (q.localId === selectedQuestion?.localId) {
                    return {
                        ...q,
                        content: { ...(q.content || {}), ...content },
                    }
                }
                return q
            })
        )
    }

    const markAsCorrect = () => {
        if (
            optionText !== undefined &&
            !questionContent?.correctOptionsIndexes.includes(props.index)
        ) {
            updateQuestionContent({
                correctOptionsIndexes: [
                    ...(questionContent?.correctOptionsIndexes || []),
                    props.index,
                ],
            })
        }
    }

    const markAsWrong = () => {
        updateQuestionContent({
            correctOptionsIndexes:
                questionContent?.correctOptionsIndexes.filter(
                    (i) => i !== props.index
                ),
        })
    }

    const handleClick = () => {
        if (!optionText || optionText === props.placeholder) {
            return toastError("Option is empty.")
        }
        if (isCorrect) {
            return markAsWrong()
        }
        markAsCorrect()
    }

    return (
        <button
            onClick={handleClick}
            className={cn(
                "w-10 h-10 hover:cursor-pointer rounded-full border border-black/10 bg-gray-100",
                {
                    "bg-green-100": isCorrect == true,
                    "bg-red-100": isCorrect === false,
                }
            )}
        >
            {isCorrect && <Check className="mx-auto stroke-3 text-green-600" />}
            {!isCorrect && <X className="mx-auto text-red-600 stroke-3" />}
        </button>
    )
}

export default memo(CorrectToggleButton)
