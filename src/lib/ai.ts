import { createOpenRouter } from "@openrouter/ai-sdk-provider"

const openRouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY ?? "",
    baseURL: process.env.OPENROUTER_ENDPOINT,
})

export const normalModel = openRouter("openai/gpt-4o-mini")
export const cheapModel = openRouter("openai/gpt-4.1-nano")
export const premiumModel = openRouter("openai/gpt-4.1-mini")
