"use client"

import { ErrorDisplay } from "@/components/shared/error-display"
import GeneralLoadingScreen from "@/components/shared/general-loading-screen"
import { Button } from "@/components/ui/button"
import { handleRefund } from "@/data-access/summarize/youtube-video/handle-refund"
import { summarizeYoutubeVideo } from "@/data-access/summarize/youtube-video/summarize"
import { useRefetchUser } from "@/hooks/use-refetch-user"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"
import { useQueryState } from "nuqs"
import { useEffect, useMemo, useRef, useState } from "react"
import PagesViewer from "./_components/pages-viewer"
import { useQueryClient } from "@tanstack/react-query"
import {
    dismissToasts,
    toastError,
    toastLoading,
    toastSuccess,
} from "@/lib/toasts"
import { createSummarization } from "@/data-access/summarize/create"
import { useCurrentUser } from "@/hooks/use-current-user"
import { getLanguage } from "@/utils/get-language"

export default function Page() {
    const [youtubeLink] = useQueryState("youtubeLink")
    const [language] = useQueryState("language")
    const refetchUser = useRefetchUser()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [result, setResult] = useState<TResult>({
        files: [] as any,
    })
    const [isStreaming, setIsStreaming] = useState(false)
    const didGenerate = useRef(false)

    const didSaveToDb = useRef(false)
    const queryClient = useQueryClient()
    const { data: userData } = useCurrentUser()
    const didStreamEnd = useRef(false)
    const translation = useMemo(
        () => ({
            en: {
                "Summarizing your pages": "Summarizing your pages",
                "Inserting your result to the database":
                    "Inserting your result to the database",
                "Saved your data to the databases successfully.":
                    "Saved your data to the databases successfully.",
                "couldn't save your data to the database":
                    "Couldn't save your data to the database",
                "something went wrong": "Something went wrong",
            },
            fr: {
                "Summarizing your pages": "Résumé de vos pages en cours",
                "Inserting your result to the database":
                    "Insertion de votre résultat dans la base de données",
                "Saved your data to the databases successfully.":
                    "Vos données ont été enregistrées avec succès.",
                "couldn't save your data to the database":
                    "Impossible d'enregistrer vos données dans la base de données",
                "something went wrong": "Une erreur s'est produite",
            },
            ar: {
                "Summarizing your pages": "جار تلخيص صفحاتك",
                "Inserting your result to the database":
                    "يتم إدراج النتيجة في قاعدة البيانات",
                "Saved your data to the databases successfully.":
                    "تم حفظ بياناتك في قاعدة البيانات بنجاح.",
                "couldn't save your data to the database":
                    "تعذر حفظ بياناتك في قاعدة البيانات",
                "something went wrong": "حدث خطأ ما",
            },
        }),
        []
    )

    const lang = useMemo(() => getLanguage() || "en", [])
    const t = useMemo(
        () => translation[lang] || translation["en"],
        [lang, translation]
    )
    useEffect(() => {
        const onStreamChange = (data: TResult) => {
            if (!didGenerate.current) didGenerate.current = true

            if (data.files.at(0)?.markdownPages.length) {
                setIsLoading(false)
            }

            setResult((prev) => {
                if (
                    data.files.flatMap((item) => item.markdownPages).length -
                        prev.files.flatMap((item) => item.markdownPages)
                            .length >=
                    0
                ) {
                    return data
                }
                return prev
            })
        }

        const onStreamEnd = () => {
            setIsLoading(false)
            setIsStreaming(false)
            didStreamEnd.current = true
            if (!didGenerate.current) {
                setIsError(true)
                handleRefund().catch(console.error)
            } else {
                refetchUser()
            }
        }

        if (!youtubeLink) {
            return setIsError(true)
        }
        setIsLoading(true)
        didSaveToDb.current = false
        didGenerate.current = false
        didStreamEnd.current = false
        summarizeYoutubeVideo(
            {
                language,
                youtubeLink,
            },
            onStreamChange,
            onStreamEnd
        ).catch((err) => {
            setIsError(true)
            handleRefund().catch(console.error)
            console.error(err)
        })
    }, [language, refetchUser, youtubeLink])

    useEffect(() => {
        if (
            !isLoading &&
            !isError &&
            !isStreaming &&
            result.files.length > 0 &&
            !didSaveToDb.current &&
            didStreamEnd.current === true
        ) {
            toastLoading(t["Inserting your result to the database"])
            didSaveToDb.current = true
            createSummarization({
                content: result,
                source: "youtube",
                user_id: userData?.id,
                name: result.files.map((f) => f.name).join(" "),
            })
                .then(() => {
                    dismissToasts("loading")
                    toastSuccess(
                        t["Saved your data to the databases successfully."]
                    )
                    queryClient.invalidateQueries({
                        predicate: (q) => q.queryKey.includes("summarizations"),
                    })
                })
                .catch((err) => {
                    console.error(err)
                    dismissToasts("loading")
                    toastError(t["couldn't save your data to the database"])
                })
        }
    }, [isLoading, isStreaming, result, isError, t, userData?.id, queryClient])
    if (isError) {
        return <ErrorDisplay />
    }
    if (isLoading) {
        return <GeneralLoadingScreen text={"Processing your video"} />
    }
    return (
        <section className=" relative items-center  min-h-[89vh] bg-neutral-50">
            <Button
                onClick={router.back}
                className="absolute font-bold text-neutral-500 top-4 left-4 "
                variant={"secondary"}
            >
                <ChevronLeft className="!w-5 !h-5 -mr-1 stroke-[2.5]" /> Back
            </Button>
            <div className="flex items-center  justify-center">
                {result?.files?.[0]?.markdownPages?.length >= 1 && (
                    <PagesViewer
                        isStreaming={isStreaming}
                        files={result.files.map((f) => {
                            return {
                                ...f,
                                markdownPages: f.markdownPages.map((page) =>
                                    page?.content?.join("\n")
                                ),
                            }
                        })}
                    />
                )}
            </div>
        </section>
    )
}
type TResult = Parameters<Parameters<typeof summarizeYoutubeVideo>[1]>[0]
