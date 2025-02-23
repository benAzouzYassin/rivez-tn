"use client"

import { createQuiz } from "@/data-access/quizzes/create"
import { useCurrentUser } from "@/hooks/use-current-user"
import { toastError } from "@/lib/toasts"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "nextjs-toploader/app"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import useQuizStore from "../../add/[id]/store"
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
    rules: string | null
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
    const user = useCurrentUser()
    const router = useRouter()
    const generateQuizWithAi = useQuizStore((s) => s.generateQuizWithAi)
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
                category: z.string().nullable().optional(),
                language: z.string().nullable().optional(),
                rules: z.string().nullable(),
                maxQuestions: z.coerce.number().max(999).nullable().optional(),
                minQuestions: z.coerce
                    .number()
                    .max(
                        Number(process.env.NEXT_PUBLIC_MAX_QUESTION_PER_QUIZ!) -
                            1
                    )
                    .nullable()
                    .optional(),
                pdfName: z.string().nullable().optional(),
            }),
        []
    )
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            rules: "",
            category: "",
            language: null,
            mainTopic: "",
            maxQuestions: null,
            minQuestions: null,
        },
    })

    const onSubmit = async (data: FormValues) => {
        try {
            const result = await createQuiz({
                name: data.name,
                category: data.category ? Number(data.category) : null,
                image: imageUrl,
                description: "",
                author_id: user.data?.id,
            })
            const quizId = result[0].id
            router.push(`/admin/quizzes/add/${quizId}?isGeneratingWithAi=true`)
            generateQuizWithAi({ ...data, pdfUrl })

            form.reset()
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
