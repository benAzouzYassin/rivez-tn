import { Button } from "@/components/ui/button"
import WarningDialog from "@/components/ui/warning-dialog"
import { deleteQuizQuestions } from "@/data-access/quizzes/delete"
import {
    addQuestionsToQuiz,
    updateQuizQuestions,
} from "@/data-access/quizzes/update"
import { toastError, toastSuccess } from "@/lib/toasts"
import { useQueryClient } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { useRouter } from "nextjs-toploader/app"
import { useState } from "react"
import useUpdateQuizStore, {
    StateMatchingPairsOptions,
    StateMultipleChoiceOptions,
} from "../store"
export default function Buttons() {
    const params = useParams()
    const quizId = parseInt(params["id"] as string)
    const reset = useUpdateQuizStore((s) => s.reset)
    const questions = useUpdateQuizStore((s) => s.allQuestions)
    const removedQuestionsIds = useUpdateQuizStore((s) => s.deletedQuestionsIds)
    const router = useRouter()
    const [isSaving, setIsSaving] = useState(false)
    const [isWarning, setIsWarning] = useState(false)
    const queryClient = useQueryClient()
    const handleSave = async () => {
        try {
            if (isNaN(quizId) === false && quizId) {
                setIsSaving(true)

                // TODO make this implemented inside a transaction
                const isUpdatedOldSuccess = await updateOldQuestions()
                const isQuestionDeleteSuccess = await deleteRemovedQuestions()
                const isSavedNewQuestionsSuccess = await saveNewQuestions()

                if (!isUpdatedOldSuccess) {
                    toastError("Error while updating some questions...")
                    throw new Error("Error while updating some questions...")
                }
                if (!isQuestionDeleteSuccess) {
                    toastError("Error while deleting some questions...")
                    throw new Error("Error while deleting some questions...")
                }
                if (!isSavedNewQuestionsSuccess) {
                    toastError(
                        "Error while saving some of the new questions..."
                    )
                    throw new Error(
                        "Error while saving some of the new questions..."
                    )
                }
                toastSuccess("Changes saved successfully.")
                queryClient.invalidateQueries({
                    queryKey: ["quizzes"],
                })
                router.replace("/admin/quizzes")
                reset()
            }
        } catch (error) {
            console.error(error)
            // wait(200).then(() => window.location.reload())
        } finally {
            setIsSaving(false)
        }
    }

    const updateOldQuestions = async () => {
        try {
            await updateQuizQuestions(
                questions
                    .filter((q) => !!q.questionId)
                    .map((q) => {
                        if (q.type === "MULTIPLE_CHOICE") {
                            const content =
                                q.content as StateMultipleChoiceOptions
                            const filteredOptions = content.options.filter(
                                (opt) => !!opt.text
                            )
                            return {
                                quizId,
                                id: Number(q.questionId),
                                content: { options: filteredOptions },
                                type: q.type as any,
                                image: q.imageUrl || "",
                                question: q.questionText,
                                layout: q.layout,
                            }
                        }
                        if (q.type === "MATCHING_PAIRS") {
                            const content =
                                q.content as StateMatchingPairsOptions
                            const filteredRightOptions =
                                content.rightOptions.filter((opt) => !!opt.text)

                            const filteredLeftOptions =
                                content.leftOptions.filter((opt) => !!opt.text)

                            return {
                                quizId,
                                id: Number(q.questionId),
                                content: {
                                    leftOptions: filteredLeftOptions,
                                    rightOptions: filteredRightOptions,
                                },
                                type: q.type as any,
                                image: q.imageUrl || "",
                                question: q.questionText,
                                layout: q.layout,
                            }
                        }
                        return null
                    })
                    .filter((q) => !!q)
            )
            return true
        } catch (error) {
            console.error(error)
            return false
        }
    }

    const saveNewQuestions = async () => {
        const newQuestions = questions.filter((q) => !q.questionId)
        try {
            await addQuestionsToQuiz(
                quizId,
                newQuestions
                    .map((q) => {
                        if (q.type === "MULTIPLE_CHOICE") {
                            const content =
                                q.content as StateMultipleChoiceOptions
                            const filteredOptions = content.options.filter(
                                (opt) => !!opt.text
                            )
                            return {
                                content: { options: filteredOptions },
                                type: q.type as any,
                                image: q.imageUrl || "",
                                question: q.questionText,
                                layout: q.layout,
                            }
                        }
                        if (q.type === "MATCHING_PAIRS") {
                            const content =
                                q.content as StateMatchingPairsOptions
                            const filteredRightOptions =
                                content.rightOptions.filter((opt) => !!opt.text)

                            const filteredLeftOptions =
                                content.leftOptions.filter((opt) => !!opt.text)

                            return {
                                content: {
                                    leftOptions: filteredLeftOptions,
                                    rightOptions: filteredRightOptions,
                                },
                                type: q.type as any,
                                image: q.imageUrl || "",
                                question: q.questionText,
                                layout: q.layout,
                            }
                        }
                        return null
                    })
                    .filter((q) => !!q)
            )
            return true
        } catch (error) {
            console.error(error)
            return false
        }
    }
    const deleteRemovedQuestions = async () => {
        try {
            await deleteQuizQuestions({ questionIds: removedQuestionsIds })
            return true
        } catch (error) {
            console.error(error)
            return false
        }
    }
    const handleSubmit = async () => {
        const isAllOptionsFilled = questions.every((q) => {
            if (q.type === "MULTIPLE_CHOICE") {
                const content = q.content as
                    | StateMultipleChoiceOptions
                    | undefined

                if (!content || !content.options.length) {
                    return false
                }
                const isOptionsValid =
                    content.options.every((opt) => !!opt.text) &&
                    content.options.length > 0
                return isOptionsValid
            }
            if (q.type === "MATCHING_PAIRS") {
                const content = q.content as
                    | StateMatchingPairsOptions
                    | undefined
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
            return false
        })
        const isQuestionsFilled = questions.every((q) => !!q.content)
        if (!isAllOptionsFilled || !isQuestionsFilled) {
            return setIsWarning(true)
        }
        await handleSave()
    }
    return (
        <div className="flex items-center gap-2">
            <Button
                onClick={() => {
                    reset()
                    router.back()
                }}
                className="text-base font-extrabold"
                variant="red"
            >
                Cancel
            </Button>

            <Button
                onClick={handleSubmit}
                isLoading={isSaving}
                className="text-base font-extrabold"
                variant="blue"
            >
                Save changes
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
                    handleSave()
                    reset()
                    router.back()
                }}
            />
        </div>
    )
}
