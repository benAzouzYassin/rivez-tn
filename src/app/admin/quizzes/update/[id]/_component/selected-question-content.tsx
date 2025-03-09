import useUpdateQuizStore from "../store"
import AddQuestionsButton from "./add-question-button"
import Buttons from "./buttons"
import FillInTheBlankContentComp from "./fill-in-the-blank/fill-in-the-blank-content"
import LayoutSelect from "./layout-select"
import MultipleChoiceContent from "./multiple-choice-question/multiple-choice-content"
import MatchingPairsContent from "./pair-matchint-question/pair-matching-content"

export default function SelectedQuestionContent() {
    const selectedQuestionId = useUpdateQuizStore(
        (s) => s.selectedQuestionLocalId
    )
    const allQuestions = useUpdateQuizStore((s) => s.allQuestions)

    const selectedQuestion = allQuestions.find(
        (q) => q.localId === selectedQuestionId
    )
    if (!selectedQuestion) {
        return (
            <section className="flex min-h-[70vh] items-center justify-center w-full h-full">
                <AddQuestionsButton
                    className="h-56 hover:cursor-pointer w-96 flex flex-col items-center justify-center 
border-2 border-dashed border-neutral-300 
rounded-lg bg-white hover:bg-neutral-50 
active:scale-95 transition-transform duration-150"
                    displayOrder={allQuestions.length}
                />
            </section>
        )
    }

    return (
        <section className="mt-10 h-full px-20 w-full">
            <section className="flex justify-between">
                <div className="flex items-center ">
                    <LayoutSelect selectedQuestion={selectedQuestion} />
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
            {selectedQuestion.type === "FILL_IN_THE_BLANK" && (
                <FillInTheBlankContentComp />
            )}
        </section>
    )
}
