import { cn } from "@/lib/ui-utils"
import { Check, X } from "lucide-react"
import { memo } from "react"

interface Props {
    isCorrect: boolean | null
    onChange: (val: boolean) => void
}

function CorrectToggleButton({ isCorrect, onChange }: Props) {
    return (
        <button
            onClick={() => onChange(isCorrect !== true)}
            className={cn(
                "w-10 h-10 hover:cursor-pointer rounded-full border border-black/10 dark:border-white/10 bg-gray-100 dark:bg-neutral-800",
                {
                    "bg-green-100 dark:bg-green-900/70": isCorrect === true,
                    "bg-red-100 dark:bg-red-900/50": isCorrect === false,
                }
            )}
        >
            {isCorrect === true && (
                <Check className="mx-auto stroke-3 text-green-600" />
            )}
            {isCorrect === false && (
                <X className="mx-auto text-red-600 stroke-3" />
            )}
        </button>
    )
}

export default memo(CorrectToggleButton)
