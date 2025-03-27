import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { anthropic } from "@ai-sdk/anthropic"

const openRouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY ?? "",
    baseURL: process.env.OPENROUTER_ENDPOINT,
})

// export const cheapModel = openRouter("openai/gpt-4o-mini-search-preview")
export const cheapModel = anthropic("claude-3-5-haiku-20241022")
// export const cheapModel = openRouter(
//     "mistralai/mistral-small-24b-instruct-2501"
// )
