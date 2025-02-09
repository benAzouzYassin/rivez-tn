"use client"
import { useEffect } from "react"
import AllQuestionsPreviews from "./_component/all-questions-preview"
import SelectedQuestionContent from "./_component/selected-question-content"
import useQuizStore from "./store"

export default function Page() {
    const resetState = useQuizStore((s) => s.reset)
    useEffect(() => {
        resetState()
    }, [resetState])
    return (
        <section className="   min-h-[100vh] pb-[200px]">
            <SelectedQuestionContent />
            <AllQuestionsPreviews />
        </section>
    )
}
