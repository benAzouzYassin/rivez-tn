import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { anthropic } from "@ai-sdk/anthropic"

const openRouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY ?? "",
    baseURL: process.env.OPENROUTER_ENDPOINT,
})

export const gpt4oMini = openRouter("openai/gpt-4o-mini")
export const llama4Maverick = openRouter("meta-llama/llama-4-maverick")
// export const cheapModel = anthropic("claude-3-5-haiku-20241022")
// export const cheapModel = openRouter(
//     "mistralai/mistral-small-24b-instruct-2501"
// )
