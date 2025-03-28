"use client"
import {
    addEdge,
    Background,
    BackgroundVariant,
    Controls,
    Edge,
    MiniMap,
    Node,
    Panel,
    ReactFlow,
    useEdgesState,
    useNodesState,
} from "@xyflow/react"
import { useCallback, useEffect } from "react"

import { ErrorDisplay } from "@/components/shared/error-display"
import { readMindMapById } from "@/data-access/mindmaps/read"
import { cn } from "@/lib/ui-utils"
import { useSidenav } from "@/providers/sidenav-provider"
import { useQuery } from "@tanstack/react-query"
import "@xyflow/react/dist/style.css"
import { Loader2 } from "lucide-react"
import { useParams } from "next/navigation"
import CustomNode from "../_components/custom-node"

const nodeTypes = {
    customNode: CustomNode,
}

export default function Page() {
    const params = useParams()
    const id = Number((params.id as string) || "0")

    const { data, isFetching } = useQuery({
        queryKey: ["mindmpas", id],
        queryFn: () => readMindMapById({ id }),
    })
    const { isSidenavOpen } = useSidenav()
    const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[])
    const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[])
    useEffect(() => {
        if (data) {
            setNodes(data.nodes as any)
            setEdges(data.edges as any)
        }
    }, [data, setEdges, setNodes])
    const onConnect = useCallback(
        (params: any) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    )
    if (!id) return <ErrorDisplay />
    if (isFetching) {
        return (
            <div className="h-[92vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 stroke-[2.5] stroke-blue-400 animate-spin duration-300" />
            </div>
        )
    }
    return (
        <div
            className={cn("h-[92vh] -mt-2 border border-gray-300 relative", {
                "w-[calc(100vw-306px)]": isSidenavOpen,
                "w-[calc(100vw-100px)]": !isSidenavOpen,
            })}
        >
            <ReactFlow
                nodeTypes={nodeTypes}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            >
                <Controls className="rounded-lg -translate-y-4 border border-gray-200" />
                <Panel position="bottom-right" className="bg-transparent">
                    <div className="rounded-lg shadow-lg overflow-hidden border border-gray-200">
                        <MiniMap
                            className="!bg-white/90 -translate-y-4 dark:!bg-gray-800/90"
                            style={{ height: 110, width: 170 }}
                            pannable
                            nodeBorderRadius={2}
                            nodeStrokeWidth={2}
                            nodeComponent={(nodeProps) => {
                                const { x, y, width, height } = nodeProps
                                return (
                                    <rect
                                        x={x}
                                        y={y}
                                        width={width}
                                        height={height}
                                        rx={4}
                                        className="fill-blue-400 dark:fill-blue-500 stroke-blue-400 dark:stroke-blue-400"
                                        strokeWidth={2}
                                    />
                                )
                            }}
                            maskColor="rgba(0, 0, 0, 0.1)"
                        />
                    </div>
                </Panel>
                <Background
                    variant={BackgroundVariant.Cross}
                    gap={12}
                    size={1}
                />
            </ReactFlow>
        </div>
    )
}

export type Item = {
    id: string
    title: string
    description: string
    markdownContent: string
    subItems: Item[]
    isLoading?: boolean
}
