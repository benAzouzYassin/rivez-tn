import { z } from "zod"

export const GeneratedMindmapSchema = z.object({
    title: z.string(),
    id: z.string(),
    description: z.string(),
    markdownPages: z.array(z.string()),
    subItems: z.array(
        z.lazy(() => {
            return z.object({
                title: z.string(),
                id: z.string(),
                description: z.string(),
                markdownPages: z.array(z.string()),
                subItems: z.any(),
            })
        })
    ),
})
export type TGeneratedMindmap = z.infer<typeof GeneratedMindmapSchema>
