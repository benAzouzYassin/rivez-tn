import { Plus } from "lucide-react"
import useQuizStore from "../store"
import Buttons from "./buttons"
import LayoutSelect from "./layout-select"
import MultipleChoiceContent from "./multiple-choice-question/multiple-choice-content"
import MatchingPairsContent from "./pair-matchint-question/pair-matching-content"

export default function SelectedQuestionContent() {
    const selectedQuestionId = useQuizStore((s) => s.selectedQuestionLocalId)
    const allQuestions = useQuizStore((s) => s.allQuestions)

    const addQuestion = useQuizStore((s) => s.addQuestion)
    const selectedQuestion = allQuestions.find(
        (q) => q.localId === selectedQuestionId
    )
    if (!selectedQuestion) {
        return (
            <section className="flex min-h-[70vh] items-center justify-center w-full h-full">
                <button
                    onClick={() => {
                        addQuestion({
                            displayOrder: allQuestions.length,
                            questionId: null,
                            codeSnippets: null,
                            imageType: "normal-image",
                            content: { options: [] },
                            imageUrl: null,
                            localId: crypto.randomUUID(),
                            questionText: "",
                            type: "MULTIPLE_CHOICE" as const,
                            layout: "horizontal",
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
                <div className="flex items-center ">
                    <LayoutSelect
                        layout={selectedQuestion.layout}
                        selectedType={selectedQuestion.type}
                        questionLocalId={selectedQuestion.localId}
                        imageType={selectedQuestion.imageType}
                        className=""
                    />
                </div>
                <div className="flex items-center">
                    <Buttons />
                </div>
            </section>

            {selectedQuestion.type === "MULTIPLE_CHOICE" && (
                <MultipleChoiceContent />
            )}

            {selectedQuestion.type === "MATCHING_PAIRS" && (
                <MatchingPairsContent />
            )}
        </section>
    )
}
