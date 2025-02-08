import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/ui-utils"
import { PossibleQuestionTypesEnum } from "@/schemas/questions-content"

interface Props {
    className?: string
}

export default function QuestionTypeSelect(props: Props) {
    return (
        <Select>
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
