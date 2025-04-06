import { JSONContent } from "@tiptap/react"

export function convertTiptapToMarkdown(content: JSONContent): string {
    if (!content || !content.content) {
        return ""
    }

    return processContent(content)
}

function processContent(node: JSONContent): string {
    if (!node || !node.content) {
        return ""
    }

    return node.content.map(processNode).join("")
}

function processNode(node: JSONContent): string {
    if (!node || !node.type) {
        return ""
    }

    switch (node.type) {
        case "doc":
            return processContent(node)

        case "paragraph":
            return `${processContent(node)}\n\n`

        case "heading":
            const level = node.attrs?.level || 1
            const headingMarks = "#".repeat(level)
            return `${headingMarks} ${processContent(node)}\n\n`

        case "text":
            let textContent = node.text || ""

            if (node.marks && node.marks.length > 0) {
                for (const mark of node.marks) {
                    switch (mark.type) {
                        case "bold":
                            textContent = `**${textContent}**`
                            break
                        case "italic":
                            textContent = `*${textContent}*`
                            break
                        case "strike":
                            textContent = `~~${textContent}~~`
                            break
                        case "underline":
                            textContent = `<u>${textContent}</u>`
                            break
                        case "code":
                            textContent = `\`${textContent}\``
                            break
                        case "link":
                            textContent = `[${textContent}](${
                                mark.attrs?.href || ""
                            })`
                            break
                        case "textStyle":
                            if (mark.attrs?.color) {
                                textContent = `<span style="color: ${mark.attrs.color}">${textContent}</span>`
                            }
                            break
                    }
                }
            }

            return textContent

        case "bulletList":
            return `${processContent(node)}\n`

        case "orderedList":
            return `${processContent(node)}\n`

        case "listItem":
            // For list items, we need to add a prefix
            let listItemContent = processContent(node).trim()

            // Handle nested content
            listItemContent = listItemContent.replace(/\n/g, "\n  ")

            const isOrdered = node.parent?.type === "orderedList"
            const prefix = isOrdered ? "1. " : "- "

            return `${prefix}${listItemContent}\n`

        case "blockquote":
            // Add > prefix to each line
            let quotedContent = processContent(node).trim()
            quotedContent = quotedContent.replace(/^/gm, "> ")
            return `${quotedContent}\n\n`

        case "codeBlock":
            const language = node.attrs?.language || ""
            const codeContent = node.content
                ? node.content.map((n) => n.text).join("\n")
                : ""
            return "```" + language + "\n" + codeContent + "\n```\n\n"

        case "image":
            const alt = node.attrs?.alt || ""
            const src = node.attrs?.src || ""
            let imageMarkdown = `![${alt}](${src})`

            if (node.attrs?.width || node.attrs?.height || node.attrs?.style) {
                const style = node.attrs?.style || ""
                const width = node.attrs?.width
                const height = node.attrs?.height
                imageMarkdown = `<img src="${src}" style="${style}" alt="${alt}" ${
                    width ? `width="${width}"` : ""
                } ${height ? `height="${height}"` : ""} />`
            }

            return imageMarkdown + "\n\n"

        case "hardBreak":
            return "\n"

        case "horizontalRule":
            return "---\n\n"

        case "table":
            return processTableNode(node)

        case "tableRow":
        case "tableCell":
        case "tableHeader":
            return ""

        default:
            return node.content ? processContent(node) : ""
    }
}

function processTableNode(tableNode: JSONContent): string {
    if (!tableNode.content) {
        return ""
    }

    const result = [] as any
    let headerRow: string[] = []
    let hasHeader = false

    if (
        tableNode.content.length > 0 &&
        tableNode.content[0].type === "tableRow"
    ) {
        const firstRow = tableNode.content[0]
        if (firstRow.content) {
            hasHeader = firstRow.content.some(
                (cell) => cell.type === "tableHeader"
            )

            if (hasHeader && firstRow.content) {
                headerRow = firstRow.content.map((cell) => {
                    return cell.content ? processContent(cell).trim() : ""
                })
            }
        }
    }

    for (const row of tableNode.content) {
        if (row.type !== "tableRow" || !row.content) continue

        const cells = row.content.map((cell) => {
            return cell.content ? processContent(cell).trim() : ""
        })

        result.push(`| ${cells.join(" | ")} |`)

        if (hasHeader && result.length === 1) {
            result.push(`| ${cells.map(() => "---").join(" | ")} |`)
        }
    }

    return result.join("\n") + "\n\n"
}
