import { cn } from "@/lib/ui-utils"
import { useSidenav } from "@/providers/sidenav-provider"
import { useEffect, useRef } from "react"
import useUpdateQuizStore from "../store"
import AddQuestionButton from "./add-question-button"
import QuestionPreview from "./question-preview"
import { wait } from "@/utils/wait"

export default function AllQuestionsPreviews() {
    const { isSidenavOpen } = useSidenav()
    const questions = useUpdateQuizStore((state) => state.allQuestions)
    const selectedQuestionId = useUpdateQuizStore(
        (state) => state.selectedQuestionLocalId
    )
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
                "h-[120px] bg-white dark:bg-neutral-900 pb-2 transition-all duration-300 fixed left-0 bottom-0 w-full",
                {
                    "ltr:pl-[300px] rtl:pr-[300px]": isSidenavOpen,
                    "ltr:pl-[100px] rtl:pr-[100px]": !isSidenavOpen,
                }
            )}
        >
            <section
                dir="ltr"
                ref={containerRef}
                className="pt-5 pb-2 h-full overflow-y-hidden overflow-x-auto flex gap-4 px-8 border-t-2 border-neutral-200 dark:border-neutral-700"
            >
                {questions.map((question) => (
                    <QuestionPreview
                        isSelected={question.localId == selectedQuestionId}
                        questionLocalId={question.localId}
                        questionText={question.questionText}
                        key={question.localId}
                    />
                ))}
                <AddQuestionButton
                    onAdd={handleQuestionAdd}
                    displayOrder={questions.length}
                />
            </section>
        </footer>
    )
}
