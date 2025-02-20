"use client"
import { useEffect } from "react"
import AllQuestionsPreviews from "./_component/all-questions-preview"
import SelectedQuestionContent from "./_component/selected-question-content"
import useUpdateQuizStore from "./store"
import { useParams } from "next/navigation"
import GeneralLoadingScreen from "@/components/shared/general-loading-screen"
import { ErrorDisplay } from "@/components/shared/error-display"

export default function Page() {
    const params = useParams()
    const quizId = Number(params["id"])
    const loadQuizData = useUpdateQuizStore((s) => s.loadQuizData)
    const isLoading = useUpdateQuizStore((s) => s.isLoadingData)
    const isError = useUpdateQuizStore((s) => s.isLoadingError)
    useEffect(() => {
        loadQuizData(quizId)
    }, [loadQuizData, quizId])
    return (
        <section className="   min-h-[100vh] pb-[200px]">
            {isLoading && <GeneralLoadingScreen text="Loading quiz data" />}
            {isError && <ErrorDisplay />}
            {!isLoading && !isError && (
                <>
                    <SelectedQuestionContent />
                    <AllQuestionsPreviews />
                </>
            )}
        </section>
    )
}
