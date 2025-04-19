import GeneralLoadingScreen from "@/components/shared/general-loading-screen"
import useQuizStore, { QuizQuestionType } from "../store"
import AddQuestionButton from "./add-question-button"
import Buttons from "./buttons"
import FillInTheBlankContent from "./fill-in-the-blank/fill-in-the-blank-content"
import LayoutSelect from "./layout-select"
import MultipleChoiceContent from "./multiple-choice-question/multiple-choice-content"
import MatchingPairsContent from "./pair-matchint-question/pair-matching-content"

export default function SelectedQuestionContent() {
    const selectedQuestionId = useQuizStore((s) => s.selectedQuestionLocalId)
    const allQuestions = useQuizStore((s) => s.allQuestions)
    const selectedQuestion = allQuestions.find(
        (q) => q.localId === selectedQuestionId
    )
    const updateQuestion = useQuizStore((s) => s.updateQuestion)
    const isBeingGenerated = useQuizStore((s) => s.isAddingQuestionByAi)
    const setHints = (hints: QuizQuestionType["hints"]) => {
        if (selectedQuestionId) {
            updateQuestion(
                {
                    hints,
                },
                selectedQuestionId
            )
        }
    }
    const getOptionsForHint = () => {}

    if (isBeingGenerated) {
        return (
            <GeneralLoadingScreen enableBlob text="Generating your question" />
        )
    }
    if (!selectedQuestion) {
        return (
            <section className="flex min-h-[70vh] items-center justify-center w-full h-full">
                <AddQuestionButton
                    className="h-56 hover:cursor-pointer w-96 flex flex-col items-center justify-center 
                   border-2 border-dashed border-neutral-300 
                   rounded-lg bg-white hover:bg-neutral-50 
                   active:scale-95 transition-transform duration-150"
                />
            </section>
        )
    }
    return (
        <section className="mt-10 h-full relative md:ml-0 -ml-2 md:px-20 w-full">
            <section className="flex justify-between">
                <div className="flex pb-3 flex-col relative  ">
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
                <FillInTheBlankContent />
            )}
        </section>
    )
}
