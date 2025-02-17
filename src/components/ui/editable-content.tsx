import { useCallback, useState } from "react"

type Props = {
    onContentChange?: (text: string) => void
    className?: string
    placeholder?: string
    onFocus?: () => void
    onBlur?: () => void
}

export function EditableContent({
    className,
    onFocus,
    onBlur,
    placeholder = "",
}: Props) {
    const [content, setContent] = useState("")

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newContent = e.target.value
            setContent(newContent)
        },
        []
    )

    return (
        <input
            type="text"
            value={content}
            onChange={handleChange}
            onFocus={onFocus}
            onBlur={onBlur}
            className={className}
            placeholder={placeholder}
        />
    )
}
