"use client"

import { Button } from "@/components/ui/button"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { ArrowLeft, ChevronDown, Sparkles } from "lucide-react"
import { Controller } from "react-hook-form"

import { POSSIBLE_QUESTIONS } from "@/app/api/quiz/generate-quiz/constants"
import { ErrorDisplay } from "@/components/shared/error-display"
import GeneralLoadingScreen from "@/components/shared/general-loading-screen"
import SearchSelectMultiple from "@/components/ui/search-select-multiple"
import { Textarea } from "@/components/ui/textarea"
import { createQuiz } from "@/data-access/quizzes/create"
import { useIsSmallScreen } from "@/hooks/is-small-screen"
import { useCurrentUser } from "@/hooks/use-current-user"
import { toastError, toastSuccess } from "@/lib/toasts"
import { useSidenav } from "@/providers/sidenav-provider"
import { getLanguage } from "@/utils/get-language"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "nextjs-toploader/app"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useQuestionsStore as useViewOnlyQuizStore } from "../../../../quizzes/[id]/store"
import { default as useEditableQuizStore } from "../[id]/store"
import { DifficultySelect } from "../_components/difficulty-select"
import { useTheme } from "next-themes"

const POSSIBLE_QUESTIONS_TYPES = Object.keys(POSSIBLE_QUESTIONS)

const getQuestionName = (
    questionType: keyof typeof POSSIBLE_QUESTIONS,
    lang: "en" | "fr" | "ar"
) => {
    const name = POSSIBLE_QUESTIONS[questionType]?.localizedNames?.[lang]
    return name || ""
}

export type FormValues = {
    category: string | null
    name: string
    mainTopic: string
    language: string | null
    maxQuestions: number | null
    minQuestions: number | null
    pdfName: string | null
    notes: string | null
    allowedQuestions?: string[] | null
    difficulty: string | null
}

