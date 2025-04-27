"use client"
import { ErrorDisplay } from "@/components/shared/error-display"
import GeneralLoadingScreen from "@/components/shared/general-loading-screen"
import { useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import AllQuestionsPreviews from "./_component/all-questions-preview"
import SelectedQuestionContent from "./_component/selected-question-content"
import useQuizStore from "./store"
import { dismissToasts, toastLoading } from "@/lib/toasts"
import { wait } from "@/utils/wait"
import { useIsSmallScreen } from "@/hooks/is-small-screen"
import UnsupportedScreen from "@/components/shared/unsuported-screen"
import QuizStartDialog from "../_components/quiz-start-dialog"

export default function Page() {
    const isSmallScreen = useIsSmallScreen()
    const searchParams = useSearchParams()
    const isGeneratingWithAi = searchParams.get("isGeneratingWithAi") === "true"
    const resetState = useQuizStore((s) => s.reset)
    const isGeneratingState = useQuizStore((s) => s.isGeneratingQuizWithAi)
    const isGenerationError = useQuizStore((s) => s.isGenerationQuizError)
    const shadowQuestionsCount = useQuizStore((s) => s.shadowQuestionsCount)
    const [isConfirming, setIsConfirming] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const didCloseConfirmationDialog = useRef(false)
    useEffect(() => {
        if (!isGeneratingWithAi) {
            // we reset the state only when we are not generating.
            // when we are generating we reset it in the add dialog instead
            resetState()
        }
    }, [isGeneratingWithAi, resetState])

    useEffect(() => {
        if (shadowQuestionsCount > 0) {
            if (didCloseConfirmationDialog.current === false) {
                setIsConfirming(true)
            }
            toastLoading("Generating you quiz.")
        } else {
            wait(100).then(() => {
                dismissToasts("loading")
                if (isSubmitting) {
                    const btn = document.getElementById(
                        "save-and-take-quiz-button"
                    )
                    btn?.click()
                }
            })
        }
    }, [shadowQuestionsCount, isSubmitting])

    if (isGenerationError) {
        return (
            <section className="   min-h-[100vh] pb-[200px]">
                <ErrorDisplay />
            </section>
        )
    }
    if (isSmallScreen) {
        return <UnsupportedScreen />
    }
    return (
        <section className=" relative  min-h-[100vh] pb-[200px]">
            {isGeneratingState ? (
                <>
                    <GeneralLoadingScreen text="Generating your quiz" />
                </>
            ) : (
                <div>
                    <QuizStartDialog
                        isOpen={isConfirming}
                        isLoading={isSubmitting}
                        onEdit={() => {
                            setIsConfirming(false)
                            didCloseConfirmationDialog.current = true
                        }}
                        onOpenChange={(value) => {
                            if (didCloseConfirmationDialog.current && value) {
                                return
                            }
                            if (value === false) {
                                didCloseConfirmationDialog.current = true
                            }
                            setIsConfirming(value)
                        }}
                        onTake={() => {
                            setIsSubmitting(true)
                        }}
                    />
                    <SelectedQuestionContent />
                    <AllQuestionsPreviews />
                </div>
            )}
        </section>
    )
}
