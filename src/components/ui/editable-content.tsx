import { useCallback, useState } from "react"

type Props = {
    onContentChange?: (text: string) => void
    className?: string
    placeholder?: string
    onFocus?: () => void
    onBlur?: () => void
}

export function EditableContent({
    onContentChange,
    className,
    onFocus,
    onBlur,
    placeholder = "",
}: Props) {
    const [content, setContent] = useState("")

    const handleFocus = useCallback(() => {
        onFocus?.()
    }, [onFocus])

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newContent = e.target.value
            setContent(newContent)
        },
        []
    )

    const handleBlur = useCallback(() => {
        onBlur?.()
        onContentChange?.(content)
    }, [content, onBlur, onContentChange])

    return (
        <input
            type="text"
            value={content}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={className}
            placeholder={placeholder}
        />
    )
}
