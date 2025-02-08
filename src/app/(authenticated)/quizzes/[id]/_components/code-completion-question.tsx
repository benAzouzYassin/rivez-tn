import { Button } from "@/components/ui/button"
import { useQuestionsStore } from "../store"

export default function CodeCompletionQuestion() {
    const incrementQuestionIndex = useQuestionsStore(
        (s) => s.incrementQuestionIndex
    )
    return (
        <div className="flex flex-col items-center justify-center">
            not ready yet
            <Button variant={"green"} onClick={() => incrementQuestionIndex()}>
                Next question
            </Button>
        </div>
    )
}
