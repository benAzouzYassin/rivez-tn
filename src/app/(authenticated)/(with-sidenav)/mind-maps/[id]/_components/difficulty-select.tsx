"use client"

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
                difficultyPlaceholder: "Difficulty",
                HARD: "Hard",
                MEDIUM: "Medium",
                NORMAL: "Normal",
            },
            fr: {
                difficultyPlaceholder: "Difficulté",
                HARD: "Difficile",
                MEDIUM: "Moyenne",
                NORMAL: "Normale",
            },
            ar: {
                difficultyPlaceholder: "الصعوبة",
                HARD: "صعب",
                MEDIUM: "متوسط",
                NORMAL: "عادي",
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
                className={props.className}
            >
                {props.selected ? (
                    t[props.selected]
                ) : (
                    <span className="text-neutral-400/80">
                        {t.difficultyPlaceholder}
                    </span>
                )}
            </SelectTrigger>
            <SelectContent>
                {possibleValues.map((item) => (
                    <SelectItem value={item} key={item}>
                        {t[item]}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
