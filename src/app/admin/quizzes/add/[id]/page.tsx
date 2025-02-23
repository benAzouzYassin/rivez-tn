"use client"
import { useEffect } from "react"
import AllQuestionsPreviews from "./_component/all-questions-preview"
import SelectedQuestionContent from "./_component/selected-question-content"
import useQuizStore from "./store"
import { useSearchParams } from "next/navigation"
import GeneralLoadingScreen from "@/components/shared/general-loading-screen"
import { ErrorDisplay } from "@/components/shared/error-display"

export default function Page() {
    const searchParams = useSearchParams()
    const isGeneratingWithAi = searchParams.get("isGeneratingWithAi") === "true"
    const resetState = useQuizStore((s) => s.reset)
    const isGeneratingState = useQuizStore((s) => s.isGeneratingWithAi)
    const isGenerationError = useQuizStore((s) => s.isGenerationError)
    useEffect(() => {
        if (!isGeneratingWithAi) {
            // we reset the state only when we are not generating.
            // when we are generating we reset it in the add dialog instead
            resetState()
        }
    }, [isGeneratingWithAi, resetState])

    if (isGenerationError) {
        return (
            <section className="   min-h-[100vh] pb-[200px]">
                <ErrorDisplay />
            </section>
        )
    }
    return (
        <section className="   min-h-[100vh] pb-[200px]">
            {isGeneratingState ? (
                <>
                    <GeneralLoadingScreen text="Generating your quiz" />
                </>
            ) : (
                <>
                    <SelectedQuestionContent />
                    <AllQuestionsPreviews />
                </>
            )}
        </section>
    )
}
