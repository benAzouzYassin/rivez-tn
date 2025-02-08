import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    PossibleQuestionTypes,
    PossibleQuestionTypesEnum,
} from "@/schemas/questions-content"
import { cn } from "@/lib/ui-utils"
import useQuizStore from "../store"

interface Props {
    className?: string
}

export default function QuestionTypeSelect(props: Props) {
    const selectedQuestion = useQuizStore((state) => state.selectedQuestion)
    const setAllQuestions = useQuizStore((state) => state.setAllQuestions)
    const allQuestions = useQuizStore((state) => state.allQuestions)

    return (
        <Select
            onValueChange={(value) => {
                const updatedQuestions = allQuestions.map((q) => {
                    if (q.localId === selectedQuestion?.localId) {
                        return { ...q, type: value as PossibleQuestionTypes }
                    }
                    return q
                })
                setAllQuestions(updatedQuestions)
            }}
            value={selectedQuestion?.type}
        >
            <SelectTrigger className={cn(props.className)}>
                <span className="mr-2 font-bold">Type:</span>
                <SelectValue placeholder="Question type" />
                <span className="mr-2"></span>
            </SelectTrigger>
            <SelectContent>
                <SelectItem
                    value={PossibleQuestionTypesEnum.Values.MULTIPLE_CHOICE}
                >
                    Multiple choice
                </SelectItem>
                <SelectItem
                    value={PossibleQuestionTypesEnum.Values.MATCHING_PAIRS}
                >
                    Matching pairs
                </SelectItem>
                <SelectItem
                    disabled
                    value={PossibleQuestionTypesEnum.Values.DEBUG_CODE}
                >
                    Code debugging <span className="text-sm">(soon)</span>
                </SelectItem>
                <SelectItem
                    disabled
                    value={PossibleQuestionTypesEnum.Values.CODE_COMPLETION}
                >
                    Code completion <span className="text-sm">(soon)</span>
                </SelectItem>
            </SelectContent>
        </Select>
    )
}
