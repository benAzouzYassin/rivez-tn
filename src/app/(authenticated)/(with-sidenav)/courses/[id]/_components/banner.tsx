import { cn } from "@/lib/ui-utils"

type Props = {
    variant: "sky" | "green" | "purple" | "yellow" | "orange" | "emerald"
    title: string
    content: string
}
export default function Banner(props: Props) {
    const variants = {
        sky: "bg-sky-500/80 opacity-90 shadow-sky-500  border-sky-500 ",
        green: "bg-green-500/80 opacity-90 shadow-green-500  border-green-500 ",
        purple: "bg-purple-500/80 opacity-90 shadow-purple-500  border-purple-500 ",
        yellow: "bg-yellow-500/80 opacity-90 shadow-yellow-500  border-yellow-500 ",
        orange: "bg-orange-500/80 opacity-90 shadow-orange-500  border-orange-500 ",
        emerald:
            "bg-emerald-500/80 opacity-90 shadow-emerald-500  border-emerald-500 ",
    }
    return (
        <div
            className={cn(
                "px-5 py-3 flex h-28 rounded-3xl    w-full  shadow-[0px_8px_0px_0px]  border-t-4 border-x-4 ",
                variants[props.variant]
            )}
        >
            <div className="w-20 bg-white rounded-xl h-20 flex items-center justify-center shadow-sm"></div>
            <div className="ml-4 flex flex-col justify-center">
                <p className="text-lg font-black text-white/80">
                    {props.title}
                </p>
                <p className="text-3xl font-extrabold mt-2 text-white">
                    {props.content}
                </p>
            </div>
        </div>
    )
}
