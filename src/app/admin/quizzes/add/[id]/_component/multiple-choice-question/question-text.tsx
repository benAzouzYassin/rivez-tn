import { EditableContent } from "@/components/ui/editable-content"
import { cn } from "@/lib/ui-utils"
import { useState } from "react"

interface Props {
    text: string
    onTextChange: (text: string) => void
}
export function QuestionText(props: Props) {
    const [isTyping, setIsTyping] = useState(false)

    return (
        <div className=" w-fit">
            <EditableContent
                onFocus={() => setIsTyping(true)}
                onBlur={() => setIsTyping(false)}
                onContentChange={props.onTextChange}
                placeholder={"Write your question..."}
                className={cn(
                    "font-extrabold focus-within:outline-none text-3xl",
                    {
                        "text-neutral-400 ": !isTyping,
                        "text-neutral-800 ":
                            (props.text &&
                                props.text !== "Write your question...") ||
                            isTyping,
                    }
                )}
            />
            <hr className="h-1 mt-1 w-full min-w-96 rounded-md bg-neutral-300" />
        </div>
    )
}
