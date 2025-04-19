import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select"
import { Database } from "@/types/database.types"

interface Props {
    selected: Database["public"]["Tables"]["quizzes"]["Row"]["difficulty"]
    setSelected: (value: Props["selected"]) => void
    className?: string
    errorMessage?: string
}
export function DifficultySelect(props: Props) {
    const possibleValues: Exclude<Props["selected"], null>[] = [
        "HARD",
        "MEDIUM",
        "NORMAL",
    ]

    return (
        <Select
            onValueChange={(value: any) => props.setSelected(value)}
            value={props.selected || undefined}
        >
            <SelectTrigger
                errorMessage={props.errorMessage}
                className={props.className}
            >
                {props.selected || (
                    <span className="text-neutral-400/80">Difficulty</span>
                )}
            </SelectTrigger>
            <SelectContent>
                {possibleValues.map((item) => (
                    <SelectItem value={item} key={item}>
                        {item}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
