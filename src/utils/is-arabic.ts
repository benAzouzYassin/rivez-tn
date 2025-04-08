export function containsArabic(text: string): boolean {
    if (!text) return false

    const strippedText = stripMarkdownSyntax(text)

    if (!strippedText.trim()) return false
    const arabicRegex =
        /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/

    return arabicRegex.test(strippedText)
}

function stripMarkdownSyntax(text: string): string {
    let result = text

    // Remove code blocks
    result = result.replace(/```[\s\S]*?```/g, "")

    // Remove inline code
    result = result.replace(/`.*?`/g, "")

    // Remove headers
    result = result.replace(/^#{1,6}\s+/gm, "")

    // Remove bold/italic markers
    result = result.replace(/(\*\*|__)(.*?)\1/g, "$2")
    result = result.replace(/(\*|_)(.*?)\1/g, "$2")

    // Remove links
    result = result.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")

    // Remove images
    result = result.replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")

    // Remove blockquotes
    result = result.replace(/^>\s+/gm, "")

    // Remove horizontal rules
    result = result.replace(/^([-*_])\1{2,}$/gm, "")

    // Remove list markers
    result = result.replace(/^[\s]*[-+*]\s+/gm, "")
    result = result.replace(/^[\s]*\d+\.\s+/gm, "")

    return result
}
