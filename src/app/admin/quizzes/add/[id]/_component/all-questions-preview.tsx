import { cn } from "@/lib/ui-utils"
import { useSidenav } from "@/providers/sidenav-provider"
import { Loader2, Plus } from "lucide-react"
import QuestionPreview from "./question-preview"
import useQuizStore from "../store"
import { wait } from "@/utils/wait"
import { useRef } from "react"
export default function AllQuestionsPreviews() {
    const { isSidenavOpen } = useSidenav()
    const questions = useQuizStore((state) => state.allQuestions)
    const addQuestion = useQuizStore((state) => state.addQuestion)
    const selectedQuestionId = useQuizStore(
        (state) => state.selectedQuestionLocalId
    )
    const containerRef = useRef<HTMLDivElement>(null)
    const shadowQuestions = useQuizStore((s) => s.shadowQuestionsCount)

    return (
        <footer
            className={cn(
                "h-[140px] bg-white pb-4 transition-all duration-300 fixed left-0 bottom-0 w-full",
                {
                    "pl-[256px]": isSidenavOpen,
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
                <button
                    onClick={() => {
                        addQuestion({
                            content: { options: [] },
                            imageUrl: null,
                            localId: crypto.randomUUID(),
                            questionText: "",
                            type: "MULTIPLE_CHOICE" as const,
                            layout: "horizontal",
                        })
                        window.scrollTo({
                            behavior: "smooth",
                            top: 0,
                        })
                        wait(0).then(() =>
                            containerRef.current?.scrollTo({
                                left: 100_000,
                                behavior: "smooth",
                            })
                        )
                    }}
                    className="h-full flex items-center justify-center min-w-32 hover:cursor-pointer hover:bg-neutral-50 active:scale-95 transition-all border-dashed border-neutral-300 border-2 rounded-lg"
                >
                    <Plus className="w-16 h-16 text-neutral-300 stroke-1" />
                </button>
            </section>
        </footer>
    )
}
