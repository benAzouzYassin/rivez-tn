"use client"
import { ErrorDisplay } from "@/components/shared/error-display"
import GeneralLoadingScreen from "@/components/shared/general-loading-screen"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import AllQuestionsPreviews from "./_component/all-questions-preview"
import SelectedQuestionContent from "./_component/selected-question-content"
import useQuizStore from "./store"
import { dismissToasts, toastLoading } from "@/lib/toasts"
import { wait } from "@/utils/wait"
import { useIsSmallScreen } from "@/hooks/is-small-screen"
import UnsupportedScreen from "@/components/shared/unsuported-screen"

export default function Page() {
    const isSmallScreen = useIsSmallScreen()
    const searchParams = useSearchParams()
    const isGeneratingWithAi = searchParams.get("isGeneratingWithAi") === "true"
    const resetState = useQuizStore((s) => s.reset)
    const isGeneratingState = useQuizStore((s) => s.isGeneratingQuizWithAi)
    const isGenerationError = useQuizStore((s) => s.isGenerationQuizError)
    const shadowQuestionsCount = useQuizStore((s) => s.shadowQuestionsCount)
    useEffect(() => {
        if (!isGeneratingWithAi) {
            // we reset the state only when we are not generating.
            // when we are generating we reset it in the add dialog instead
            resetState()
        }
    }, [isGeneratingWithAi, resetState])

    useEffect(() => {
        if (shadowQuestionsCount > 0) {
            toastLoading("Generating you quiz.")
        } else {
            wait(100).then(() => dismissToasts("loading"))
        }
    }, [shadowQuestionsCount])

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
                    <SelectedQuestionContent />
                    <AllQuestionsPreviews />
                </div>
            )}
        </section>
    )
}
