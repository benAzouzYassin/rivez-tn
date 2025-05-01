"use client"

import { Save } from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { TGeneratedMindmap } from "@/data-access/mindmaps/constants"
import { generateEditedVersion } from "@/data-access/mindmaps/generate-edited-version"
import {
    dismissToasts,
    toastError,
    toastLoading,
    toastSuccess,
} from "@/lib/toasts"
import { Edge, Node } from "@xyflow/react"
import { useQueryState } from "nuqs"
import { useRef, useState } from "react"
import { convertItemsToNodes } from "../../_utils/convert-to-nodes"
import { CHEAP_TYPES } from "../constants"
import { handleMindMapRefund } from "@/data-access/mindmaps/handle-refund"
import { useRefetchUser } from "@/hooks/use-refetch-user"
import { Badge } from "@/components/ui/badge"
import { lowPrice } from "@/constants/prices"
import CreditIcon from "@/components/icons/credit-icon"
import { useTheme } from "next-themes"

interface Props {
    setNodes: (nodes: Node[]) => void
    setEdges: (nodes: Edge[]) => void
    isOpen: boolean
    mindMap: TGeneratedMindmap | undefined
    onOpenChange: (value: boolean) => void
    setAiResult: (data: TGeneratedMindmap) => void
    contentType: string | null
}
export default function EditMindmapDialog(props: Props) {
    const { theme } = useTheme()
    const isDark = theme === "dark"
    const refetchUser = useRefetchUser()
    const [editInstructions, setEditInstructions] = useState("")
    const [language, setLanguage] = useQueryState("language")
    const newGeneratedResult = useRef<TGeneratedMindmap>(null)
    const handleSubmit = () => {
        let didGenerate = false
        toastLoading("Modifying your mindmap")
        props.onOpenChange(false)
        const onChange = (data: TGeneratedMindmap) => {
            didGenerate = true
            newGeneratedResult.current = data
            try {
                const [nodes, edges] = convertItemsToNodes(
                    data.items.map((item) => {
                        const loadingSubitemsCount =
                            item.subItemsCount - (item.subItems?.length || 0)
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
                                          enableDelete: false,
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
                                })) || []),
                                ...loadingSubItems,
                            ],
                            markdownContent: "",
                            enableSheet: false,
                            enableDelete: true,
                        }
                    }),
                    null,
                    undefined,
                    undefined,
                    {
                        isDark,
                    }
                )
                if (nodes.length) {
                    props.setNodes(
                        nodes.map((node) => ({
                            ...node,
                            data: { ...node.data, enableDelete: true },
                        }))
                    )
                }
                if (edges.length) props.setEdges(edges)
            } catch {}
        }

        const onStreamEnd = () => {
            dismissToasts("loading")

            if (!didGenerate || !newGeneratedResult.current) {
                toastError("Something went wrong")
                handleFallBack()
                handleMindMapRefund({
                    generationType: CHEAP_TYPES.includes(
                        props.contentType as any
                    )
                        ? "CHEAP"
                        : "NORMAL",
                }).catch(console.error)
            } else {
                props.setAiResult(newGeneratedResult.current)

                toastSuccess("Modified successfully.")
                refetchUser()
            }
        }
        generateEditedVersion(
            {
                editInstructions,
                language: language,
                originalMindmap: JSON.stringify(props.mindMap || {}),
            },
            onChange,
            onStreamEnd
        ).catch((err) => {
            dismissToasts("loading")
            toastError("Something went wrong")
            handleMindMapRefund({
                generationType: CHEAP_TYPES.includes(props.contentType as any)
                    ? "CHEAP"
                    : "NORMAL",
            }).catch(console.error)
        })
    }
    const handleFallBack = () => {
        if (!props.mindMap) return
        const [nodes, edges] = convertItemsToNodes(
            props.mindMap.items.map((item) => {
                const loadingSubitemsCount =
                    item.subItemsCount - (item.subItems?.length || 0)
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
                                  enableDelete: false,
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
                        })) || []),
                        ...loadingSubItems,
                    ],
                    markdownContent: "",
                    enableSheet: false,
                    enableDelete: true,
                }
            }),
            null,
            undefined,
            undefined,
            {
                isDark,
            }
        )
        props.setNodes(nodes)
        props.setEdges(edges)
    }
    return (
        <Dialog open={props.isOpen} onOpenChange={props.onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-neutral-700">
                        Modify mindmap with ai{" "}
                        <Badge
                            variant={"blue"}
                            className="scale-80 -ml-1 py-0 px-2 font-bold inline-flex gap-[3px]  !text-lg"
                        >
                            {lowPrice} <CreditIcon className="!w-5 !h-5" />
                        </Badge>
                    </DialogTitle>
                    <DialogDescription className="text-neutral-500">
                        Describe the changes you want to make to your existing
                        mindmap.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleSubmit()
                    }}
                    className="mt-4 space-y-4"
                >
                    <div>
                        <label
                            htmlFor="instructions"
                            className="font-medium text-neutral-600 block mb-1"
                        >
                            Describe Your Changes
                            <span className="text-red-400 text-xl font-semibold ml-1">
                                *
                            </span>
                        </label>
                        <Textarea
                            id="instructions"
                            value={editInstructions}
                            onChange={(e) =>
                                setEditInstructions(e.target.value)
                            }
                            placeholder="Example: Change the language to ..."
                            className="h-32"
                            required
                        />
                        <p className="text-xs text-neutral-500 -mt-5 ml-1">
                            Be specific about what you want to add, remove, or
                            modify.
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor="language"
                            className="font-medium text-neutral-600 block"
                        >
                            Language
                        </label>
                        <Select
                            onValueChange={setLanguage}
                            value={language || undefined}
                        >
                            <SelectTrigger id="language" className="w-full">
                                <SelectValue placeholder="Same as original (recommended)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="english">English</SelectItem>
                                <SelectItem value="arabic">Arabic</SelectItem>
                                <SelectItem value="french">French</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-neutral-500 -mt-3 ml-1">
                            Choose a different language or keep the original.
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => props.onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant={isDark ? "blue" : "default"}
                            type="submit"
                            className="gap-1"
                            disabled={!editInstructions.trim()}
                        >
                            <Save size={16} />
                            Save Changes
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
