import { Edge, Node } from "@xyflow/react"
import { Item } from "../page"

export function convertItemsToNodes(
    items: Item[],
    parentId: string | null,
    depth: number = 0,
    horizontalIndex: number = 0
): [Node[], Edge[], number] {
    const edges = [] as Edge[]
    const nodes = [] as Node[]

    let currentIndex = horizontalIndex

    for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const itemId = crypto.randomUUID()
        const node = {
            id: itemId,
            position: parentId
                ? {
                      x: currentIndex * 255 + item.subItems.length * 50,
                      y: depth * 200,
                  }
                : { x: item.subItems.length * 140, y: 0 },
            type: "customNode",
            data: {
                bgColor: getNodeColor(depth, i), // Use a more complex pattern based on depth and index
                title: item.title,
                description: item.description,
                details: item.content,
            },
        }
        nodes.push(node)

        const edge = parentId
            ? { id: crypto.randomUUID(), source: parentId, target: itemId }
            : null
        if (edge) edges.push(edge)

        let subtreeWidth = 0
        if (item.subItems.length) {
            const [subNodes, subEdges, widthUsed] = convertItemsToNodes(
                item.subItems,
                itemId,
                depth + 1,
                currentIndex
            )
            nodes.push(...subNodes)
            edges.push(...subEdges)
            subtreeWidth = widthUsed - currentIndex
        }

        currentIndex += Math.max(1, subtreeWidth)
    }

    return [nodes, edges, currentIndex]
}

function getNodeColor(depth: number, index: number) {
    const possibleColors = [
        "#FFD6A7",
        "#FFF085",
        "#B9F8CF",
        "#96F7E4",
        "#8EC5FF",
        "#E9D4FF",
        "#FCCEE8",
        "#E2E8F0",
        "#FF99C8",
        "#A2DFF7",
        "#E1FFD7",
        "#F4A5C2",
        "#C5FF9F",
        "#FFEC8C",
        "#D3F0F7",
        "#FF9EC3",
        "#A8D2FF",
        "#A0FFC9",
        "#C9F5D5",
        "#F1D0D6",
        "#B8D7F6",
        "#D1A1FF",
    ]

    // Calculate a unique color index using both depth and index
    const patternIndex = (depth * 31 + index * 17) % possibleColors.length
    return possibleColors[patternIndex]
}
