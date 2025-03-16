import { cn } from "@/lib/ui-utils"
import { useSidenav } from "@/providers/sidenav-provider"
import { Loader2 } from "lucide-react"
import useQuizStore from "../store"
import AddQuestionButton from "./add-question-button"
import QuestionPreview from "./question-preview"
export default function AllQuestionsPreviews() {
    const { isSidenavOpen } = useSidenav()
    const questions = useQuizStore((state) => state.allQuestions)
    const selectedQuestionId = useQuizStore(
        (state) => state.selectedQuestionLocalId
    )
    const shadowQuestions = useQuizStore((s) => s.shadowQuestionsCount)

    return (
        <footer
            className={cn(
                "h-[140px]  bg-white pb-4 transition-all duration-300 fixed left-0 bottom-0 w-full",
                {
                    "pl-[300px]": isSidenavOpen,
                    "pl-[100px]": !isSidenavOpen,
                }
            )}
        >
            <section className="pt-5 pb-3 h-full overflow-x-auto flex gap-2 px-8 border-t-2">
                {questions.map((question) => (
                    <QuestionPreview
                        isSelected={question.localId == selectedQuestionId}
                        questionLocalId={question.localId}
                        questionText={question.questionText}
                        key={question.localId}
                    />
                ))}
                {Array.from({ length: shadowQuestions }).map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            "relative group min-w-[140px] w-[140px] h-[87px]  flex items-center justify-center transform transition-all duration-300 ease-in-out border rounded-xl border-neutral-300 bg-neutral-50 shadow-sm"
                        )}
                    >
                        <Loader2 className="w-5 h-5 animate-spin text-neutral-400/70 duration-500" />
                    </div>
                ))}
                <AddQuestionButton />
            </section>
        </footer>
    )
}
