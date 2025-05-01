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
import { useCallback, useEffect, useState, useMemo } from "react"

import { ErrorDisplay } from "@/components/shared/error-display"
import { readMindMapById } from "@/data-access/mindmaps/read"
import { cn } from "@/lib/ui-utils"
import { useSidenav } from "@/providers/sidenav-provider"
import { useQuery } from "@tanstack/react-query"
import "@xyflow/react/dist/style.css"
import { Loader2, Sparkles } from "lucide-react"
import { useParams, useSearchParams } from "next/navigation"
import CustomNode from "../_components/custom-node"
import { Button } from "@/components/ui/button"
import GenerateQuizDialog from "./_components/generate-quiz-dialog"
import { attachSharedMindmapToUser } from "@/data-access/mindmaps/share"
import { useCurrentUser } from "@/hooks/use-current-user"
import { getLanguage } from "@/utils/get-language"
import { useTheme } from "next-themes"

const nodeTypes = {
    customNode: CustomNode,
}

export default function Page() {
    const { theme } = useTheme()
    const isDark = theme === "dark"
    const { data: currentUser } = useCurrentUser()
    const searchParams = useSearchParams()
    const isSharing = searchParams.get("share") === "true"
    const [isMindmapDialogOpen, setIsMindmapsDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const params = useParams()
    const id = Number((params.id as string) || "0")
    const { data, isFetching } = useQuery({
        queryKey: ["mindmpas", id],
        queryFn: () => readMindMapById({ id }),
    })
    const { isSidenavOpen } = useSidenav()
    const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[])
    const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[])

    const translation = useMemo(
        () => ({
            en: {
                "Convert quiz": "Convert to quiz",
                Loading: "Loading...",
            },
            fr: {
                "Convert quiz": "Convertir en quiz",
                Loading: "Chargement...",
            },
            ar: {
                "Convert quiz": "تحويل إلى اختبار",
                Loading: "جار التحميل...",
            },
        }),
        []
    )

    const lang = getLanguage()
    const t = translation[lang]

    useEffect(() => {
        if (data && Array.isArray(data.nodes) && Array.isArray(data.edges)) {
            setNodes(
                data.nodes.map((n: any) => ({
                    ...(n || {}),
                    language: data.language,
                })) as any
            )
            setEdges(data.edges as any)
        }
    }, [data, setEdges, setNodes])

    useEffect(() => {
        if (isSharing && currentUser?.id) {
            setIsLoading(true)
            attachSharedMindmapToUser({ userId: currentUser.id, mindmapId: id })
                .catch((err) => {
                    console.error(err)
                })
                .finally(() => {
                    setIsLoading(false)
                })
        } else {
            setIsLoading(false)
        }
    }, [currentUser?.id, id, isSharing])

    const onConnect = useCallback(
        (params: any) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    )

    const handleGenerateQuiz = () => {
        setIsMindmapsDialogOpen(true)
    }

    if (!id) return <ErrorDisplay />
    if (isFetching || isLoading) {
        return (
            <div className="h-[92vh] flex items-center justify-center bg-white dark:bg-neutral-900 transition-colors">
                <Loader2 className="w-8 h-8 stroke-[2.5] stroke-blue-400 dark:stroke-blue-300 animate-spin duration-300" />
                <span className="sr-only">{t["Loading"]}</span>
            </div>
        )
    }
    return (
        <div
            className={cn(
                "h-[92vh] -mt-4 md:-mt-2 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 transition-colors relative",
                {
                    "lg:w-[calc(100vw-306px)] w-screen": isSidenavOpen,
                    "lg:w-[calc(100vw-100px)] w-screen": !isSidenavOpen,
                }
            )}
        >
            {data?.items && (
                <>
                    <Button
                        className="md:text-base md:flex hidden text-sm md:scale-100 scale-80 absolute md:top-5 top-2 right-0 md:right-5 z-50"
                        variant={"blue"}
                        onClick={handleGenerateQuiz}
                    >
                        {t["Convert quiz"]} <Sparkles />
                    </Button>
                    <GenerateQuizDialog
                        content={JSON.stringify(data?.items)}
                        isOpen={isMindmapDialogOpen}
                        onOpenChange={setIsMindmapsDialogOpen}
                    />
                </>
            )}
            <ReactFlow
                nodeTypes={nodeTypes}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            >
                <Controls className="rounded-lg md:!block !hidden -translate-y-4 border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 transition-colors" />
                <Panel
                    position="bottom-right"
                    className="bg-transparent md:scale-100 scale-50"
                >
                    <div className="rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 transition-colors">
                        <MiniMap
                            className="!bg-white/90 -translate-y-4 dark:!bg-neutral-800/90"
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
                    color={isDark ? "#0f0f0f" : "#f0f0f0"}
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
