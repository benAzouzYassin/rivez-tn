import { useAtomValue, useSetAtom } from "jotai"
import { Plus } from "lucide-react"
import {
    allQuestionsAtom,
    selectedQuestionAtom,
    selectedQuestionIdAtom,
} from "../atoms"
import QuestionTypeSelect from "./question-type-select"
import { Button } from "@/components/ui/button"
import MatchingPairsContent from "./pair-matching-content"
import MultipleChoiceContent from "./multiple-choice-content"

export default function SelectedQuestionContent() {
    const selectedQuestion = useAtomValue(selectedQuestionAtom)
    const setAllQuestions = useSetAtom(allQuestionsAtom)
    const setSelectedQuestionId = useSetAtom(selectedQuestionIdAtom)

    if (!selectedQuestion) {
        return (
            <section className="flex items-center justify-center w-full min-h-[70vh] h-full">
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
                        setAllQuestions((prev) => [...prev, newQuestion])
                        setSelectedQuestionId(newQuestion.localId)
                    }}
                    aria-label="Add new question"
                    className="h-56 hover:cursor-pointer w-96 flex flex-col items-center justify-center 
                     border-2 border-dashed border-neutral-300 
                     rounded-lg bg-white     hover:bg-neutral-50 
                     active:scale-95 transition-transform duration-150"
                >
                    <Plus className="w-16 h-16 text-neutral-300" />
                    <span className="text-xl  text-neutral-400 mt-1 font-bold">
                        Add Question
                    </span>
                </button>
            </section>
        )
    }

    return (
        <section className=" mt-10 px-20 w-full">
            <section className="flex justify-between  ">
                <QuestionTypeSelect className=" " />
                <div className="flex items-center gap-2">
                    <Button
                        className="text-base font-extrabold "
                        variant={"red"}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="text-base  font-extrabold "
                        variant={"secondary"}
                    >
                        Publish
                    </Button>
                    <Button
                        className="text-base font-extrabold "
                        variant={"blue"}
                    >
                        Save draft
                    </Button>
                </div>
            </section>
            {/* content */}
            {selectedQuestion.type === "MATCHING_PAIRS" && (
                <MatchingPairsContent />
            )}
            {selectedQuestion.type === "MULTIPLE_CHOICE" && (
                <MultipleChoiceContent />
            )}
        </section>
    )
}
