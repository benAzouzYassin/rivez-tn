import useQuizStore, { MatchingPairsOptions } from "../../store"
import { QuestionText } from "../question-text"
import LeftSection from "./left-section"
import RightSection from "./right-section"

export default function MatchingPairsContent() {
    const selectedQuestionId = useQuizStore((s) => s.selectedQuestionLocalId)
    const selectedQuestion = useQuizStore((s) => s.allQuestions).find(
        (q) => q.localId === selectedQuestionId
    )
    const content = selectedQuestion?.content as
        | MatchingPairsOptions
        | undefined
    if (!selectedQuestion) {
        return null
    }

    return (
        <section className="w-full flex flex-col items-center min-h-56 mt-6  h-full  ">
            <div className="w-[1120px] flex flex-col items-center justify-center">
                <QuestionText
                    className="min-w-[500px]"
                    text={selectedQuestion.questionText}
                    localId={selectedQuestion?.localId}
                />

                <div className="max-w-[1200px] min-w-[700px] justify-center items-center mt-20 gap-10 w-full flex">
                    <LeftSection leftOptions={content?.leftOptions} />
                    <RightSection
                        leftOptions={content?.leftOptions}
                        rightOptions={content?.rightOptions}
                    />
                </div>
            </div>
        </section>
    )
}
