import { useCallback, useEffect, useRef } from "react"

type Props = {
    content: string
    onContentChange?: (text: string) => void
    className?: string
    placeholder?: string
    onFocus?: () => void
    onBlur?: () => void
}
export function EditableContent({
    content,
    onContentChange,
    className,
    onFocus,
    onBlur,
    placeholder = "",
}: Props) {
    const contentRef = useRef<HTMLDivElement>(null)
    const isInitialMount = useRef(true)

    useEffect(() => {
        if (isInitialMount.current && contentRef.current) {
            contentRef.current.innerHTML = content
            isInitialMount.current = false
        }
    }, [content])

    const handleFocus = useCallback(() => {
        onFocus?.()
        if (contentRef.current && content === placeholder) {
            contentRef.current.innerHTML = ""
        }
    }, [content, placeholder, onFocus])

    const handleBlur = useCallback(
        (e: React.FocusEvent<HTMLDivElement>) => {
            onBlur?.()
            const sanitizedContent = e.currentTarget.innerHTML
                .replace(/<\/?[^>]+(>|$)/g, "") // Remove HTML tags
                .trim()

            // Restore placeholder if empty
            if (!sanitizedContent) {
                onContentChange?.(placeholder)
                if (contentRef.current) {
                    contentRef.current.innerHTML = placeholder
                }
            } else {
                onContentChange?.(sanitizedContent)
            }
        },
        [onContentChange, placeholder, onBlur]
    )

    // sanitize the input when pasting
    const handlePaste = useCallback(
        (e: React.ClipboardEvent<HTMLDivElement>) => {
            e.preventDefault()
            const text = e.clipboardData.getData("text/plain")
            const selection = window.getSelection()

            if (!selection || selection.rangeCount === 0) {
                if (contentRef.current) {
                    contentRef.current.innerText += text
                }
                return
            }

            const range = selection.getRangeAt(0)
            range.deleteContents()

            const textNode = document.createTextNode(text)
            range.insertNode(textNode)

            range.setStartAfter(textNode)
            range.setEndAfter(textNode)
            selection.removeAllRanges()
            selection.addRange(range)
        },
        []
    )
    return (
        <div
            ref={contentRef}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onPaste={handlePaste}
            contentEditable
            className={className}
            role="textbox"
        />
    )
}
