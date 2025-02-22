"use client"

import { toastError } from "@/lib/toasts"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import AiQuizBasicInfo from "./ai-quiz-basic-info"
import AiQuizDialogTabs from "./ai-quiz-dialog-tabs"
import AiQuizOtherInfo from "./ai-quiz-other-info"

export type FormValues = {
    category: string | null
    name: string
    mainTopic: string
    language: string | null
    maxQuestions: number | null
    minQuestions: number | null
    description: string | null
    pdfName: string | null
}

type Props = {
    onBackClick: () => void
}

export default function AiQuizDialogContent(props: Props) {
    const [currentTab, setCurrentTab] =
        useState<(typeof TABS)[number]>("Basic information")
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [pdfUrl, setPdfUrl] = useState<string | null>(null)
    const [isUploadingImage, setIsUploadingImage] = useState(false)
    const [isUploadingPdf, setIsUploadingPdf] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const formSchema = useMemo(
        () =>
            z.object({
                name: z
                    .string()
                    .min(1, "Name is required")
                    .max(100, "Input exceeds maximum length"),
                mainTopic: z
                    .string()
                    .min(1, "Main topic is required")
                    .max(100, "Input exceeds maximum length"),
                category: z.string().nullable(),
                language: z.string().nullable(),
                description: z.string().nullable(),
                maxQuestions: z.coerce.number().max(999).nullable(),
                minQuestions: z.coerce.number().max(20).nullable(),
                pdfName: z.string().nullable(),
            }),
        []
    )
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            category: "",
            language: null,
            mainTopic: "",
            maxQuestions: null,
            minQuestions: null,
        },
    })

    const onSubmit = async (data: FormValues) => {
        try {
            setIsLoading(true)
            setIsLoading(true)
            console.log(data)
            // router.push(`/admin/quizzes/add/${quizId}`)
            // form.reset()
            setImageUrl(null)
        } catch (error) {
            toastError("Something wrong happened.")
            console.error(error)
            setIsLoading(false)
        }
    }

    return (
        <>
            <AiQuizDialogTabs
                currentTab={currentTab}
                onTabChange={setCurrentTab}
            />
            {currentTab === "Basic information" && (
                <AiQuizBasicInfo
                    form={form}
                    onBackClick={props.onBackClick}
                    onSubmit={() => {
                        setCurrentTab("Other information")
                    }}
                    imageUrl={imageUrl}
                    setImageUrl={setImageUrl}
                    isUploadingImage={isUploadingImage}
                    setIsUploadingImage={setIsUploadingImage}
                    isLoading={isLoading}
                />
            )}
            {currentTab === "Other information" && (
                <AiQuizOtherInfo
                    form={form}
                    onBackClick={props.onBackClick}
                    onSubmit={onSubmit}
                    pdfUrl={pdfUrl || null}
                    setPdfUrl={setPdfUrl}
                    setIsUploadingPdf={setIsUploadingPdf}
                    isUploadingPdf={isUploadingPdf}
                    isLoading={isLoading}
                />
            )}
        </>
    )
}

export const TABS = ["Basic information", "Other information"] as const
