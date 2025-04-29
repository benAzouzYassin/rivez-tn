import { cn } from "@/lib/ui-utils"
import { useState } from "react"
import CorrectToggleButton from "./correct-toggle-button"
import DeleteOption from "../delete-option"
import OptionText from "./option-text"
import useUpdateQuizStore, { StateMultipleChoiceOptions } from "../../store"
import { wait } from "@/utils/wait"

interface Props {
    questionLocalId: string
    optionLocalId: string
    isCorrect: boolean | null
    handleDelete: () => void
    changeIsCorrect: (value: boolean) => void
}

function MultipleChoiceOption(props: Props) {
    const [isDeleting, setIsDeleting] = useState(false)
    const currentQuestionContent = useUpdateQuizStore(
        (s) => s.allQuestions
    ).find((q) => q.localId === props.questionLocalId)?.content as
        | StateMultipleChoiceOptions
        | undefined
    const currentOption = currentQuestionContent?.options.find(
        (opt) => opt.localId === props.optionLocalId
    )

    return (
        <div
            className={cn(
                "bg-white dark:bg-neutral-900",
                "hover:bg-neutral-50 dark:hover:bg-neutral-800",
                "text-neutral-700 dark:text-neutral-200",
                "border-2 border-neutral-200 dark:border-neutral-700",
                "shadow-[0px_4px_0px_0px] shadow-[#E5E5E5] dark:shadow-[0px_4px_0px_0px] dark:shadow-[#23272f]",
                "min-h-20 flex items-center pl-6 rounded-2xl transition-colors",
                "relative group transform transition-all duration-300 ease-in-out",
                {
                    "opacity-0 scale-95 -translate-y-2": isDeleting,
                    "opacity-100 scale-100 translate-y-0": !isDeleting,
                }
            )}
        >
            <DeleteOption
                onClick={() => {
                    wait(250).then(props.handleDelete)
                    setIsDeleting(true)
                }}
            />
            <OptionText
                text={currentOption?.text || ""}
                questionLocalId={props.questionLocalId}
                optionLocalId={props.optionLocalId}
            />
            <div className="absolute top-0 right-0 h-full w-[15%] flex items-center justify-center border-l dark:border-neutral-700">
                <CorrectToggleButton
                    isCorrect={props.isCorrect}
                    onChange={props.changeIsCorrect}
                />
            </div>
        </div>
    )
}

export default MultipleChoiceOption
