"use client"

import { ErrorDisplay } from "@/components/shared/error-display"
import GeneralLoadingScreen from "@/components/shared/general-loading-screen"
import InsufficientCreditsDialog from "@/components/shared/insufficient-credits-dialog"
import { lowPrice } from "@/constants/prices"
import { handleRefund } from "@/data-access/documents/handle-refund"
import { summarizeMultiplePage } from "@/data-access/documents/summarize"
import { readCurrentUser } from "@/data-access/users/read"
import { useRefetchUser } from "@/hooks/use-refetch-user"
import {
    dismissToasts,
    toastError,
    toastLoading,
    toastSuccess,
} from "@/lib/toasts"
import { useSearchParams } from "next/navigation"
import { useRouter } from "nextjs-toploader/app"
import { useEffect, useRef, useState, useMemo } from "react"
import { usePdfSummarizerStore } from "../store"
import PagesViewer from "./_components/pages-viewer"
import { createSummarization } from "@/data-access/summarize/create"
import { useCurrentUser } from "@/hooks/use-current-user"
import { getLanguage } from "@/utils/get-language"
import { useQueryClient } from "@tanstack/react-query"

export default function Page() {
    const { data: userData } = useCurrentUser()
    const [isInsufficientCredits, setIsInsufficientCredits] = useState(false)
    const refetchUser = useRefetchUser()
    const searchParams = useSearchParams()
    const startedGenerating = useRef(false)
    const [isStreaming, setIsStreaming] = useState(false)
    const [isError, setIsError] = useState(false)
    const [result, setResult] = useState<TResult>({ files: [] })
    const [isLoading, setIsLoading] = useState(false)
    const getSelectedPages = usePdfSummarizerStore((s) => s.getSelectedPages)
    const router = useRouter()
    const didSaveToDb = useRef(false)
    const queryClient = useQueryClient()

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
        if (startedGenerating.current === true) return
        const data = getSelectedPages()
        const price = (lowPrice / 5) * data.length
        setIsLoading(true)
        readCurrentUser()
            .then((currentUser) => {
                if (Number(currentUser?.data.credit_balance) < price) {
                    setIsLoading(false)
                    return setIsInsufficientCredits(true)
                }

                startedGenerating.current = true
                setIsStreaming(true)

                if (data.length < 1) {
                    setIsError(true)
                    setIsLoading(false)
                    return
                }

                let didGenerate = false
                const onResultChange = (data: TResult) => {
                    if (!didGenerate) didGenerate = true
                    if (data.files.at(0)?.markdownPages.length) {
                        setIsLoading(false)
                    }

                    setResult((prev) => {
                        if (
                            data.files.flatMap((item) => item.markdownPages)
                                .length -
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

                    if (!didGenerate) {
                        setIsError(true)
                        handleRefund().catch(console.error)
                    } else {
                        refetchUser()
                    }
                }
                didSaveToDb.current = false
                summarizeMultiplePage(
                    {
                        files: getSelectedPages().map((file) => ({
                            ...file,
                            pages: file.pages.map((p) => {
                                return {
                                    textContent: p.textContent,
                                    imageInBase64: p.imageInBase64,
                                }
                            }),
                        })),
                        language: lang,
                    },
                    onResultChange,
                    onStreamEnd
                ).catch((err) => {
                    setIsError(true)
                    handleRefund().catch(console.error)
                    console.error(err)
                })
            })
            .catch((err) => {
                setIsLoading(false)
                console.error(err)
                toastError(t["something went wrong"])
            })
    }, [getSelectedPages, refetchUser, searchParams, t, lang])

    useEffect(() => {
        if (
            !isLoading &&
            !isError &&
            !isStreaming &&
            result.files.length > 0 &&
            !didSaveToDb.current
        ) {
            toastLoading(t["Inserting your result to the database"])
            didSaveToDb.current = true
            createSummarization({
                content: result,
                source: "pdf",
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
        return <GeneralLoadingScreen text={t["Summarizing your pages"]} />
    }
    return (
        <section className="">
            {result.files?.[0]?.markdownPages?.length >= 1 && (
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
            <InsufficientCreditsDialog
                isOpen={isInsufficientCredits}
                onOpenChange={(value) => {
                    if (value === false) {
                        router.back()
                    }
                    setIsInsufficientCredits(value)
                }}
            />
        </section>
    )
}

type TResult = Parameters<Parameters<typeof summarizeMultiplePage>[1]>[0]
