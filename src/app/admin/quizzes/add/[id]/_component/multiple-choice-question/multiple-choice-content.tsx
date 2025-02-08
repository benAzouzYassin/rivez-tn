import ImageUpload from "@/components/shared/image-upload"
import { cn } from "@/lib/ui-utils"
import { MultipleChoiceContent as MultipleChoiceContentType } from "@/schemas/questions-content"
import { ImageIcon, PlusCircle } from "lucide-react"
import { useState } from "react"
import useQuizStore, { QuizQuestionType } from "../../store"
import MultipleChoiceOption from "./multiple-choice-option"
import { QuestionText } from "./question-text"

export default function MultipleChoiceContent() {
    const selectedQuestion = useQuizStore((state) => state.selectedQuestion)
    const setAllQuestions = useQuizStore((state) => state.setAllQuestions)
    const [isImageUploading, setIsImageUploading] = useState(false)

    const content = selectedQuestion?.content as
        | MultipleChoiceContentType
        | undefined

    const updateQuestionData = (data: Partial<QuizQuestionType>) => {
        setAllQuestions(
            useQuizStore.getState().allQuestions.map((q) => {
                if (q.localId === selectedQuestion?.localId) {
                    return { ...q, ...data }
                }
                return q
            })
        )
    }

    return (
        <section className="pt-5 flex items-center justify-center">
            <div className="w-[1000px]">
                <QuestionText
                    text={selectedQuestion?.questionText || ""}
                    onTextChange={(questionText) =>
                        updateQuestionData({ questionText })
                    }
                />
                <div className="flex w-full h-fit">
                    <div className="w-[800px] mt-5 h-[350px] mx-auto rounded-xl">
                        <ImageUpload
                            imageClassName="w-full h-full !h-[550px] w-[800px] object-cover"
                            containerClassName="bg-white w-[800px] h-[330px] overflow-clip border-blue-200 hover:bg-blue-50/50 group"
                            imageUrl={selectedQuestion?.imageUrl || null}
                            onImageUrlChange={(imageUrl) =>
                                updateQuestionData({ imageUrl })
                            }
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
                <div className="grid grid-cols-2 gap-5">
                    {content?.options?.map((opt, i) => {
                        return (
                            <MultipleChoiceOption
                                index={i}
                                key={crypto.randomUUID()}
                            />
                        )
                    })}
                    {content?.options.length !== undefined &&
                        content?.options.length < 4 && (
                            <button
                                onClick={() => {
                                    updateQuestionData({
                                        content: {
                                            ...(content || {}),
                                            options: [
                                                ...(content?.options || []),
                                                "",
                                            ],
                                        },
                                    })
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
        </section>
    )
}
