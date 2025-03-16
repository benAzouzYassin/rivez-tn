"use client"

import CategorySelect from "@/components/shared/category-select"
import ImageUpload from "@/components/shared/image-upload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ChevronDown, ChevronLeft, ImageIcon } from "lucide-react"
import { Controller } from "react-hook-form"

import { createQuiz } from "@/data-access/quizzes/create"
import { useCurrentUser } from "@/hooks/use-current-user"
import { toastError } from "@/lib/toasts"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "nextjs-toploader/app"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import dynamic from "next/dynamic"
import { PdfInputLoading } from "./_components/pdf-input-loading"
import { useSidenav } from "@/providers/sidenav-provider"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Textarea } from "@/components/ui/textarea"
import SearchSelectMultiple from "@/components/ui/search-select-multiple"
import { POSSIBLE_QUESTIONS } from "@/app/api/quiz/generate-quiz/constants"
import useQuizStore from "../../../add/[id]/store"
import { useQueryClient } from "@tanstack/react-query"

const POSSIBLE_QUESTIONS_TYPES = Object.keys(POSSIBLE_QUESTIONS)

const PdfInput = dynamic(() => import("./_components/pdf-input"), {
    loading: () => <PdfInputLoading />,
})

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
}

export default function Document() {
    const sideNav = useSidenav()
    const queryClient = useQueryClient()
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [pdfPages, setPdfPages] = useState<string[]>([])
    const [isUploadingImage, setIsUploadingImage] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const user = useCurrentUser()
    const router = useRouter()
    const generateQuizWithAi = useQuizStore((s) => s.generateQuizWithAi)
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
                category: z.string().nullable().optional(),
                language: z.string().nullable().optional(),
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
        },
    })

    const onSubmit = async (data: FormValues) => {
        try {
            setIsLoading(true)
            const result = await createQuiz({
                name: data.name,
                category: data.category ? Number(data.category) : null,
                image: imageUrl,
                description: "",
                author_id: user.data?.id,
            })
            const quizId = result[0].id
            if (sideNav.isSidenavOpen) {
                sideNav.toggleSidenav()
            }
            router.push(`/quizzes/add/${quizId}?isGeneratingWithAi=true`)
            generateQuizWithAi({ ...data, pdfPages, quizId }, "pdf", () => {
                // on success
                queryClient.refetchQueries({
                    predicate: (query) =>
                        query.queryKey.includes("current-user"),
                })
            })

            setImageUrl(null)
        } catch (error) {
            toastError("Something wrong happened.")
            console.error(error)
            setIsLoading(false)
        }
    }

    return (
        <main className="flex relative items-center pb-20  flex-col">
            <h1 className="mt-10 text-neutral-600 text-3xl font-extrabold">
                Generate from pdf
            </h1>
            <div className="flex items-center  h-0">
                <Button
                    onClick={() => router.back()}
                    className=" text-sm gap-1   absolute top-4 left-5"
                    variant="secondary"
                >
                    <ChevronLeft className="stroke-3 -ml-1 text-neutral-500 !w-4 !h-4" />
                    Go back
                </Button>
            </div>
            <section className="flex flex-col w-full mt-8 gap-1 max-w-[900px]">
                <Input
                    {...form.register("name")}
                    placeholder="Quiz Name"
                    className="w-full"
                    errorMessage={form.formState.errors.name?.message}
                />
                <PdfInput onPDFPagesChanges={setPdfPages} />
                <div className="grid grid-cols-2 mt-4 gap-8">
                    <Controller
                        control={form.control}
                        name="category"
                        render={({ field: { onChange, value, onBlur } }) => (
                            <CategorySelect
                                placeholder="Category"
                                enableAddButton
                                inputClassName="w-full"
                                selectedId={value}
                                errorMessage={
                                    form.formState.errors.category?.message
                                }
                                onSelect={({ id }) => {
                                    onChange(id)
                                    onBlur()
                                }}
                                onUnselect={() => {
                                    onChange(null)
                                    onBlur()
                                }}
                            />
                        )}
                    />
                    <Select
                        defaultValue={form.getValues().language || undefined}
                        onValueChange={(val) => form.setValue("language", val)}
                    >
                        <SelectTrigger className="data-[placeholder]:text-neutral-400">
                            <SelectValue placeholder="Language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="EN">English</SelectItem>
                            <SelectItem disabled value="AR">
                                Arabic{" "}
                                <span className="text-sm italic">
                                    (soon...)
                                </span>
                            </SelectItem>
                            <SelectItem disabled value="FR">
                                French{" "}
                                <span className="text-sm italic">
                                    (soon...)
                                </span>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Collapsible className="group ">
                    <CollapsibleTrigger className="w-full data-[state=open]:font-bold  data-[state=open]:text-neutral-500 data-[state=open]:bg-blue-300/80 data-[state=open]:border-transparent   mb-4 hover:bg-neutral-100 flex justify-between items-center rounded-xl transition-all duration-200 bg-[#F7F7F7]/50 font-medium border-2 p-3 h-12 border-[#E5E5E5] text-[#AFAFAF] cursor-pointer">
                        <span className="underline underline-offset-4">
                            Advanced options
                        </span>
                        <ChevronDown className="group-data-[state=open]:rotate-180 transition-transform duration-500" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="bg-white data  mt-2 border-neutral-200">
                        <div className=" -translate-y-7 p-2   border-blue-300/80  border-b-[6px]  border-x-[3px] rounded-b-2xl">
                            <div className=" mt-5">
                                <Textarea
                                    {...form.register("notes")}
                                    placeholder="Any notes for the ai..."
                                    className="w-full"
                                    errorMessage={
                                        form.formState.errors.notes?.message
                                    }
                                />
                            </div>
                            <div className=" -mt-1 gap-8">
                                <div className="pb-3">
                                    <Controller
                                        control={form.control}
                                        name="allowedQuestions"
                                        render={({
                                            field: { onChange, value, onBlur },
                                        }) => (
                                            <SearchSelectMultiple
                                                items={POSSIBLE_QUESTIONS_TYPES.map(
                                                    (questionType) => {
                                                        return {
                                                            id: questionType,
                                                            label: questionType
                                                                .split("_")
                                                                .join(" ")
                                                                .toLowerCase(),
                                                        }
                                                    }
                                                )}
                                                placeholder="Allowed questions"
                                                inputClassName="w-full mb-2"
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

                            <div className="grid grid-cols-2 gap-8">
                                <Input
                                    {...form.register("maxQuestions")}
                                    placeholder="Max questions"
                                    className="w-full"
                                    type="number"
                                    errorMessage={
                                        form.formState.errors.maxQuestions
                                            ?.message
                                    }
                                />
                                <Input
                                    {...form.register("minQuestions")}
                                    placeholder="Min questions"
                                    className="w-full"
                                    type="number"
                                    errorMessage={
                                        form.formState.errors.minQuestions
                                            ?.message
                                    }
                                />
                            </div>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
                <ImageUpload
                    renderEmptyContent={() => (
                        <>
                            <ImageIcon className="w-10 h-10 mb-2 mt-5 mx-auto text-neutral-400" />
                            <p className="text-base font-semibold text-neutral-500">
                                Drag or click to upload cover image.
                            </p>
                            <p className="text-xs text-neutral-400 mt-0">
                                Images (PNG, JPG, GIF)
                            </p>
                            <p className="text-xs text-neutral-400">
                                up to 10MB
                            </p>
                        </>
                    )}
                    displayCancelBtn
                    isLoading={isUploadingImage}
                    onLoadingChange={setIsUploadingImage}
                    className=""
                    imageUrl={imageUrl}
                    onImageUrlChange={setImageUrl}
                />
                <Button
                    isLoading={isLoading}
                    disabled={isUploadingImage}
                    type="button"
                    onClick={form.handleSubmit(onSubmit)}
                    className="font-extrabold uppercase mt-5 text-sm"
                    variant="blue"
                >
                    Generate Quiz
                </Button>
            </section>
        </main>
    )
}
