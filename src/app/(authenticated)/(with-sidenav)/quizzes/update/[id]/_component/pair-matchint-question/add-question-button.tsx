import { cn } from "@/lib/ui-utils"
import { PlusCircle } from "lucide-react"
import { ButtonHTMLAttributes } from "react"
type Props = ButtonHTMLAttributes<any>

export default function AddOptionButton({ className, ...props }: Props) {
    return (
        <button
            {...props}
            className={cn(
                "bg-white border-dashed text-stone-300 hover:bg-blue-300/20 hover:cursor-pointer hover:border-stone-300 hover:text-blue-300 border-[3px] border-neutral-300",
                "dark:bg-neutral-900/70 dark:text-neutral-500 dark:border-neutral-700 dark:hover:bg-blue-400/10 dark:hover:text-blue-400 dark:hover:border-blue-400",
                "justify-center active:scale-95 shadow-none h-20 flex items-center pl-6 shadow-[#E5E5E5] dark:shadow-none rounded-2xl transition-colors",
                "relative group transform transition-all duration-300 ease-in-out",
                className
            )}
        >
            <PlusCircle className="w-10 h-10" />
        </button>
    )
}
