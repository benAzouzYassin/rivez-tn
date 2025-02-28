import ImageUpload from "@/components/shared/image-upload"
import { cn } from "@/lib/ui-utils"
import { ImageIcon, PlusCircle } from "lucide-react"
import { useState } from "react"
import useQuizStore, { MultipleChoiceOptions } from "../../store"
import MultipleChoiceOption from "./multiple-choice-option"
import { QuestionText } from "../question-text"

export default function MultipleChoiceContent() {
    const selectedQuestionId = useQuizStore((s) => s.selectedQuestionLocalId)
    const [isImageUploading, setIsImageUploading] = useState(false)
    const selectedQuestion = useQuizStore((s) => s.allQuestions).find(
        (q) => q.localId === selectedQuestionId
    )
    const questionContent = selectedQuestion?.content as
        | MultipleChoiceOptions
        | undefined
    const updateQuestion = useQuizStore((s) => s.updateQuestion)
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
                <div className={cn({ "flex ": layout === "horizontal" })}>
                    <div
                        className={cn("flex w-full h-fit", {
                            "w-fit": layout === "horizontal",
                        })}
                    >
                        <div
                            className={cn(
                                "w-[800px] mt-5 h-[400px] mx-auto rounded-xl",
                                { "mx-0 w-[650px]": layout === "horizontal" }
                            )}
                        >
                            <ImageUpload
                                displayCancelBtn
                                imageClassName={cn("h-[350px]", {
                                    "!h-[400px] ": layout === "horizontal",
                                })}
                                containerClassName={cn(
                                    "bg-white w-[800px] h-[400px] overflow-scroll border-blue-200 hover:bg-blue-50/50 group",
                                    { "!h-[450px]": layout === "horizontal" }
                                )}
                                imageUrl={selectedQuestion.imageUrl}
                                onImageUrlChange={(imageUrl) => {
                                    if (selectedQuestionId) {
                                        updateQuestion(
                                            { imageUrl },
                                            selectedQuestionId
                                        )
                                    }
                                }}
                                isLoading={isImageUploading}
                                onLoadingChange={setIsImageUploading}
                                renderEmptyContent={() => (
                                    <div className="flex text-blue-500 items-center justify-center flex-col">
                                        <ImageIcon className="w-36 stroke-[1.5] h-36 mb-2 mx-auto text-neutral-300 group-active:scale-95 transition-transform" />
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                    <div
                        className={cn("grid grid-cols-2 pt-9 gap-5", {
                            "flex flex-col mt-4 grow ml-10":
                                layout === "horizontal",
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
                                        "bg-white border-dashed text-stone-300 hover:bg-blue-300/20 hover:cursor-pointer hover:border-stone-300 hover:text-blue-300 border-[3px] border-neutral-300 justify-center active:scale-95 shadow-none h-20 flex items-center pl-6 shadow-[#E5E5E5] rounded-2xl transition-colors",
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
