import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useMemo } from "react"
import useQuizStore from "../store"
import MultipleChoiceContent from "./multiple-choice-question/multiple-choice-content"
import QuestionTypeSelect from "./question-type-select"

export default function SelectedQuestionContent() {
    const selectedQuestionId = useQuizStore((s) => s.selectedQuestionLocalId)
    const getSelectedQuestion = useQuizStore((s) => s.getQuestion)
    const addQuestion = useQuizStore((s) => s.addQuestion)
    const selectedQuestion = useMemo(
        () => getSelectedQuestion(selectedQuestionId || ""),
        [getSelectedQuestion, selectedQuestionId]
    )
    if (!selectedQuestion) {
        return (
            <section className="flex items-center justify-center w-full h-full">
                <button
                    onClick={() => {
                        addQuestion({
                            content: { options: [] },
                            imageUrl: null,
                            localId: crypto.randomUUID(),
                            questionText: "",
                            type: "MULTIPLE_CHOICE" as const,
                        })
                    }}
                    aria-label="Add new question"
                    className="h-56 hover:cursor-pointer w-96 flex flex-col items-center justify-center 
                   border-2 border-dashed border-neutral-300 
                   rounded-lg bg-white hover:bg-neutral-50 
                   active:scale-95 transition-transform duration-150"
                >
                    <Plus className="w-16 h-16 text-neutral-300" />
                    <span className="text-xl text-neutral-400 mt-1 font-bold">
                        Add Question
                    </span>
                </button>
            </section>
        )
    }

    return (
        <section className="mt-10 h-full px-20 w-full">
            <section className="flex justify-between">
                <QuestionTypeSelect className="" />
                <div className="flex items-center gap-2">
                    <Button className="text-base font-extrabold" variant="red">
                        Cancel
                    </Button>
                    <Button
                        className="text-base font-extrabold"
                        variant="secondary"
                    >
                        Publish
                    </Button>
                    <Button className="text-base font-extrabold" variant="blue">
                        Save draft
                    </Button>
                </div>
            </section>
            <MultipleChoiceContent />
            {/* {selectedQuestion.type === "MULTIPLE_CHOICE" && (
                <MultipleChoiceContent />
            )}

            {selectedQuestion.type === "MATCHING_PAIRS" && (
                <MatchingPairsContent />
            )} */}
        </section>
    )
}
