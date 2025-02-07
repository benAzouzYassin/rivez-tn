import { cn } from "@/lib/ui-utils"
import { useSidenav } from "@/providers/sidenav-provider"
import { useAtom, useSetAtom } from "jotai"
import { Plus } from "lucide-react"
import QuestionPreview from "./question"
import { allQuestionsAtom, selectedQuestionIdAtom } from "../atoms"

export default function AllQuestionsPreviews() {
    const { isSidenavOpen } = useSidenav()
    const [questions, setQuestions] = useAtom(allQuestionsAtom)
    const setSelectedQuestionId = useSetAtom(selectedQuestionIdAtom)

    return (
        <footer
            className={cn(
                "h-36 transition-all duration-300  fixed left-0 bottom-4 w-full",
                {
                    "pl-[256px]": isSidenavOpen,
                    "pl-[100px]": !isSidenavOpen,
                }
            )}
        >
            <section className="pt-5 pb-3 overflow-x-auto flex  gap-4 px-8  border-t-2">
                {questions.map((question) => (
                    <QuestionPreview
                        question={question}
                        key={question.localId}
                    />
                ))}
                <button
                    onClick={() => {
                        const newQuestion = {
                            content: {
                                correct: [],
                                options: ["item one", "item two"],
                            },
                            imageUrl: null,
                            localId: crypto.randomUUID(),
                            questionText: "",
                            type: "MULTIPLE_CHOICE" as any,
                        }
                        setQuestions((prev) => [...prev, newQuestion])
                        if (questions.length === 0) {
                            setSelectedQuestionId(newQuestion.localId)
                        }
                    }}
                    className="h-28 flex items-center justify-center min-w-32 hover:cursor-pointer hover:bg-neutral-50 active:scale-95 transition-all border-dashed border-neutral-300   border-2 rounded-lg"
                >
                    <Plus className="w-16 h-16 text-neutral-300 stroke-1 " />
                </button>
            </section>
        </footer>
    )
}
