import { Button } from "@/components/ui/button"
import WarningDialog from "@/components/ui/warning-dialog"
import { softDeleteQuizById } from "@/data-access/quizzes/delete"
import { addQuestionsToQuiz, updateQuiz } from "@/data-access/quizzes/update"
import { toastError, toastSuccess } from "@/lib/toasts"
import { useParams } from "next/navigation"
import { useRouter } from "nextjs-toploader/app"
import { useRef, useState } from "react"
import useQuizStore, {
    FillInTheBlankStoreContent,
    MatchingPairsOptions,
    MultipleChoiceOptions,
} from "../store"
import { useQueryClient } from "@tanstack/react-query"
import { shuffleArray } from "@/utils/array"
export default function Buttons() {
    const params = useParams()
    const quizId = parseInt(params["id"] as string)
    const reset = useQuizStore((s) => s.reset)
    const questions = useQuizStore((s) => s.allQuestions)
    const router = useRouter()
    const [isPublishing, setIsPublishing] = useState(false)
    const [isSavingAsDraft, setIsSavingAsDraft] = useState(false)
    const [isCanceling, setIsCanceling] = useState(false)
    const [isWarning, setIsWarning] = useState(false)
    const savingActionRef = useRef<"saveAsDraft" | "publish">("saveAsDraft")
    const queryClient = useQueryClient()
    const handleSave = async (action?: "publish" | "saveAsDraft") => {
        try {
            if (isNaN(quizId) === false && quizId) {
                if (action === "publish") {
                    setIsPublishing(true)
                } else {
                    setIsSavingAsDraft(true)
                }
                await addQuestionsToQuiz(
                    quizId,
                    questions
                        .map((q, index) => {
                            if (q.type === "MULTIPLE_CHOICE") {
                                const content =
                                    q.content as MultipleChoiceOptions
                                const filteredOptions = content.options.filter(
                                    (opt) => !!opt.text
                                )
                                return {
                                    displayOrder: index,
                                    content: {
                                        options: filteredOptions,
                                        codeSnippets: q.codeSnippets,
                                    },
                                    type: q.type as any,
                                    image: q.imageUrl || "",
                                    question: q.questionText,
                                    layout: q.layout,
                                    imageType: q.imageType,
                                }
                            }
                            if (q.type === "FILL_IN_THE_BLANK") {
                                const content =
                                    q.content as FillInTheBlankStoreContent
                                const notSelectedOptions = content.options.map(
                                    (opt) => opt.text
                                )
                                const selectedOptions = content.correct.map(
                                    (opt) => opt.option
                                )
                                const allOptions = [
                                    ...notSelectedOptions,
                                    ...selectedOptions,
                                ]
                                return {
                                    displayOrder: index,
                                    content: {
                                        options: shuffleArray(allOptions),
                                        correct: content.correct,
                                        parts: content.parts,
                                    },
                                    type: q.type as any,
                                    image: "",
                                    question: q.questionText,
                                    layout: q.layout,
                                    imageType: q.imageType,
                                }
                            }
                            if (q.type === "MATCHING_PAIRS") {
                                const content =
                                    q.content as MatchingPairsOptions
                                const filteredRightOptions =
                                    content.rightOptions.filter(
                                        (opt) => !!opt.text
                                    )

                                const filteredLeftOptions =
                                    content.leftOptions.filter(
                                        (opt) => !!opt.text
                                    )

                                return {
                                    displayOrder: index,
                                    content: {
                                        leftOptions: filteredLeftOptions,
                                        rightOptions: filteredRightOptions,
                                    },
                                    type: q.type as any,
                                    image: q.imageUrl || "",
                                    question: q.questionText,
                                    layout: q.layout,
                                    imageType: q.imageType,
                                }
                            }
                            return null
                        })
                        .filter((q) => !!q)
                )
                toastSuccess("Saved successfully.")
                if (action === "publish") {
                    await updateQuiz(quizId, { publishing_status: "PUBLISHED" })
                } else {
                    await updateQuiz(quizId, { publishing_status: "DRAFT" })
                }
                queryClient.invalidateQueries({
                    queryKey: ["quizzes"],
                })
                router.replace("/admin/quizzes")
                reset()
            }
        } catch (error) {
            console.error(error)
            toastError("Error while saving...")
        } finally {
            setIsPublishing(false)
            setIsSavingAsDraft(false)
        }
    }
    const handleSubmit = (action?: "publish" | "saveAsDraft") => {
        const isAllOptionsFilled = questions.every((q) => {
            if (q.type === "MULTIPLE_CHOICE") {
                const content = q.content as MultipleChoiceOptions | undefined

                if (!content || !content.options.length) {
                    return false
                }
                const isOptionsValid =
                    content.options.every((opt) => !!opt.text) &&
                    content.options.length > 0
                return isOptionsValid
            }
            if (q.type === "MATCHING_PAIRS") {
                const content = q.content as MatchingPairsOptions | undefined
                if (
                    !content ||
                    !content.leftOptions.length ||
                    !content.rightOptions.length
                ) {
                    return false
                }
                const isRightOptionsValid =
                    content.rightOptions.every((opt) => !!opt.text) &&
                    content.rightOptions.length > 0

                const isLeftOptionsValid =
                    content.leftOptions.every((opt) => !!opt.text) &&
                    content.leftOptions.length > 0

                return isLeftOptionsValid && isRightOptionsValid
            }
            if (q.type === "FILL_IN_THE_BLANK") {
                return true
            }
            return false
        })
        const isQuestionsFilled = questions.every((q) => !!q.content)
        if (!isAllOptionsFilled || !isQuestionsFilled) {
            savingActionRef.current = action || "saveAsDraft"
            return setIsWarning(true)
        }
        handleSave(action)
    }
    return (
        <div className="flex items-center gap-2">
            <WarningDialog
                isOpen={isCanceling}
                onOpenChange={setIsCanceling}
                confirmText="Remove the quiz"
                onConfirm={async () => {
                    await softDeleteQuizById(quizId)
                    reset()
                    router.back()
                }}
            >
                <Button className="text-base font-extrabold" variant="red">
                    Cancel
                </Button>
            </WarningDialog>
            <Button
                onClick={() => handleSubmit("publish")}
                isLoading={isPublishing}
                className="text-base font-extrabold"
                variant="secondary"
            >
                Publish
            </Button>
            <Button
                isLoading={isSavingAsDraft}
                onClick={() => handleSubmit("saveAsDraft")}
                className="text-base font-extrabold"
                variant="blue"
            >
                Save draft
            </Button>
            <WarningDialog
                titleClassName="text-[#EF9C07]"
                isOpen={isWarning}
                onOpenChange={setIsWarning}
                description="You have left some options empty. Any empty will option be ignored."
                title="Warning: Proceed with caution"
                confirmText="Continue"
                confirmBtnClassName="bg-amber-400 shadow-amber-400"
                onConfirm={async () => {
                    setIsWarning(false)
                    handleSave()
                    reset()
                    router.back()
                }}
            />
        </div>
    )
}
