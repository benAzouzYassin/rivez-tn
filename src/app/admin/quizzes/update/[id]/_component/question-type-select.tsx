import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/ui-utils"
import {
    possibleQuestionTypes,
    PossibleQuestionTypes,
} from "@/schemas/questions-content"
import useUpdateQuizStore from "../store"

interface Props {
    className?: string
    selectedType: PossibleQuestionTypes
    questionLocalId: string
}

export default function QuestionTypeSelect(props: Props) {
    const updateQuestion = useUpdateQuizStore((s) => s.updateQuestion)
    return (
        <Select
            value={props.selectedType}
            onValueChange={(value) => {
                if (possibleQuestionTypes.includes(value as any)) {
                    updateQuestion(
                        {
                            type: value as any,
                        },
                        props.questionLocalId
                    )
                }
            }}
        >
            <SelectTrigger className={cn(props.className)}>
                <span className="mr-2 font-bold">Type:</span>
                <SelectValue placeholder="Question type" />
                <span className="mr-2"></span>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={"MULTIPLE_CHOICE"}>
                    Multiple choice
                </SelectItem>
                <SelectItem value={"MATCHING_PAIRS"}>Matching pairs</SelectItem>
                <SelectItem disabled value={"DEBUG_CODE"}>
                    Code debugging <span className="text-sm">(soon)</span>
                </SelectItem>
                <SelectItem disabled value={"CODE_COMPLETION"}>
                    Code completion <span className="text-sm">(soon)</span>
                </SelectItem>
            </SelectContent>
        </Select>
    )
}
