import { cn } from "@/lib/ui-utils"
import useQuizStore from "../store"
interface Props {
    localId: string
    text: string
    className?: string
}
export function QuestionText(props: Props) {
    const updateQuestion = useQuizStore((s) => s.updateQuestion)
    return (
        <div className=" w-fit">
            <input
                value={props.text}
                onChange={(e) => {
                    updateQuestion(
                        { questionText: e.target.value },
                        props.localId
                    )
                }}
                placeholder={"Write your question..."}
                className={cn(
                    "font-extrabold placeholder:opacity-50 text-neutral-800 focus-within:outline-none text-3xl",
                    props.className
                )}
            />
            <hr className="h-1 mt-1 w-full min-w-96 rounded-md bg-neutral-300" />
        </div>
    )
}
