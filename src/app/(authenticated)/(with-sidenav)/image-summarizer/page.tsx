"use client"

import { ErrorDisplay } from "@/components/shared/error-display"
import GeneralLoadingScreen from "@/components/shared/general-loading-screen"
import { Button } from "@/components/ui/button"
import { createSummarization } from "@/data-access/summarize/create"
import { handleRefund } from "@/data-access/summarize/images/handle-refund"
import { summarizeImages } from "@/data-access/summarize/images/summarize"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useRefetchUser } from "@/hooks/use-refetch-user"
import {
    dismissToasts,
    toastError,
    toastLoading,
    toastSuccess,
} from "@/lib/toasts"
import { getLanguage } from "@/utils/get-language"
import { useQueryClient } from "@tanstack/react-query"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"
import { useMemo, useRef, useState } from "react"
import ImageUpload from "./_components/image-upload"
import PagesViewer from "./_components/pages-viewer"

export default function Page() {
    const refetchUser = useRefetchUser()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [result, setResult] = useState<TResult>({
        files: [] as any,
    })
    const [isStreaming, setIsStreaming] = useState(false)
    const didGenerate = useRef(false)
    const queryClient = useQueryClient()
    const { data: userData } = useCurrentUser()
    const dataToSaveInDb = useRef<TResult>(null)

    const translation = useMemo(
        () => ({
            en: {
                "Processing your images": "Processing your images",
                "Inserting your result to the database":
                    "Inserting your result to the database",
                "Saved your data to the databases successfully.":
                    "Saved your data to the databases successfully.",
                "couldn't save your data to the database":
                    "Couldn't save your data to the database",
                Back: "Back",
            },
            fr: {
                "Processing your images": "Traitement de vos images",
                "Inserting your result to the database":
                    "Insertion de votre résultat dans la base de données",
                "Saved your data to the databases successfully.":
                    "Vos données ont été enregistrées avec succès.",
                "couldn't save your data to the database":
                    "Impossible d'enregistrer vos données dans la base de données",
                Back: "Retour",
            },
            ar: {
                "Processing your images": "جار معالجة صورك",
                "Inserting your result to the database":
                    "يتم إدراج النتيجة في قاعدة البيانات",
                "Saved your data to the databases successfully.":
                    "تم حفظ بياناتك في قاعدة البيانات بنجاح.",
                "couldn't save your data to the database":
                    "تعذر حفظ بياناتك في قاعدة البيانات",
                Back: "عودة",
            },
        }),
        []
    )

    const lang = getLanguage()
    const t = translation[lang]

    const handleSummarize = (data: { images: File[]; language: string }) => {
        setIsLoading(true)
        didGenerate.current = false
        summarizeImages(data, onStreamChange, onStreamEnd).catch((err) => {
            setIsError(true)
            handleRefund().catch(console.error)
            console.error(err)
        })
    }

    const onStreamChange = (data: TResult) => {
        if (!didGenerate.current) didGenerate.current = true

        if (data.files.at(0)?.markdownPages.length) {
            setIsLoading(false)
        }
        if (data) {
            dataToSaveInDb.current = data
        }
        setResult((prev) => {
            if (
                data.files.flatMap((item) => item.markdownPages).length -
                    prev.files.flatMap((item) => item.markdownPages).length >=
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

        if (!didGenerate.current) {
            setIsError(true)
            handleRefund().catch(console.error)
        } else {
            console.log("result is ", result)

            toastLoading(t["Inserting your result to the database"])
            createSummarization({
                content: dataToSaveInDb.current,
                source: "image",
                user_id: userData?.id,
                name: dataToSaveInDb.current?.files
                    .map((f) => f.name)
                    .join(" "),
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
                .finally(() => {
                    refetchUser()
                })
        }
    }

    if (isError) {
        return <ErrorDisplay />
    }
    if (isLoading) {
        return <GeneralLoadingScreen text={t["Processing your images"]} />
    }
    return (
        <section className="relative items-center dark:bg-neutral-900 min-h-[89vh] bg-neutral-50">
            <Button
                onClick={router.back}
                className="absolute font-bold text-neutral-500 top-2 left-2 md:top-4 md:left-4 px-6"
                variant={"secondary"}
            >
                <ArrowLeft className="!w-5 !h-5 scale-125 -mr-1 stroke-[2.5]" />{" "}
                {t["Back"]}
            </Button>
            <div className="flex items-center justify-center">
                {result?.files?.[0]?.markdownPages?.length >= 1 ? (
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
                ) : (
                    <ImageUpload handleSummarize={handleSummarize} />
                )}
            </div>
        </section>
    )
}

type TResult = Parameters<Parameters<typeof summarizeImages>[1]>[0]
