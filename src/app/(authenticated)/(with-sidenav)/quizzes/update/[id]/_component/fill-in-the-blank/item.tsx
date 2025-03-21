import { Button } from "@/components/ui/button"
import { cn } from "@/lib/ui-utils"
interface OptionProps {
    text: string
    isCorrect?: boolean
    className?: string
    isInCorrect?: boolean
}

export default function Item(props: OptionProps) {
    return (
        <div className={cn("relative py-2   group", props.className)}>
            <Button
                variant={"secondary"}
                className={cn(
                    "min-h-[50px] w-full active:translate-y-0  active:shadow-[0px_4px_0px_0px] active:shadow-[#E5E5E5] font-semibold touch-none shadow-[0px_3px_0px_0px] py-3  transition-none duration-200 text-base text-neutral-700  hover:bg-neutral-100 hover:border-neutral-200 hover:shadow-neutral-200",
                    {
                        "hover:bg-[#D2FFCC] bg-[#D2FFCC] text-[#58A700] font-extrabold hover:shadow-[#58CC02]/50 shadow-[#58CC02]/50 hover:border-[#58CC02]/40 border-[#58CC02]/40":
                            props.isCorrect,
                        "hover:bg-red-200/50 bg-red-200/50 text-red-500 font-extrabold hover:shadow-red-300 shadow-red-300 hover:border-red-300 border-red-300":
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