export default function SubjectForm() {
    const { theme } = useTheme()
    const isDark = theme === "dark"
    const translation = useMemo(
        () => ({
            en: {
                generateFromSubject: "Generate from subject",
                goBack: "Go back",
                quizName: "Quiz Name",
                subject: "Subject",
                maxQuestions: "Max questions",
                minQuestions: "Min questions",
                advancedOptions: "Advanced options",
                notesPlaceholder: "Any notes for the ai...",
                allowedQuestions: "Allowed questions",
                generateQuiz: "Generate Quiz",
                generatingQuiz: "Generating your quiz",
                error: "Something went wrong...",
            },
            fr: {
                generateFromSubject: "Générer à partir d'un sujet",
                goBack: "Retourner",
                quizName: "Nom du quiz",
                subject: "Sujet",
                maxQuestions: "Questions max",
                minQuestions: "Questions min",
                advancedOptions: "Options avancées",
                notesPlaceholder: "Des notes pour l'IA...",
                allowedQuestions: "Questions autorisées",
                generateQuiz: "Générer le quiz",
                generatingQuiz: "Génération de votre quiz",
                error: "Une erreur s'est produite...",
            },
            ar: {
                generateFromSubject: "إنشاء من موضوع",
                goBack: "عودة",
                quizName: "اسم الاختبار",
                subject: "الموضوع",
                maxQuestions: "الأسئلة القصوى",
                minQuestions: "الحد الأدنى للأسئلة",
                advancedOptions: "خيارات متقدمة",
                notesPlaceholder: "أي ملاحظات للذكاء الاصطناعي...",
                allowedQuestions: "الأسئلة المسموح بها",
                generateQuiz: "إنشاء الاختبار",
                generatingQuiz: "يتم إنشاء الاختبار",
                error: "حدث خطأ ما...",
            },
        }),
        []
    )
    const lang = getLanguage()
    const t = translation[lang]

    const isSmallScreen = useIsSmallScreen()
    const sideNav = useSidenav()
    const queryClient = useQueryClient()
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [isUploadingImage, setIsUploadingImage] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const user = useCurrentUser()
    const router = useRouter()
    const addToEditQuizWithAi = useEditableQuizStore(
        (s) => s.generateQuizWithAi
    )
    const addToTakeQuizWithAi = useViewOnlyQuizStore(
        (s) => s.generateQuizWithAi
    )
    const isGeneratingToTakeQuiz = useViewOnlyQuizStore(
        (s) => s.isGeneratingWithAi
    )
    const isToTakeQuizError = useViewOnlyQuizStore((s) => s.isAiError)
    const resetViewOnlyQuizStore = useViewOnlyQuizStore((s) => s.reset)
    const resetEditableQuizStore = useEditableQuizStore((s) => s.reset)

    useEffect(() => {
        resetViewOnlyQuizStore()
        resetEditableQuizStore()
    }, [resetViewOnlyQuizStore, resetEditableQuizStore])

    const formSchema = useMemo(
        () =>
            z.object({
                allowedQuestions: z
                    .array(
                        z.string().refine((arg) => {
                            return POSSIBLE_QUESTIONS_TYPES.includes(arg)
                        })
                    )
                    .optional()
                    .nullable(),
                notes: z.string().nullable(),
                name: z
                    .string()
                    .min(1, "Name is required")
                    .max(100, "Input exceeds maximum length"),
                mainTopic: z
                    .string()
                    .min(1, "The quiz subject is required")
                    .max(100, "Input exceeds maximum length"),
                category: z.string().nullable().optional(),
                language: z.string().nullable().optional(),
                difficulty: z.string().nullable().optional(),
                maxQuestions: z.coerce.number().max(999).nullable().optional(),
                minQuestions: z.coerce
                    .number()
                    .max(Number(process.env.NEXT_PUBLIC_MAX_QUESTION_PER_QUIZ!))
                    .nullable()
                    .optional(),
            }),
        []
    )
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            notes: "",
            category: "",
            language: null,
            mainTopic: "",
            maxQuestions: null,
            minQuestions: null,
            allowedQuestions: null,
        },
    })

    const onSubmit = async (
        data: FormValues,
        type: "generate-and-take" | "generate-and-modify"
    ) => {
        try {
            setIsLoading(true)
            const result = await createQuiz({
                name: data.name,
                category: data.category ? Number(data.category) : null,
                image: imageUrl,
                description: "",
                author_id: user.data?.id,
                difficulty: (data.difficulty as any) || "NORMAL",
            })
            const quizId = result[0].id
            if (type === "generate-and-modify") {
                if (sideNav.isSidenavOpen) {
                    sideNav.toggleSidenav()
                }
                router.push(`/quizzes/add/${quizId}?isGeneratingWithAi=true`)
                addToEditQuizWithAi({ ...data, quizId }, "subject", () => {
                    queryClient.refetchQueries({
                        predicate: (query) =>
                            query.queryKey.includes("current-user"),
                    })
                })
            }

            if (type === "generate-and-take") {
                addToTakeQuizWithAi({ ...data, quizId }, "subject", () => {
                    toastSuccess("Quiz generated successfully")
                    router.push(`/quizzes/${quizId}?isGeneratingWithAi=true`)
                    queryClient.refetchQueries({
                        predicate: (query) =>
                            query.queryKey.includes("current-user"),
                    })
                })
            }

            setImageUrl(null)
        } catch (error) {
            toastError("Something wrong happened.")
            console.error(error)
            setIsLoading(false)
        }
    }

    if (isGeneratingToTakeQuiz) {
        return <GeneralLoadingScreen text={t.generatingQuiz} />
    }
    if (isToTakeQuizError) {
        return <ErrorDisplay message={t.error} />
    }
    return (
        <main className="flex relative items-center pb-20 flex-col bg-white dark:bg-neutral-900 transition-colors min-h-screen">
            <h1 className="md:mt-10 mt-24 text-neutral-600 dark:text-neutral-200 text-3xl font-extrabold">
                {t.generateFromSubject}
            </h1>
            <div className="flex items-center h-0">
                <Button
                    onClick={router.back}
                    className="absolute font-bold text-neutral-500 dark:text-neutral-400 top-2 left-2 md:top-4 md:left-4 px-6"
                    variant={"secondary"}
                >
                    <ArrowLeft className="!w-5 !h-5 scale-125 -mr-1 stroke-[2.5]" />
                </Button>
            </div>
            <section className="flex md:px-0 px-3 flex-col w-full mt-8 gap-1 max-w-[900px]">
                <Input
                    {...form.register("name")}
                    placeholder={t.quizName}
                    className="w-full bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700"
                    errorMessage={form.formState.errors.name?.message}
                />
                <Input
                    {...form.register("mainTopic")}
                    placeholder={t.subject}
                    className="w-full bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700"
                    errorMessage={form.formState.errors.mainTopic?.message}
                />
                <div className="grid md:grid-cols-2 md:gap-8">
                    <Input
                        {...form.register("maxQuestions")}
                        placeholder={t.maxQuestions}
                        className="w-full bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700"
                        type="number"
                        defaultValue={undefined}
                        errorMessage={
                            form.formState.errors.maxQuestions?.message
                        }
                    />
                    <Input
                        {...form.register("minQuestions")}
                        placeholder={t.minQuestions}
                        className="w-full bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700"
                        type="number"
                        defaultValue={undefined}
                        errorMessage={
                            form.formState.errors.minQuestions?.message
                        }
                    />
                </div>
                <Collapsible className="group">
                    <CollapsibleTrigger className="w-full data-[state=open]:font-bold data-[state=open]:text-neutral-500 dark:data-[state=open]:text-neutral-300 data-[state=open]:bg-blue-300/80 dark:data-[state=open]:bg-blue-900/40 data-[state=open]:border-transparent mb-4 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex justify-between items-center rounded-xl transition-all duration-200 bg-[#F7F7F7]/50 dark:bg-neutral-800 font-medium border-2 p-3 h-12 border-[#E5E5E5] dark:border-neutral-700 text-[#AFAFAF] dark:text-neutral-400 cursor-pointer">
                        <span className="underline underline-offset-4">
                            {t.advancedOptions}
                        </span>
                        <ChevronDown className="group-data-[state=open]:rotate-180 transition-transform duration-500" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="bg-white dark:bg-neutral-800 mt-2 border-neutral-200 dark:border-neutral-700">
                        <div className=" -translate-y-7 p-2 border-blue-300/80 dark:border-blue-900/40 border-b-[6px] border-x-[3px] rounded-b-2xl">
                            <div className="mt-5">
                                <Textarea
                                    {...form.register("notes")}
                                    placeholder={t.notesPlaceholder}
                                    className="w-full bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700"
                                    errorMessage={
                                        form.formState.errors.notes?.message
                                    }
                                />
                            </div>
                            <div className="-mt-1 gap-8"></div>
                            <div className="-mt-1 gap-8">
                                <div className="pb-3">
                                    <Controller
                                        control={form.control}
                                        name="allowedQuestions"
                                        render={({
                                            field: { onChange, value, onBlur },
                                        }) => (
                                            <SearchSelectMultiple
                                                items={POSSIBLE_QUESTIONS_TYPES.filter(
                                                    (q) =>
                                                        q !==
                                                        "FILL_IN_THE_BLANK"
                                                ).map((questionType) => {
                                                    return {
                                                        id: questionType,
                                                        label: getQuestionName(
                                                            questionType as any,
                                                            lang
                                                        ),
                                                    }
                                                })}
                                                placeholder={t.allowedQuestions}
                                                inputClassName="w-full mb-2 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700"
                                                onSelect={onChange}
                                                onUnselect={(unselectedId) => {
                                                    onChange(
                                                        value?.filter(
                                                            (questionType) =>
                                                                questionType !==
                                                                unselectedId
                                                        )
                                                    )
                                                }}
                                                selectedIds={value || []}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 md:gap-8"></div>
                            <div className="col-span-2">
                                <Controller
                                    control={form.control}
                                    name="difficulty"
                                    render={({
                                        field: { onChange, value, onBlur },
                                    }) => (
                                        <DifficultySelect
                                            selected={value as any}
                                            setSelected={onChange}
                                            className="col-span-2"
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
                <div className="grid gap-5">
                    <Button
                        variant={isDark ? "blue" : "default"}
                        isLoading={isLoading}
                        disabled={isUploadingImage}
                        type="button"
                        onClick={() => {
                            form.handleSubmit((data) =>
                                onSubmit(
                                    data,
                                    isSmallScreen
                                        ? "generate-and-take"
                                        : "generate-and-modify"
                                )
                            )()
                        }}
                        className="font-extrabold uppercase py-7 mt-5 text-sm dark:text-white dark:!border-blue-900"
                    >
                        {t.generateQuiz} <Sparkles className="!w-5 !h-5" />
                    </Button>
                </div>
            </section>
        </main>
    )
}
