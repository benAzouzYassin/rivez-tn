import { cn } from "@/lib/ui-utils"
import { memo } from "react"

interface Props {
    text: string
    onChange: (value: string) => void
    className?: string
}

function OptionText(props: Props) {
    return (
        <input
            onChange={(e) => props.onChange(e.target.value)}
            value={props?.text || ""}
            placeholder={"........"}
            className={cn(
                "font-extrabold dark:text-neutral-100 focus-within:outline-none text-xl",
                props.className
            )}
        />
    )
}

export default memo(OptionText)
