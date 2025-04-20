import { ErrorDisplay } from "@/components/shared/error-display"
import Markdown from "@/components/shared/markdown"
import MarkdownShadowLoading from "@/components/shared/markdown-shadow-loading"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { generateQuestionHint } from "@/data-access/quizzes/generate-question-hint"
import { handleHintRefund } from "@/data-access/quizzes/handle-refund"
import { readQuizQuestionHint } from "@/data-access/quizzes/read"
import { addHintsToQuestions } from "@/data-access/quizzes/update"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useRefetchUser } from "@/hooks/use-refetch-user"
import { cn } from "@/lib/ui-utils"
import { useQuery } from "@tanstack/react-query"
import { Lightbulb, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
interface Props {
    questionId: number
    questionText: string
    questionContent: string
}
export default function HintsSheet(props: Props) {
    const { data: userData } = useCurrentUser()
    const refetchUser = useRefetchUser()
    const [isOpen, setIsOpen] = useState(false)
    const [isError, setIsError] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedContent, setGeneratedContent] = useState("")
    const { isLoading, data } = useQuery({
        queryKey: ["questions_hints", props.questionId],
        enabled: isOpen,
        queryFn: () =>
            readQuizQuestionHint({
                questionId: props.questionId,
            }),
    })
    useEffect(() => {
        if (!isLoading && !data && userData?.id && isOpen) {
            let contentToSave = ""
            setIsGenerating(true)
            let didGenerate = false
            const handleStreamChange = (chunk: string) => {
                if (!didGenerate) didGenerate = true
                setGeneratedContent((prev) => prev + chunk)
                contentToSave += chunk
                setIsGenerating(false)
            }
            const handleStreamEnd = () => {
                if (!didGenerate) {
                    setIsError(true)
                    handleHintRefund().catch(console.error)
                } else {
                    refetchUser()
                    addHintsToQuestions(
                        [
                            {
                                author_id: userData.id,
                                content: contentToSave,
                                question_id: props.questionId,
                            },
                        ],
                        userData.id
                    )
                }
            }
            generateQuestionHint(
                {
                    questionOptions: props.questionContent,
                    questionText: props.questionText,
                },
                handleStreamChange,
                handleStreamEnd
            ).catch(() => {
                handleHintRefund().catch(console.error)
            })
        }
    }, [
        data,
        isLoading,
        props.questionContent,
        props.questionId,
        props.questionText,
        refetchUser,
        userData?.id,
        setIsGenerating,
        isOpen,
    ])
    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <button className="h-10 text-center hidden   bg-white hover:bg-blue-50 cursor-pointer active:scale-95 transition-all  text-blue-600/80 font-bold text-lg md:flex items-center justify-center fixed rounded-l-xl border-blue-500/70 top-44 border-r-0 right-0 w-20 gap-px border-2">
                    <Lightbulb className="w-6 h-6" />
                    Hint
                </button>
            </SheetTrigger>
            <SheetContent
                className={cn(
                    "transition-all overflow-hidden  px-2 py-0 w-96 min-w-[70vw]"
                )}
            >
                {isError ? (
                    <ErrorDisplay hideButton />
                ) : (
                    <>
                        {isLoading ||
                            (isGenerating && (
                                <div className="w-full h-[70vh] flex items-start justify-start">
                                    <MarkdownShadowLoading />
                                    <SheetDescription></SheetDescription>
                                    <SheetTitle></SheetTitle>
                                </div>
                            ))}
                        <ScrollArea className="px-4">
                            {!isLoading && !isGenerating && (
                                <Markdown
                                    content={data?.content || generatedContent}
                                />
                            )}

                            <SheetDescription></SheetDescription>
                            <SheetTitle></SheetTitle>
                        </ScrollArea>
                    </>
                )}
            </SheetContent>
        </Sheet>
    )
}
