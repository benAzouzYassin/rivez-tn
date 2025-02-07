import { EditableContent } from "@/components/ui/editable-content"
import { cn } from "@/lib/ui-utils"
import { useMemo, useState } from "react"

export function QuestionText() {
    const [isTyping, setIsTyping] = useState(false)
    const placeholder = useMemo(() => "Write your question...", [])
    const [content, setContent] = useState(placeholder)
    return (
        <div className=" w-fit">
            <EditableContent
                onFocus={() => setIsTyping(true)}
                onBlur={() => setIsTyping(false)}
                onContentChange={setContent}
                content={content}
                placeholder={placeholder}
                className={cn(
                    "font-extrabold focus-within:outline-none text-3xl",
                    {
                        "text-neutral-400 ":
                            content === placeholder && !isTyping,
                        "text-neutral-800 ":
                            content !== placeholder || isTyping,
                    }
                )}
            />
            <hr className="h-1 mt-1 w-full min-w-96 rounded-md bg-neutral-300" />
        </div>
    )
}
