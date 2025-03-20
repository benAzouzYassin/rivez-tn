import { CheckCircle, SkipForward, Sparkles, SparklesIcon } from "lucide-react"

export default function ActionButtons() {
    return (
        <div className=" rounded-2xl mt-3  grid gap-4 grid-cols-3">
            <button className="h-20 flex items-center justify-center gap-2 text-xl text-neutral-600 font-bold border-2 hover:text-red-500 rounded-2xl cursor-pointer active:scale-95 transition-all hover:border-red-100 hover:bg-red-100">
                <SkipForward className="stroke-[2.5] -mt-px" />
                Skip this question
            </button>{" "}
            <button className="h-20 flex items-center justify-center gap-2 text-xl text-neutral-600 font-bold border-2 hover:text-neutral-900 rounded-2xl cursor-pointer active:scale-95 transition-all hover:border-green-200 hover:bg-green-200">
                <Sparkles className="stroke-[2.5] -mt-px" />
                Learned new thing
            </button>
            <button className="h-20 flex items-center justify-center gap-2 text-xl text-neutral-600 font-bold border-2 hover:text-neutral-900 rounded-2xl cursor-pointer active:scale-95 transition-all hover:border-blue-200 hover:bg-blue-200">
                <CheckCircle className="stroke-[2.5] -mt-px" />
                Already know this
            </button>
        </div>
    )
}
