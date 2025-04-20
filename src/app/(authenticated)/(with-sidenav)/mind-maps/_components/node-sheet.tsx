import { ErrorDisplay } from "@/components/shared/error-display"
import Markdown from "@/components/shared/markdown"
import MarkdownShadowLoading from "@/components/shared/markdown-shadow-loading"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
} from "@/components/ui/sheet"
import { createNodeExplanation } from "@/data-access/mindmaps/create"
import { explainNode } from "@/data-access/mindmaps/explain"
import { handleMindMapRefund } from "@/data-access/mindmaps/handle-refund"
import { readNodeExplanation } from "@/data-access/mindmaps/read"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useRefetchUser } from "@/hooks/use-refetch-user"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
interface Props {
    open: boolean
    setOpen: (value: boolean) => void
    getNodeTitles: () => string[]
    nodeId: string
    language?: string
}

export default function NodeSheet(props: Props) {
    const refetchUser = useRefetchUser()
    const params = useParams()
    const mindMapId = params.id as string
    const queryClient = useQueryClient()
    const { data: userData } = useCurrentUser()
    const [isError, setIsError] = useState(false)
    const [generatedContent, setGeneratedContent] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const isGenerating = useRef(false)
    const {
        isFetched,
        isError: isFetchErrored,
        data: explanationData,
    } = useQuery({
        enabled: props.open,
        queryKey: ["mindmap_node_explanation", props.nodeId],
        queryFn: () => readNodeExplanation({ nodeId: props.nodeId }),
        retry: 1,
    })
    const isFinishedStreaming = useRef(false)
    useEffect(() => {
        if (isFinishedStreaming.current === true) return
        if (isGenerating.current === true) return

        if (props.open && (isFetched || isFetchErrored)) {
            if (!explanationData?.content) {
                let contentToInsert = ""
                let didGenerate = false

                const onContentChange = (changedContent: string) => {
                    isGenerating.current = true
                    if (!didGenerate) didGenerate = true
                    try {
                        setGeneratedContent(changedContent)
                        contentToInsert = changedContent

                        if (changedContent) setIsLoading(false)
                    } catch {}
                }

                const onStreamEnd = () => {
                    isFinishedStreaming.current = true
                    isGenerating.current = false
                    if (!didGenerate) {
                        setIsError(true)
                        handleMindMapRefund({
                            generationType: "CHEAP",
                        }).catch(console.error)
                    } else {
                        refetchUser()
                        createNodeExplanation({
                            author_id: userData?.id as string,
                            content: contentToInsert,
                            mindmap_id: Number(mindMapId),
                            node_id: props.nodeId,
                        }).then(() => {
                            isFinishedStreaming.current = true
                            queryClient.invalidateQueries({
                                queryKey: [
                                    "mindmap_node_explanation",
                                    props.nodeId,
                                ],
                            })
                        })
                    }
                }
                explainNode(
                    {
                        topics: props.getNodeTitles(),
                        language: props.language,
                    },
                    onContentChange,
                    onStreamEnd
                ).catch((err) => {
                    console.error(err)
                    handleMindMapRefund({
                        generationType: "CHEAP",
                    }).catch(console.error)
                })
            } else {
                setGeneratedContent(explanationData.content)
                setIsLoading(false)
            }
        }
    }, [
        isFetched,
        props,
        isFetchErrored,
        explanationData?.content,
        userData?.id,
        mindMapId,
        queryClient,
        refetchUser,
    ])

    return (
        <Sheet open={props.open} onOpenChange={props.setOpen}>
            <SheetContent className="p-0 bg-white w-[95vw] min-w-[95vw]  lg:w-[calc(100vw-450px)] lg:min-w-[calc(100vw-450px)]">
                <div className="scale-x-[-1] overflow-y-auto">
                    <div className="h-full scale-x-[-1]">
                        {isError && <ErrorDisplay />}
                        {!isError && (
                            <>
                                {isLoading ? (
                                    <div className="h-[100vh] flex items-start justify-start ">
                                        <MarkdownShadowLoading />{" "}
                                    </div>
                                ) : (
                                    <>
                                        <div className="md:p-5 p-2">
                                            <Markdown
                                                content={generatedContent}
                                            />
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                        <SheetTitle className="text-xl font-medium text-neutral-800"></SheetTitle>
                        <SheetDescription></SheetDescription>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
