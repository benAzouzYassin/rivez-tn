import { cn } from "@/lib/ui-utils"
import { useSidenav } from "@/providers/sidenav-provider"
import { Loader2 } from "lucide-react"
import useQuizStore from "../store"
import AddQuestionButton from "./add-question-button"
import QuestionPreview from "./question-preview"
import { useEffect, useRef } from "react"
import { wait } from "@/utils/wait"
export default function AllQuestionsPreviews() {
    const { isSidenavOpen } = useSidenav()
    const questions = useQuizStore((state) => state.allQuestions)
    const selectedQuestionId = useQuizStore(
        (state) => state.selectedQuestionLocalId
    )
    const shadowQuestions = useQuizStore((s) => s.shadowQuestionsCount)

    const containerRef = useRef<HTMLDivElement>(null)
    const handleScrollToLeft = (e: WheelEvent) => {
        if (containerRef.current) {
            containerRef.current.scrollLeft += e.deltaY * 0.5
            e.preventDefault()
        }
    }
    useEffect(() => {
        const currentRef = containerRef.current
        if (currentRef) {
            currentRef.addEventListener("wheel", handleScrollToLeft)
        }
        return () => {
            if (currentRef) {
                currentRef.removeEventListener("wheel", handleScrollToLeft)
            }
        }
    }, [containerRef])
    const handleQuestionAdd = () => {
        wait(100).then(() => {
            if (containerRef.current) {
                containerRef.current.scrollLeft += 500
            }
        })
    }
    return (
        <footer
            className={cn(
                "h-[120px] bg-white pb-2 transition-all duration-300 fixed left-0 bottom-0 w-full",
                {
                    "ltr:pl-[300px] rtl:pr-[300px]": isSidenavOpen,
                    "ltr:pl-[100px] rtl:pr-[100px]": !isSidenavOpen,
                }
            )}
        >
            <section
                dir="ltr"
                ref={containerRef}
                className="pt-3 h-[115px] pb-4  overflow-x-auto overflow-y-hidden flex gap-2 px-8 border-t-2"
            >
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
