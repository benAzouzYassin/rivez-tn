import { cn } from "@/lib/ui-utils"
import { AlignJustify, LayoutGrid } from "lucide-react"

type Props = {
    mode: "cards" | "list"
    onModeChange: (mode: "cards" | "list") => void
    disabled?: boolean
}

export default function ViewModeToggle({
    disabled = false,
    mode,
    onModeChange,
}: Props) {
    return (
        <div className="grid  relative grid-cols-2 gap-[2px] rounded-[14px] border shadow-sm border-neutral-200 h-[46px] px-[6px] py-1 ">
            <button
                className={cn(
                    " bg-white border-none   text-neutral-400  relative transition-all active:scale-95 cursor-pointer  px-2 flex items-center justify-center rounded-lg",
                    {
                        " text-white": mode === "list",
                    }
                )}
                onMouseDown={() => onModeChange("list")}
                disabled={disabled}
                aria-label="List view"
            >
                <AlignJustify className={cn("h-5 z-[2] scale-125 w-5")} />
            </button>
            <button
                className={cn(
                    " bg-white border-2 border-white/0  text-neutral-400  relative transition-all active:scale-95 cursor-pointer px-2 flex items-center justify-center rounded-lg",
                    {
                        " text-white ": mode === "cards",
                    }
                )}
                onMouseDown={() => onModeChange("cards")}
                disabled={disabled}
                aria-label="Card view"
            >
                <LayoutGrid className="h-5 z-[2] scale-125 w-5" />
            </button>
            <span
                className={cn(
                    " left-[6px] top-1 transition-all bg-[#1CB0F6] h-[37px] w-[39px]   absolute   rounded-lg",
                    { "translate-x-[41.5px] ": mode === "cards" }
                )}
            ></span>
        </div>
    )
}
