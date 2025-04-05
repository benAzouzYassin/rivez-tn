"use client"

import {
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
    useReactFlow,
} from "@xyflow/react"
import { cn } from "@/lib/ui-utils"
import { useSidenav } from "@/providers/sidenav-provider"
import "@xyflow/react/dist/style.css"
import CustomNode from "../_components/custom-node"

import { Button } from "@/components/ui/button"
import WarningDialog from "@/components/ui/warning-dialog"
import { TGeneratedMindmap } from "@/data-access/mindmaps/constants"
import { createMindMap } from "@/data-access/mindmaps/create"
import {
    generateMindMapFromImages,
    generateMindMapFromPDF,
    generateMindMapFromText,
    generateMindMapFromYoutube,
} from "@/data-access/mindmaps/generate"
import { useCurrentUser } from "@/hooks/use-current-user"
import {
    dismissToasts,
    toastError,
    toastLoading,
    toastSuccess,
} from "@/lib/toasts"
import { useQueryClient } from "@tanstack/react-query"
import { EditIcon, Loader2, SaveIcon, Trash2Icon } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"
import { parseAsBoolean, parseAsString, useQueryState } from "nuqs"
import { useEffect, useRef, useState } from "react"
import { convertItemsToNodes } from "../_utils/convert-to-nodes"
import EditMindmapDialog from "./_components/edit-dialog"
import { uploadFlowImage } from "../_utils/upload-flow-image"
import { wait } from "@/utils/wait"
import { ErrorDisplay } from "@/components/shared/error-display"
import { handleMindMapRefund } from "@/data-access/mindmaps/handle-refund"
import { CHEAP_TYPES } from "./constants"
import { useRefetchUser } from "@/hooks/use-refetch-user"
import { mindmapsContentDb } from "../_utils/indexed-db"

