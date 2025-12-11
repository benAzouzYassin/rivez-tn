import { createOpenRouter } from "@openrouter/ai-sdk-provider"

const openRouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY ?? "",
    baseURL: process.env.OPENROUTER_ENDPOINT,
})

export const normalModel = openRouter("openai/gpt-5-mini")
export const cheapModel = openRouter("openai/gpt-5-nano")
export const premiumModel = openRouter("openai/gpt-5-mini")
