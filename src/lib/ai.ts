import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { anthropic } from "@ai-sdk/anthropic"

const openRouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY ?? "",
    baseURL: process.env.OPENROUTER_ENDPOINT,
})

export const normalModel = openRouter("openrouter/optimus-alpha")
export const premiumModel = openRouter("openrouter/optimus-alpha")
