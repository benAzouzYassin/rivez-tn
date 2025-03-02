import { cn } from "@/lib/ui-utils"
import { useSidenav } from "@/providers/sidenav-provider"
import { Plus } from "lucide-react"
import QuestionPreview from "./question-preview"
import useUpdateQuizStore from "../store"
import { useRef } from "react"
import { wait } from "@/utils/wait"
export default function AllQuestionsPreviews() {
    const { isSidenavOpen } = useSidenav()
    const questions = useUpdateQuizStore((state) => state.allQuestions)
    const addQuestion = useUpdateQuizStore((state) => state.addQuestion)
    const selectedQuestionId = useUpdateQuizStore(
        (state) => state.selectedQuestionLocalId
    )
    const containerRef = useRef<HTMLDivElement>(null)
    return (
        <footer
            className={cn(
                "h-[120px] bg-white pb-2 transition-all duration-300 fixed left-0 bottom-0 w-full",
                {
                    "pl-[256px]": isSidenavOpen,
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
                <button
                    onClick={() => {
                        addQuestion({
                            codeSnippets: null,
                            imageType: "normal-image",
                            questionId: null,
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
