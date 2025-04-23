import { cn } from "@/lib/ui-utils"
import { PlusCircle } from "lucide-react"
import { ButtonHTMLAttributes } from "react"
type Props = ButtonHTMLAttributes<any>

export default function AddOptionButton({ className, ...props }: Props) {
    return (
        <button
            {...props}
            className={cn(
                "bg-white  border-dashed text-stone-300 hover:bg-blue-300/20 hover:cursor-pointer hover:border-stone-300 hover:text-blue-300 border-[3px] border-neutral-300 justify-center active:scale-95 shadow-none h-20 flex items-center pl-6 shadow-[#E5E5E5] rounded-2xl transition-colors",
                "relative group transform transition-all duration-300 ease-in-out",
                className
            )}
        >
            <PlusCircle className="w-10 h-10" />
        </button>
    )
}
