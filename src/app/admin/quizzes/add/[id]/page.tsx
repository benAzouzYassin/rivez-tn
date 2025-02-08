"use client"
// import { useParams } from "next/navigation"
import AllQuestionsPreviews from "./_component/all-questions-preview"
import SelectedQuestionContent from "./_component/selected-question-content"

export default function Page() {
    // const params = useParams()
    // const quizId = params["id"]
    return (
        <section className="   min-h-[100vh] pb-[200px]">
            <SelectedQuestionContent />
            <AllQuestionsPreviews />
        </section>
    )
}
