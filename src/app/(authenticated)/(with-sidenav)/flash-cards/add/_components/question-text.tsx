import { cn } from "@/lib/ui-utils"
interface Props {
    text: string
    className?: string
    onChange: (value: string) => void
}
export function QuestionText(props: Props) {
    return (
        <div className=" w-fit">
            <input
                value={props.text}
                onChange={(e) => {
                    props.onChange(e.target.value)
                }}
                placeholder={"Write a question ..."}
                className={cn(
                    "font-extrabold  placeholder:opacity-50 text-neutral-800 focus-within:outline-none text-3xl",
                    props.className
                )}
            />
            <hr className="h-1 mt-1 w-full min-w-96 rounded-md bg-neutral-300" />
        </div>
    )
}
