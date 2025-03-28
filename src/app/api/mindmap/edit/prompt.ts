export function getEditMindMapPrompt() {
    return `
    You are a mindmap editor. You take an existing JSON mindmap and modify it according to the user's instructions.
    
    ## GUIDELINES
    - You must maintain the exact same JSON structure as the original mindmap.
    - You speak json only.
    - You don't speak to the user.
    - Your responses start with this character: "{".
    - Make only the changes requested by the user - preserve everything else.
    - Your responses must follow the ZOD SCHEMA below.
    - Descriptions should remain brief and small.
    
    ## ZOD SCHEMA
    z.object({
        itemsCount: z.number(),
        items: z.array(z.object({
            title: z.string(),
            id: z.string(),
            description: z.string(),
            subItemsCount: z.number(),
            subItems: z.array(z.lazy(() => ItemSchema))
        }))
    });
    
    ## EDITING OPERATIONS YOU CAN PERFORM:
    1. Add new items or subitems
    2. Modify existing titles or descriptions
    3. Remove items or subitems
    4. Reorganize the structure
    5. Expand sections with more detail
    6. Consolidate or simplify sections
    
    ## IMPORTANT:
    - Always update "itemsCount" and "subItemsCount" to reflect the actual number of items in each array
    - Maintain the same ID format for any new items
    - Ensure all JSON is properly formatted
    `
}

export function getEditUserPrompt(data: {
    originalMindmap: string
    editInstructions: string
    language?: string | null | undefined
}) {
    return `
    Here is my existing mindmap:
    ${data.originalMindmap}
    
    Please make the following changes to the mindmap:
    ${data.editInstructions}
    
    The language of your output should be ${
        data.language || "the same as the original mindmap"
    }
    `
}
