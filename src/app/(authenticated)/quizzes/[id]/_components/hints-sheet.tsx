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
import {
    generateQuestionHint,
    insertHint,
} from "@/data-access/quizzes/generate-question-hint"
import { handleHintRefund } from "@/data-access/quizzes/handle-refund"
import { readQuizQuestionHint } from "@/data-access/quizzes/read"
import { updateHint } from "@/data-access/quizzes/update"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useRefetchUser } from "@/hooks/use-refetch-user"
import { toastError } from "@/lib/toasts"
import { cn } from "@/lib/ui-utils"
import { useQuery } from "@tanstack/react-query"
import { Lightbulb, Loader2 } from "lucide-react"
import { useEffect, useRef, useState, useMemo } from "react"
import { getLanguage } from "@/utils/get-language"
import { containsArabic } from "@/utils/is-arabic"

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
    const isStreaming = useRef<boolean>(false)
    const translation = useMemo(
        () => ({
            en: {
                Hint: "Hint",
                "Something went wrong": "Something went wrong",
            },
            ar: { Hint: "تلميح", "Something went wrong": "حدث خطأ ما" },
            fr: {
                Hint: "Indice",
                "Something went wrong": "Quelque chose a mal tourné",
            },
        }),
        []
    )

    const lang = getLanguage()
    const t = translation[lang] || translation.en

    const { isLoading, data, isFetching, refetch } = useQuery({
        queryKey: ["questions_hints", props.questionId],
        enabled: isOpen,
        queryFn: () =>
            readQuizQuestionHint({
                questionId: props.questionId,
            }),
    })

    useEffect(() => {
        if (!isFetching && !data && userData?.id && isOpen) {
            let contentToSave = ""
            setIsGenerating(true)
            let didGenerate = false
            let hintId: number | null = null
            if (isStreaming.current === false) {
                isStreaming.current = true
                insertHint({
                    questionId: props.questionId,
                    userId: userData.id,
                })
                    .then((hint) => {
                        hintId = hint[0].id
                        generateQuestionHint(
                            {
                                questionOptions: props.questionContent,
                                questionText: props.questionText,
                                hintId: hint[0].id,
                            },
                            handleStreamChange,
                            handleStreamEnd
                        ).catch(() => {
                            handleHintRefund().catch(console.error)
                        })
                    })
                    .catch(() => {
                        toastError(t["Something went wrong"])
                    })
            }
            const handleStreamChange = (chunk: string) => {
                if (!didGenerate) didGenerate = true
                setGeneratedContent((prev) => prev + chunk)
                contentToSave += chunk
                setIsGenerating(false)
            }

            const handleStreamEnd = () => {
                isStreaming.current = false
                if (!didGenerate) {
                    setIsError(true)
                    handleHintRefund().catch(console.error)
                } else {
                    refetchUser()
                    if (hintId) {
                        updateHint(hintId, {
                            content: contentToSave,
                        }).then(() => refetch())
                    }
                }
            }
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
        isFetching,
        refetch,
        t,
    ])
    const isRtl = containsArabic(props.questionText)

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <button
                    dir={isRtl ? "rtl" : "ltr"}
                    className={cn(
                        "h-10 text-center hidden bg-white hover:bg-blue-50 cursor-pointer active:scale-95 transition-all text-blue-600/80 font-bold text-lg md:flex items-center justify-center fixed ltr:rounded-l-xl  border-blue-500/70 top-44   ltr:border-r-0 rtl:left-0 ltr:right-0 w-20 gap-px border-2",
                        "dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-blue-300 dark:border-blue-400/40 dark:shadow dark:shadow-blue-900/10",
                        {
                            "rtl:rounded-r-xl": isRtl,
                        }
                    )}
                    aria-label={t.Hint}
                >
                    <Lightbulb className="w-6 h-6" />
                    {t.Hint}
                </button>
            </SheetTrigger>
            <SheetContent
                dir={isRtl ? "rtl" : "ltr"}
                side={isRtl ? "left" : "right"}
                className={cn(
                    "transition-all overflow-hidden px-2 py-0 w-96 min-w-[75vw] bg-white text-neutral-900 dark:border-white/10",
                    "dark:bg-neutral-900 dark:text-neutral-100"
                )}
            >
                {isError ? (
                    <ErrorDisplay hideButton />
                ) : (
                    <>
                        {(isLoading || isGenerating) && (
                            <div className="w-full h-[70vh] flex items-start justify-start">
                                <MarkdownShadowLoading />
                                <SheetDescription></SheetDescription>
                                <SheetTitle></SheetTitle>
                            </div>
                        )}
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
