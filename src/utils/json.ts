import { parseJSON } from "partial-json"

// We use this function instead of the library in case we need to change the behavior
export function partialParseJson(str: string) {
    if (str.startsWith("```json")) {
        str = str.slice(7)
    }
    return parseJSON(str)
}
