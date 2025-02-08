import { wait } from "@/utils/wait"
import { Trash2 } from "lucide-react"
import { MultipleChoiceContent } from "@/schemas/questions-content"
import useQuizStore from "../../store"

type QuestionTypeContent = Omit<MultipleChoiceContent, "correct"> & {
    correctOptionsIndexes: number[]
}

type DeleteOptionProps = {
    startDeleting: () => void
    endDeleting: () => void
    index: number
}

export default function DeleteOption(props: DeleteOptionProps) {
    const selectedQuestion = useQuizStore((state) => state.selectedQuestion)
    const setAllQuestions = useQuizStore((state) => state.setAllQuestions)

    const handleRemove = () => {
        props.startDeleting()
        wait(10).then(() => {
            setAllQuestions(
                useQuizStore.getState().allQuestions.map((q) => {
                    if (q.localId === selectedQuestion?.localId) {
                        const questionContent = q.content as
                            | QuestionTypeContent
                            | undefined
                        return {
                            ...q,
                            content: {
                                ...questionContent,
                                correctOptionsIndexes:
                                    questionContent?.correctOptionsIndexes.filter(
                                        (i) => i !== props.index
                                    ),
                                options: questionContent?.options.filter(
                                    (_, i) => i !== props.index
                                ),
                            },
                        }
                    }
                    return q
                })
            )
        })
    }

    return (
        <button
            onClick={handleRemove}
            className="absolute z-10 -left-2 hover:cursor-pointer active:scale-95 -top-2 p-[4px] bg-red-100 border border-red-400 rounded-full text-red-500/90 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-200 hover:border-red-500 hover:text-red-600"
        >
            <Trash2 className="w-4 h-4 stroke-2" />
        </button>
    )
}
