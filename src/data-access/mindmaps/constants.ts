import { z } from "zod"

export const GeneratedMindmapSchema = z.object({
    itemsCount: z.number(),
    items: z.array(
        z.object({
            title: z.string(),
            id: z.string(),
            description: z.string(),
            subItemsCount: z.number(),
            subItems: z.array(z.any()).optional().nullable(),
        })
    ),
})
export type TGeneratedMindmap = z.infer<typeof GeneratedMindmapSchema>
