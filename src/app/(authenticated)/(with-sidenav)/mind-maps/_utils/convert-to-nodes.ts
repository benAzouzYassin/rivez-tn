import { Edge, Node } from "@xyflow/react"

export function convertItemsToNodes(
    items: Item[],
    parentId: string | null,
    depth: number = 0,
    horizontalIndex: number = 0,
    opts: { isDark: boolean }
): [Node[], Edge[], number] {
    const edges = [] as Edge[]
    const nodes = [] as Node[]

    let currentIndex = horizontalIndex
    const calculateWidth = (result: number, subItems: Item[]): number => {
        if (subItems.length === 0) {
            return Math.max(1, result)
        }

        let totalSubWidth = 0
        for (const subItem of subItems) {
            const subItemWidth =
                subItem.subItems.length > 0
                    ? calculateWidth(0, subItem.subItems)
                    : 1
            totalSubWidth += subItemWidth
        }

        return Math.max(result, totalSubWidth)
    }

    for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const itemId = crypto.randomUUID()
        const node = {
            id: itemId,
            position: parentId
                ? {
                      x: currentIndex * 255 + item.subItems.length * 70,
                      y: depth * 200,
                  }
                : { x: calculateWidth(0, item.subItems) * 120, y: 0 },
            type: "customNode",
            data: {
                id: itemId,
                bgColor: getNodeColor(depth, i),
                title: item.title,
                description: item.description,
                details: item.markdownContent,
                isLoading: item.isLoading,
                enableSheet: item.enableSheet,
                enableDelete: item.enableDelete,
                parentId,
            },
        }
        nodes.push(node)

        const edge = parentId
            ? {
                  id: crypto.randomUUID(),
                  source: parentId,
                  target: itemId,
              }
            : null
        if (edge) edges.push(edge)

        let subtreeWidth = 0
        if (item.subItems.length) {
            const [subNodes, subEdges, widthUsed] = convertItemsToNodes(
                item.subItems,
                itemId,
                depth + 1,
                currentIndex,
                opts
            )
            nodes.push(...subNodes)
            edges.push(...subEdges)
            subtreeWidth = widthUsed - currentIndex
        }

        currentIndex += Math.max(1, subtreeWidth)
    }
    return [nodes, edges, currentIndex]
}

function getNodeColor(depth: number, index: number, isDark?: boolean) {
    const lightColors = [
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
    const darkColors = [
        "#FF9800",
        "#FFD600",
        "#00E676",
        "#00B8D9",
        "#5E35B1",
        "#7C4DFF",
        "#F50057",
        "#FF1744",
        "#1DE9B6",
        "#FFFFFF",
        "#FF4081",
        "#651FFF",
        "#FF6F00",
        "#D84315",
        "#2979FF",
        "#3D5AFE",
        "#FF3D00",
        "#D500F9",
    ]
    const possibleColors = isDark ? darkColors : lightColors
    const patternIndex = (depth * 31 + index * 17) % possibleColors.length
    return possibleColors[patternIndex]
}

export type Item = {
    id: string
    title: string
    description: string
    markdownContent: string
    subItems: Item[]
    isLoading?: boolean
    enableDelete: boolean
    enableSheet: boolean
    language?: string
}
