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
        - if an image is empty return this string : "empty".
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
export function imageBitmapToBase64(
    imageBitmap: ImageBitmap,
    canvas: HTMLCanvasElement,
    quality = 0.8
): string | null {
    try {
        canvas.width = imageBitmap.width
        canvas.height = imageBitmap.height

        const ctx = canvas.getContext("2d", { alpha: true })
        if (!ctx) {
            throw new Error("Could not get 2D context from canvas.")
        }

        ctx.drawImage(imageBitmap, 0, 0)

        const dataUrl = canvas.toDataURL("image/webp", quality)
        if (!dataUrl.startsWith("data:image/webp;base64,")) {
            return null
        }

        const base64 = dataUrl.split(",")[1]

        imageBitmap.close()

        return base64
    } catch (error) {
        imageBitmap.close()
        return null
    }
}
