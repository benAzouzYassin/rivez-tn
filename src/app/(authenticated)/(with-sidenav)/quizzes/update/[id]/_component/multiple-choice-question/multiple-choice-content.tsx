import { cn } from "@/lib/ui-utils"
import { PlusCircle } from "lucide-react"
import { useState } from "react"
import useUpdateQuizStore, { StateMultipleChoiceOptions } from "../../store"
import { QuestionText } from "../question-text"
import MultipleChoiceOption from "./multiple-choice-option"
import ImageDialog from "./image-dialog"

export default function MultipleChoiceContent() {
    const selectedQuestionId = useUpdateQuizStore(
        (s) => s.selectedQuestionLocalId
    )
    const [isImageUploading, setIsImageUploading] = useState(false)
    const selectedQuestion = useUpdateQuizStore((s) => s.allQuestions).find(
        (q) => q.localId === selectedQuestionId
    )
    const questionContent = selectedQuestion?.content as
        | StateMultipleChoiceOptions
        | undefined
    const updateQuestion = useUpdateQuizStore((s) => s.updateQuestion)
    const layout = selectedQuestion?.layout
    if (!selectedQuestion) {
        return null
    }
    return (
        <section className={cn("pt-5 flex items-center justify-center")}>
            <div
                className={cn("w-[1000px]", {
                    "w-[1200px]": layout === "horizontal",
                })}
            >
                <div className="flex items-center mb-3 justify-center">
                    <QuestionText
                        className="w-[500px] "
                        text={selectedQuestion.questionText}
                        localId={selectedQuestion?.localId}
                    />
                </div>
                <div
                    dir="ltr"
                    className={cn({ "flex ": layout === "horizontal" })}
                >
                    <div
                        className={cn(
                            "flex items-center justify-center w-full h-fit",
                            {
                                "w-fit": layout === "horizontal",
                            }
                        )}
                    >
                        <ImageDialog
                            codeSnippets={selectedQuestion.codeSnippets}
                            imageType={selectedQuestion.imageType}
                            imageUrl={selectedQuestion.imageUrl}
                            selectedQuestionId={selectedQuestionId || ""}
                            layout={layout || ""}
                        />
                    </div>
                    <div
                        className={cn("grid grid-cols-2 pt-9 gap-5", {
                            "flex flex-col mt-4 grow ml-10":
                                layout === "horizontal",
                            "mt-5 gap-8": selectedQuestion.imageType === "none",
                        })}
                    >
                        {questionContent?.options?.map((opt) => (
                            <MultipleChoiceOption
                                changeIsCorrect={(newValue) => {
                                    updateQuestion(
                                        {
                                            content: {
                                                options:
                                                    questionContent.options.map(
                                                        (item) => {
                                                            if (
                                                                item.localId ===
                                                                opt.localId
                                                            ) {
                                                                return {
                                                                    ...item,
                                                                    isCorrect:
                                                                        newValue,
                                                                }
                                                            }
                                                            return item
                                                        }
                                                    ),
                                            },
                                        },
                                        selectedQuestion.localId
                                    )
                                }}
                                handleDelete={() => {
                                    updateQuestion(
                                        {
                                            content: {
                                                options:
                                                    questionContent.options.filter(
                                                        (item) =>
                                                            item.localId !==
                                                            opt.localId
                                                    ),
                                            },
                                        },
                                        selectedQuestion.localId
                                    )
                                }}
                                key={opt.localId}
                                isCorrect={opt.isCorrect}
                                optionLocalId={opt.localId}
                                questionLocalId={selectedQuestion.localId}
                            />
                        ))}
                        {!!questionContent &&
                            questionContent.options?.length < 4 && (
                                <button
                                    onClick={() => {
                                        updateQuestion(
                                            {
                                                content: {
                                                    options: [
                                                        ...questionContent.options,
                                                        {
                                                            isCorrect: null,
                                                            localId:
                                                                crypto.randomUUID(),
                                                            text: "",
                                                        },
                                                    ],
                                                },
                                            },
                                            selectedQuestion.localId
                                        )
                                    }}
                                    className={cn(
                                        "bg-white dark:bg-neutral-800 border-dashed text-stone-300 dark:text-neutral-500 hover:bg-blue-300/20 dark:hover:bg-blue-400/10 hover:cursor-pointer hover:border-stone-300 dark:hover:border-blue-400 hover:text-blue-300 dark:hover:text-blue-300 border-[3px] border-neutral-300 dark:border-neutral-700 justify-center active:scale-95 shadow-none h-20 flex items-center pl-6 shadow-[#E5E5E5] dark:shadow-none rounded-2xl transition-colors",
                                        "relative group transform transition-all duration-300 ease-in-out"
                                    )}
                                >
                                    <PlusCircle className="w-10 h-10" />
                                </button>
                            )}
                    </div>
                </div>
            </div>
        </section>
    )
}
