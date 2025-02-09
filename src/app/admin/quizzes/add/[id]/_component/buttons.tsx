import { Button } from "@/components/ui/button"
import DestructiveAction from "@/components/ui/destructive-action-warning"
import { softDeleteQuizById } from "@/data-access/quizzes/delete"
import {
    addQuestionsToQuiz,
    updateQuizPublishingStatus,
} from "@/data-access/quizzes/update"
import { toastError, toastSuccess } from "@/lib/toasts"
import { useParams } from "next/navigation"
import { useRouter } from "nextjs-toploader/app"
import { useState } from "react"
import useQuizStore from "../store"
export default function Buttons() {
    const params = useParams()
    const quizId = parseInt(params["id"] as string)
    const reset = useQuizStore((s) => s.reset)
    const questions = useQuizStore((s) => s.allQuestions)
    const router = useRouter()
    const [isPublishing, setIsPublishing] = useState(false)
    const [isSavingAsDraft, setIsSavingAsDraft] = useState(false)

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
                    questions.map((q) => ({
                        content: q.content,
                        type: q.type as any,
                        image: q.imageUrl || "",
                        question: q.questionText,
                    }))
                )
                toastSuccess("Saved successfully.")
                if (action === "publish") {
                    await updateQuizPublishingStatus(quizId, "PUBLISHED")
                } else {
                    await updateQuizPublishingStatus(quizId, "DRAFT")
                }
                router.back()
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

    return (
        <div className="flex items-center gap-2">
            <DestructiveAction
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
            </DestructiveAction>
            <Button
                onClick={() => handleSave("publish")}
                isLoading={isPublishing}
                className="text-base font-extrabold"
                variant="secondary"
            >
                Publish
            </Button>
            <Button
                isLoading={isSavingAsDraft}
                onClick={() => () => handleSave("saveAsDraft")}
                className="text-base font-extrabold"
                variant="blue"
            >
                Save draft
            </Button>
        </div>
    )
}
