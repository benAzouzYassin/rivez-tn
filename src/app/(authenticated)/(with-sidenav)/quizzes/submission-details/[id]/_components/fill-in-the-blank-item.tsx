import { Button } from "@/components/ui/button"
import { cn } from "@/lib/ui-utils"

interface OptionProps {
    text: string
    isCorrect?: boolean
    isInCorrect?: boolean
}

export default function FillInTheBlankItem(props: OptionProps) {
    return (
        <div className="relative py-2 group">
            <Button
                variant={"secondary"}
                className={cn(
                    "min-h-[50px] active:translate-y-0 active:shadow-[0px_4px_0px_0px] active:shadow-[#E5E5E5] dark:active:shadow-neutral-800 font-semibold touch-none shadow-[0px_3px_0px_0px] py-3 transition-none duration-200 text-base text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700 hover:shadow-neutral-200 dark:hover:shadow-neutral-800 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 shadow-neutral-200 dark:shadow-neutral-800",
                    {
                        "hover:bg-[#D2FFCC] bg-[#D2FFCC] text-[#58A700] font-extrabold hover:shadow-[#58CC02]/50 shadow-[#58CC02]/50 hover:border-[#58CC02]/40 border-[#58CC02]/40 dark:bg-green-900/40 dark:hover:bg-green-900/60 dark:text-green-300 dark:shadow-green-700/50 dark:hover:shadow-green-400/50 dark:border-green-700/40 dark:hover:border-green-400/40":
                            props.isCorrect,
                        "hover:bg-red-200/50 bg-red-200/50 text-red-500 font-extrabold hover:shadow-red-300 shadow-red-300 hover:border-red-300 border-red-300 dark:bg-red-900/40 dark:hover:bg-red-900/60 dark:text-red-300 dark:shadow-red-700/50 dark:hover:shadow-red-400/50 dark:border-red-700/40 dark:hover:border-red-400/40":
                            props.isInCorrect,
                    }
                )}
            >
                <p className="max-w-[400px] min-w-[20px] font-bold text-nowrap">
                    {props.text}
                </p>
            </Button>
        </div>
    )
}
