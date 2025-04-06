import { Handle, Position, useReactFlow } from "@xyflow/react"
import { ChevronRight, Loader2, Trash2Icon } from "lucide-react"
import { memo, useState } from "react"
import NodeSheet from "./node-sheet"

interface CustomNodeProps {
    data: {
        parentId: string
        id: string
        title: string
        description: string
        details: string
        bgColor: string
        isLoading?: boolean
        enableSheet?: boolean
        enableDelete?: boolean
        language?: string
    }
}

function CustomNode({ data }: CustomNodeProps) {
    const [open, setOpen] = useState(false)
    const { getNode, deleteElements } = useReactFlow()

    const getAllParentsTitles = (
        result: string[],
        nodeId: string
    ): string[] => {
        const current = getNode(nodeId)
        if (!current) return result

        const parentId = current.data.parentId as string | null
        const currentParent = parentId ? getNode(parentId) : null

        if (currentParent && currentParent.data) {
            return getAllParentsTitles(
                [
                    `title : ${currentParent.data?.title} ${
                        currentParent.data?.description
                            ? `description : ${currentParent.data?.description}`
                            : ""
                    }` || "",
                    ...result,
                ],
                currentParent.id
            )
        } else {
            return result
        }
    }

    return (
        <>
            <Handle
                type="target"
                className="!opacity-0"
                position={Position.Top}
            />

            <div
                onClick={() => setOpen(true)}
                style={{
                    backgroundColor: data.bgColor,
                    borderColor: data.bgColor,
                }}
                className="w-56 group  flex hover:scale-105 items-center justify-between min-h-[70px] p-2 border rounded-md transition-all duration-200 cursor-pointer"
            >
                {data.enableDelete && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation()

                            deleteElements({
                                nodes: getNode(data.id)
                                    ? [getNode(data.id) as any]
                                    : [],
                            })
                        }}
                        className="absolute group-hover:opacity-100 opacity-0  w-fit p-1 rounded-full border bg-red-100 border-red-400/50 text-red-400 -top-2 -right-2"
                    >
                        <Trash2Icon className="w-3 scale-110 h-3 stroke-[2.5]" />
                    </button>
                )}{" "}
                {data.isLoading ? (
                    <div className="flex items-center absolute top-0 left-0 w-full h-full justify-center">
                        <Loader2 className="text-neutral-400 w-5 h-5 stroke-[2.5] duration-300 animate-spin" />
                    </div>
                ) : (
                    <>
                        <div className="grow">
                            <h3 className="text-sm font-bold text-neutral-600 font-sans first-letter:uppercase">
                                {data.title}
                            </h3>
                            <p className="text-[8px] font-semibold text-neutral-500">
                                {data.description}
                            </p>
                        </div>
                        <ChevronRight className="w-4 stroke-neutral-600 stroke-[2.4] h-4" />
                    </>
                )}
            </div>
            <NodeSheet
                nodeId={data.id}
                language={data.language}
                getNodeTitles={() => [
                    ...getAllParentsTitles([], data.id),
                    data.title,
                ]}
                open={open}
                setOpen={setOpen}
            />
            <Handle
                className="!opacity-0"
                type="source"
                position={Position.Bottom}
                id="a"
            />
        </>
    )
}

export default memo(CustomNode)