export default function Page() {
    const queryClient = useQueryClient()
    const refetchUser = useRefetchUser()

    const router = useRouter()
    const [isStreaming, setIsStreaming] = useState(false)
    const [imageUrl, setImageUrl] = useState("")
    const [shouldUploadImage, setShouldUploadImage] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [aiResult, setAiResult] = useState<TGeneratedMindmap>()
    const { isSidenavOpen } = useSidenav()
    const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[])
    const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[])
    const [isCanceling, setIsCanceling] = useState(false)
    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [topic] = useQueryState("topic", parseAsString)
    const [language] = useQueryState("language", parseAsString)
    const [additionalInstructions] = useQueryState(
        "additionalInstructions",
        parseAsString
    )
    const [shouldGenerate, setShouldGenerate] = useQueryState(
        "shouldGenerate",
        parseAsBoolean.withDefault(false)
    )
    const [contentType] = useQueryState("contentType")
    const [pdfPagesLocalId] = useQueryState("pdfPagesLocalId")
    const [imagesInBase64Id] = useQueryState("imagesInBase64Id")
    const [youtubeUrl] = useQueryState("youtubeUrl")
    useEffect(() => {
        if (!shouldGenerate) return
        if (!contentType) return setIsError(true)
        if (shouldGenerate === true) {
            let didGenerate = false
            setShouldGenerate(false)
            setIsLoading(true)
            setIsStreaming(true)
            toastLoading("Generating your mindmap")
            const onChange = (data: TGeneratedMindmap) => {
                didGenerate = true
                setAiResult(data)
                try {
                    const [nodes, edges] = convertItemsToNodes(
                        data.items.map((item) => {
                            const loadingSubitemsCount =
                                item.subItemsCount -
                                (item.subItems?.length || 0)
                            const loadingSubItems =
                                loadingSubitemsCount > 0
                                    ? Array.from({
                                          length: loadingSubitemsCount,
                                      }).map((_) => {
                                          return {
                                              language: language,
                                              isLoading: true,
                                              description: "",
                                              id: crypto.randomUUID(),
                                              title: "",
                                              subItems: [],
                                              markdownContent: "",
                                              enableSheet: false,
                                              enableDelete: true,
                                          }
                                      })
                                    : []
                            return {
                                language: language || undefined,
                                isLoading: false,
                                description: item.description,
                                id: item.id,
                                title: item.title,
                                subItems: [
                                    ...(item.subItems?.map((subItem) => ({
                                        ...subItem,
                                        enableSheet: false,
                                        enableDelete: true,
                                    })) || []),
                                    ...loadingSubItems,
                                ],
                                markdownContent: "",
                                enableSheet: false,
                                enableDelete: true,
                            }
                        }),
                        null
                    )
                    if (nodes.length) {
                        setIsLoading(false)
                        setNodes(nodes)
                    }
                    if (edges) setEdges(edges)
                } catch {}
            }

            const onStreamEnd = () => {
                dismissToasts("loading")
                setIsLoading(false)
                setIsStreaming(false)
                setNodes((prev) =>
                    prev.filter((node) => node.data.isLoading !== true)
                )
                if (!didGenerate) {
                    setIsError(true)
                    toastError("Something went wrong")
                    handleMindMapRefund({
                        generationType: CHEAP_TYPES.includes(contentType)
                            ? "CHEAP"
                            : "NORMAL",
                    }).catch(console.error)
                } else {
                    toastSuccess("Generated successfully.")
                    refetchUser()
                    wait(10).then(() => {
                        setShouldUploadImage(true)
                    })
                }
            }
            if (contentType === "subject") {
                if (!topic) return setIsError(true)
                generateMindMapFromText(
                    {
                        topic,
                        language,
                        additionalInstructions,
                    },
                    onChange,
                    onStreamEnd
                ).catch((err) => {
                    dismissToasts("loading")
                    toastError("Something went wrong")
                    setIsLoading(false)
                    setIsError(true)
                    handleMindMapRefund({
                        generationType: CHEAP_TYPES.includes(contentType)
                            ? "CHEAP"
                            : "NORMAL",
                    }).catch(() => console.error)
                })
            } else if (contentType === "document") {
                mindmapsContentDb.content
                    .where("id")
                    .equals(Number(pdfPagesLocalId))
                    .toArray()
                    .then((result) => {
                        mindmapsContentDb.content.delete(
                            Number(pdfPagesLocalId)
                        )
                        const pdfPages = result[0].pdfPages
                        if (pdfPages.length < 1) {
                            setIsError(true)
                            console.error("Pdf pages length should be >= 1 ")
                            return
                        }
                        generateMindMapFromPDF(
                            {
                                pdfPages,
                                language,
                                additionalInstructions,
                            },
                            onChange,
                            onStreamEnd
                        ).catch((err) => {
                            dismissToasts("loading")
                            toastError("Something went wrong")
                            setIsLoading(false)
                            setIsError(true)
                            handleMindMapRefund({
                                generationType: CHEAP_TYPES.includes(
                                    contentType
                                )
                                    ? "CHEAP"
                                    : "NORMAL",
                            }).catch(() => console.error)
                        })
                    })
            } else if (contentType === "image") {
                mindmapsContentDb.content
                    .where("id")
                    .equals(Number(imagesInBase64Id))
                    .toArray()
                    .then((result) => {
                        mindmapsContentDb.content.delete(
                            Number(imagesInBase64Id)
                        )
                        const imagesInBase64 = result[0].imagesInBase64
                        if (imagesInBase64.length < 1) {
                            setIsError(true)
                            console.error("images length should be >= 1 ")
                            return
                        }
                        generateMindMapFromImages(
                            {
                                imagesBase64: imagesInBase64,
                                language,
                                additionalInstructions,
                            },
                            onChange,
                            onStreamEnd
                        ).catch((err) => {
                            dismissToasts("loading")
                            toastError("Something went wrong")
                            setIsLoading(false)
                            setIsError(true)
                            handleMindMapRefund({
                                generationType: CHEAP_TYPES.includes(
                                    contentType
                                )
                                    ? "CHEAP"
                                    : "NORMAL",
                            }).catch(() => console.error)
                        })
                    })
            }

            if (contentType === "youtube") {
                if (!youtubeUrl) {
                    setIsError(true)
                    return
                }
                generateMindMapFromYoutube(
                    {
                        youtubeUrl,
                        language,
                        additionalInstructions,
                    },
                    onChange,
                    onStreamEnd
                ).catch((err) => {
                    dismissToasts("loading")
                    toastError("Something went wrong")
                    setIsLoading(false)
                    setIsError(true)
                    handleMindMapRefund({
                        generationType: CHEAP_TYPES.includes(contentType)
                            ? "CHEAP"
                            : "NORMAL",
                    }).catch(() => console.error)
                })
            } else {
                console.log("content type is not valid")
                setIsError(true)
            }
        }
    }, [
        topic,
        language,
        additionalInstructions,
        shouldGenerate,
        setShouldGenerate,
        contentType,
        setNodes,
        setEdges,
        nodes,
        refetchUser,
        pdfPagesLocalId,
        imagesInBase64Id,
        youtubeUrl,
    ])
    const { data: userData } = useCurrentUser()
    const handleSave = () => {
        setIsSaving(true)

        createMindMap({
            author_id: userData?.id,
            edges: edges as any,
            nodes: nodes.map((item) => ({
                ...item,
                data: {
                    ...item.data,
                    enableSheet: true,
                    enableDelete: false,
                    language: item.data.language,
                },
            })) as any,
            name: aiResult?.items?.[0].title,
            image: imageUrl,
            language: language,
        })
            .then(() => {
                toastSuccess("Added successfully.")
                queryClient.invalidateQueries({
                    predicate: (q) => q.queryKey.includes("mindmaps"),
                })
                router.back()
            })
            .catch((err) => {
                toastError("Something went wrong.")
            })
            .finally(() => setIsSaving(false))
    }
    if (isError) {
        return <ErrorDisplay />
    }
    return (
        <section>
            <div
                className={cn(
                    "h-[92vh] -mt-2 border border-gray-300 relative isolate",
                    {
                        "w-[calc(100vw-306px)]": isSidenavOpen,
                        "w-[calc(100vw-100px)]": !isSidenavOpen,
                    }
                )}
            >
                <div className="w-full h-20 p-3 gap-2 border-b absolute bg-white z-10 flex items-center justify-end top-0">
                    <EditMindmapDialog
                        setAiResult={setAiResult}
                        isOpen={isEditing}
                        mindMap={aiResult}
                        setEdges={setEdges}
                        setNodes={setNodes}
                        onOpenChange={setIsEditing}
                        contentType={contentType}
                    />
                    <WarningDialog
                        isOpen={isCanceling}
                        onOpenChange={setIsCanceling}
                        confirmText="Remove the mindmap"
                        onConfirm={async () => {
                            router.back()
                        }}
                    >
                        <Button className="font-bold" variant={"red"}>
                            <Trash2Icon />
                            Delete
                        </Button>
                    </WarningDialog>

                    <Button
                        disabled={isLoading || isStreaming}
                        onClick={() => setIsEditing(true)}
                        className="font-bold"
                        variant={"blue"}
                    >
                        <EditIcon />
                        Modify
                    </Button>
                    <Button
                        disabled={isLoading || isStreaming}
                        isLoading={isSaving}
                        onClick={handleSave}
                        className="font-bold"
                    >
                        <SaveIcon />
                        Save Mindmap
                    </Button>
                </div>
                <ReactFlow
                    onNodesDelete={(nodes) => {
                        const deletedIds = nodes.map((n) => n.data.id)
                        setAiResult((prev) => {
                            if (prev) {
                                return {
                                    ...prev,
                                    items: prev.items.filter(
                                        (item) => !deletedIds.includes(item.id)
                                    ),
                                }
                            }
                            return prev
                        })
                    }}
                    nodeTypes={nodeTypes}
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    fitView
                >
                    {isLoading && (
                        <Loader2 className="w-10 h-10 absolute text-blue-400 animate-spin duration-300 top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2  " />
                    )}
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
                    <ImageUploader
                        shouldUpload={shouldUploadImage}
                        onUpload={(url) => {
                            setImageUrl(url)
                            setShouldUploadImage(false)
                        }}
                    />
                </ReactFlow>
            </div>
        </section>
    )
}
const nodeTypes = {
    customNode: CustomNode,
}

const ImageUploader = ({
    shouldUpload,
    onUpload,
}: {
    shouldUpload: boolean
    onUpload: (url: string) => void
}) => {
    const didUpload = useRef(false)
    const { getNodes } = useReactFlow()
    useEffect(() => {
        if (shouldUpload && didUpload.current === false) {
            wait(200).then(() => {
                uploadFlowImage(getNodes()).then(onUpload)
                didUpload.current = true
            })
        }
    }, [getNodes, onUpload, shouldUpload])
    return null
}
