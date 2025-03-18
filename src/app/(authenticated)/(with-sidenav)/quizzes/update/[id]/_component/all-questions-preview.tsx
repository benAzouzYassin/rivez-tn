import { cn } from "@/lib/ui-utils"
import { useSidenav } from "@/providers/sidenav-provider"
import { useRef } from "react"
import useUpdateQuizStore from "../store"
import AddQuestionButton from "./add-question-button"
import QuestionPreview from "./question-preview"
export default function AllQuestionsPreviews() {
    const { isSidenavOpen } = useSidenav()
    const questions = useUpdateQuizStore((state) => state.allQuestions)
    const selectedQuestionId = useUpdateQuizStore(
        (state) => state.selectedQuestionLocalId
    )
    const containerRef = useRef<HTMLDivElement>(null)
    return (
        <footer
            className={cn(
                "h-[120px] bg-white pb-2 transition-all duration-300 fixed left-0 bottom-0 w-full",
                {
                    "pl-[300px]": isSidenavOpen,
                    "pl-[100px]": !isSidenavOpen,
                }
            )}
        >
            <section
                ref={containerRef}
                className="pt-5 pb-2 h-full overflow-x-auto flex gap-4 px-8 border-t-2"
            >
                {questions.map((question) => (
                    <QuestionPreview
                        isSelected={question.localId == selectedQuestionId}
                        questionLocalId={question.localId}
                        questionText={question.questionText}
                        key={question.localId}
                    />
                ))}
                <AddQuestionButton displayOrder={questions.length} />
            </section>
        </footer>
    )
}
