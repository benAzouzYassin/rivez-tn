import { uploadFile } from "@/utils/file-management"
import { getNodesBounds, getViewportForBounds, Node } from "@xyflow/react"
import { toPng } from "html-to-image"

export async function uploadFlowImage(nodes: Node[]) {
    const nodesBounds = getNodesBounds(nodes)
    const viewport = getViewportForBounds(nodesBounds, 1024, 768, 0.5, 2, 0)

    const objectUrl = await toPng(
        document.querySelector(".react-flow__viewport") as any,
        {
            backgroundColor: "#fff",
            width: 1024,
            height: 768,
            style: {
                width: "1024px",
                height: "768px",
                transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
            },
        }
    )
    const blob = await fetch(objectUrl).then((r) => r.blob())
    const imageUrl = await uploadFile(blob)
    return imageUrl
}
