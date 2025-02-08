import { EditableContent } from "@/components/ui/editable-content"
import { cn } from "@/lib/ui-utils"
import { useState, useCallback, useMemo } from "react"
import { MultipleChoiceContent } from "@/schemas/questions-content"
import { memo } from "react"
import useQuizStore from "../../store"

interface EditableOptionContentProps {
    optionText?: string
    placeholder: string
    index: number
}

type QuestionTypeContent = Omit<MultipleChoiceContent, "correct"> & {
    correctOptionsIndexes: number[]
}

const EditableOptionContent = memo(
    ({ placeholder, index }: EditableOptionContentProps) => {
        const selectedQuestion = useQuizStore((state) => state.selectedQuestion)
        const setAllQuestions = useQuizStore((state) => state.setAllQuestions)
        const [isTyping, setIsTyping] = useState(false)

        const questionContent = selectedQuestion?.content as
            | QuestionTypeContent
            | undefined

        const optionText = useMemo(
            () => questionContent?.options[index],
            [questionContent?.options, index]
        )

        const updateText = useCallback(
            (newValue: string) => {
                const questionContent = selectedQuestion?.content as
                    | QuestionTypeContent
                    | undefined

                setAllQuestions(
                    useQuizStore.getState().allQuestions.map((q) => {
                        if (
                            q.localId === selectedQuestion?.localId &&
                            questionContent
                        ) {
                            return {
                                ...q,
                                content: {
                                    ...(q.content || {}),
                                    options: questionContent.options.map(
                                        (opt, i) =>
                                            i === index ? newValue : opt
                                    ),
                                },
                            }
                        }
                        return q
                    })
                )
            },
            [
                selectedQuestion?.localId,
                selectedQuestion?.content,
                index,
                setAllQuestions,
            ]
        )

        const handleFocus = useCallback(() => setIsTyping(true), [])
        const handleBlur = useCallback(() => setIsTyping(false), [])

        const className = useMemo(
            () =>
                cn("font-extrabold w-[80%] focus-within:outline-none text-xl", {
                    "text-neutral-400": !optionText,
                    "text-neutral-800":
                        (optionText !== placeholder && optionText) || isTyping,
                }),
            [optionText, placeholder, isTyping]
        )

        return (
            <EditableContent
                onFocus={handleFocus}
                onBlur={handleBlur}
                onContentChange={updateText}
                placeholder={placeholder}
                className={className}
            />
        )
    }
)

EditableOptionContent.displayName = "EditableOptionContent"

export default EditableOptionContent
