import { generateText, LanguageModel } from "ai"
import { partialParseJson } from "./json"

export async function extractImagesText({
    imagesBase64,
    outputJson = false,
    aiModel,
}: {
    aiModel: LanguageModel
    outputJson?: boolean
    imagesBase64: string[]
}) {
    const result = await generateText({
        temperature: 0,
        model: aiModel,
        system: `for each image given to you extract it's text in details and without changes.
        - never speak to the user.
        - your output should strictly follow this zod schema : 
        z.array(
            z.object({
                imageText: z.string(),
            })
        )
        `,
        messages: [
            {
                role: "user",
                content: [
                    ...imagesBase64.map((imgBase64) => {
                        return {
                            type: "image",
                            image: `data:image/jpeg;base64,${imgBase64}`,
                        }
                    }),
                ] as any,
            },
        ],
    })
    let extractedText = result.text
    if (outputJson) {
        if (extractedText.startsWith("```json")) {
            extractedText = extractedText.slice(7)
        }
        if (extractedText.endsWith("```")) {
            extractedText = extractedText.slice(0, -3)
        }
    }
    return outputJson ? partialParseJson(extractedText) : extractedText
}
