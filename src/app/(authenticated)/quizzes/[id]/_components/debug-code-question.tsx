import { Button } from "@/components/ui/button"
import { useAtom } from "jotai"
import { currentQuestionIndexAtom, QuestionType } from "../atoms"
type Props = {
    question: QuestionType
}
export default function DebugCodeQuestion(props: Props) {
    const [, setQuestionIndex] = useAtom(currentQuestionIndexAtom)

    return (
        <div className="flex flex-col items-center justify-center">
            not ready yet
            <Button
                variant={"green"}
                onClick={() => setQuestionIndex((prev) => prev + 1)}
            >
                Next question
            </Button>
        </div>
    )
}
