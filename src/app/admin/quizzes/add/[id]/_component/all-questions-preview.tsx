import { cn } from "@/lib/ui-utils"
import { useSidenav } from "@/providers/sidenav-provider"
import { Plus } from "lucide-react"
import QuestionPreview from "./question-preview"
import useQuizStore from "../store"
export default function AllQuestionsPreviews() {
    const { isSidenavOpen } = useSidenav()
    const questions = useQuizStore((state) => state.allQuestions)
    const addQuestion = useQuizStore((state) => state.addQuestion)
    const selectedQuestionId = useQuizStore(
        (state) => state.selectedQuestionLocalId
    )
    return (
        <footer
            className={cn(
                "h-[120px] bg-white pb-4 transition-all duration-300 fixed left-0 bottom-0 w-full",
                {
                    "pl-[256px]": isSidenavOpen,
                    "pl-[100px]": !isSidenavOpen,
                }
            )}
        >
            <section className="pt-5 h-full overflow-x-auto flex gap-4 px-8 border-t-2">
                {questions.map((question) => (
                    <QuestionPreview
                        isSelected={question.localId == selectedQuestionId}
                        questionLocalId={question.localId}
                        questionText={question.questionText}
                        key={question.localId}
                    />
                ))}
                <button
                    onClick={() => {
                        addQuestion({
                            content: { options: [] },
                            imageUrl: null,
                            localId: crypto.randomUUID(),
                            questionText: "",
                            type: "MULTIPLE_CHOICE" as const,
                        })
                        window.scrollTo({
                            behavior: "smooth",
                            top: 0,
                        })
                    }}
                    className="h-full flex items-center justify-center min-w-32 hover:cursor-pointer hover:bg-neutral-50 active:scale-95 transition-all border-dashed border-neutral-300 border-2 rounded-lg"
                >
                    <Plus className="w-16 h-16 text-neutral-300 stroke-1" />
                </button>
            </section>
        </footer>
    )
}
