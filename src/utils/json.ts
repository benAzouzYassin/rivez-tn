import { parseJSON } from "partial-json"

// we use this function instead of the library in case we needed to change the behavior
export function partialParseJson(str: string) {
    console.log(str)
    return parseJSON(str)
}

export function cleanJsonStream(chunk: string) {
    if (chunk.startsWith("```json")) {
        chunk = chunk.slice(7)
    }

    if (chunk.startsWith("```jso")) {
        chunk = chunk.slice(6)
    }

    if (chunk.endsWith("```")) {
        chunk = chunk.slice(0, -3)
    }
    return chunk.trim()
}
