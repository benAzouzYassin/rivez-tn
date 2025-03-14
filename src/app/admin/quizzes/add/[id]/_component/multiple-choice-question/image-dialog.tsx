import QuizImageDialog from "@/components/shared/quiz-image-dialog/quiz-image-dialog"
import { cn } from "@/lib/ui-utils"
import { MultipleChoiceContent } from "@/schemas/questions-content"
import { Database } from "@/types/database.types"
import { ImageIcon, X } from "lucide-react"
import { memo, useState } from "react"
import useQuizStore from "../../store"
import CodeSnippets from "./code-snippet"
interface Props {
    layout: string
    selectedQuestionId: string
    imageUrl: string | null
    imageType: Database["public"]["Tables"]["quizzes_questions"]["Insert"]["image_type"]
    codeSnippets: MultipleChoiceContent["codeSnippets"] | null
}
function DialogImage({
    layout,
    selectedQuestionId,
    imageType,
    imageUrl,
    codeSnippets,
}: Props) {
    const [isOpen, setIsOpen] = useState(false)
    const updateQuestion = useQuizStore((s) => s.updateQuestion)
    if (imageType === "none") {
        return null
    }
    return (
        <>
            <QuizImageDialog
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                onCodeSnippetsSave={(snippets, shouldClose) => {
                    updateQuestion(
                        {
                            imageType: "code-snippets",
                            codeSnippets: snippets,
                        },
                        selectedQuestionId
                    )
                    if (shouldClose) {
                        setIsOpen(false)
                    }
                }}
                onImageUpload={(imageUrl) => {
                    if (selectedQuestionId) {
                        updateQuestion({ imageUrl }, selectedQuestionId)
                    }
                }}
                onTypeChange={() => {}}
                selectedType={null}
            />
            <div className="relative">
                {((!!imageUrl && imageType !== "code-snippets") ||
                    !!codeSnippets?.length) && (
                    <button
                        onClick={() => {
                            updateQuestion(
                                {
                                    imageUrl: null,
                                    imageType: "normal-image",
                                    codeSnippets: null,
                                },
                                selectedQuestionId
                            )
                        }}
                        className=" active:scale-95 transition-all bg-red-100 border-red-300 border rounded-full p-[2px] absolute top-3 cursor-pointer -left-2 z-10 "
                    >
                        <X className="w-4 h-4 text-red-600/70 stroke-3" />
                    </button>
                )}
                <div
                    className={cn("overflow-hidden", {
                        "flex ": layout === "horizontal",
                    })}
                >
                    <div
                        className={cn("flex w-full  h-fit", {
                            "w-fit": layout === "horizontal",
                        })}
                    >
                        <div
                            className={cn("w-[800px] mt-5 mx-auto rounded-xl", {
                                "mx-0 w-[700px]": layout === "horizontal",
                            })}
                        >
                            <div
                                onClick={() => {
                                    if (imageType === "code-snippets") {
                                        return setIsOpen(false)
                                    }
                                    setIsOpen(true)
                                }}
                                className={cn(
                                    "!h-[350px]  overflow-x-hidden items-center justify-center   w-full min-h-[200px] hover:cursor-pointer relative border-2 border-dashed rounded-xl bg-white    border-blue-200 hover:bg-blue-50/50 group",
                                    {
                                        "!h-[450px]": layout === "horizontal",
                                    }
                                )}
                            >
                                {!imageUrl && imageType !== "code-snippets" && (
                                    <div className="flex   text-blue-500 h-full items-center justify-center flex-col">
                                        <ImageIcon className="w-36 stroke-[1.5] h-36 mb-2 mx-auto text-neutral-300 group-active:scale-95 transition-transform" />
                                    </div>
                                )}

                                {imageType === "code-snippets" &&
                                    !codeSnippets?.length && (
                                        <div className="flex   text-blue-500 h-full items-center justify-center flex-col">
                                            <ImageIcon className="w-36 stroke-[1.5] h-36 mb-2 mx-auto text-neutral-300 group-active:scale-95 transition-transform" />
                                        </div>
                                    )}

                                {!!imageUrl &&
                                    (imageType === "normal-image" ||
                                        imageType === null) && (
                                        <div className="p-4 ">
                                            <img
                                                src={imageUrl}
                                                alt="Preview"
                                                className={cn(
                                                    "rounded-lg overflow-hidden  h-[350px] w-full object-contain",
                                                    {
                                                        "!h-[400px] ":
                                                            layout ===
                                                            "horizontal",
                                                    }
                                                )}
                                            />
                                        </div>
                                    )}
                                {imageType === "code-snippets" && (
                                    <CodeSnippets
                                        isReadonly
                                        selectedQuestionId={selectedQuestionId}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default memo(DialogImage)
