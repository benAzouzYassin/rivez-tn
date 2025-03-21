import { parseJSON } from "partial-json"

// we use this function instead of the library in case we needed to change the behavior
export function partialParseJson(str: string) {
    return parseJSON(str)
}

export function cleanJsonStream(chunk: string) {
    // TODO implement this (will be used with models that generate markdown strictly)
    return chunk
}
