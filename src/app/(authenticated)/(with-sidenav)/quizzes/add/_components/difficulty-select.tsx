import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select"
import { Database } from "@/types/database.types"
import { useMemo } from "react"
import { getLanguage } from "@/utils/get-language"

interface Props {
    selected: Database["public"]["Tables"]["quizzes"]["Row"]["difficulty"]
    setSelected: (value: Props["selected"]) => void
    className?: string
    errorMessage?: string
}
export function DifficultySelect(props: Props) {
    const translation = useMemo(
        () => ({
            en: {
                Difficulty: "Difficulty",
                HARD: "Hard",
                MEDIUM: "Medium",
                NORMAL: "Easy",
            },
            fr: {
                Difficulty: "Difficulté",
                HARD: "Difficile",
                MEDIUM: "Moyen",
                NORMAL: "Facile",
            },
            ar: {
                Difficulty: "الصعوبة",
                HARD: "صعب",
                MEDIUM: "متوسط",
                NORMAL: "سهل",
            },
        }),
        []
    )

    const lang = getLanguage()
    const t = translation[lang]

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
                className={[
                    "bg-white dark:bg-neutral-800",
                    "text-neutral-700 dark:text-neutral-200",
                    "border border-neutral-200 dark:border-neutral-700",
                    "hover:bg-neutral-100 dark:hover:bg-neutral-700",
                    props.className,
                ].join(" ")}
            >
                {props.selected ? (
                    t[props.selected]
                ) : (
                    <span className="text-neutral-400/80 dark:text-neutral-400">
                        {t["Difficulty"]}
                    </span>
                )}
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                {possibleValues.map((item) => (
                    <SelectItem
                        value={item}
                        key={item}
                        className="text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    >
                        {t[item]}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
