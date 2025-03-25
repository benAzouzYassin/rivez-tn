import { anthropic } from "@ai-sdk/anthropic"
import { createOpenRouter } from "@openrouter/ai-sdk-provider"

const openRouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY ?? "",
    baseURL: process.env.OPENROUTER_ENDPOINT,
})

export const anthropicHaiku = anthropic("claude-3-5-haiku-latest", {})
export const gpt4Mini = openRouter("openai/gpt-4o-mini-search-preview")
