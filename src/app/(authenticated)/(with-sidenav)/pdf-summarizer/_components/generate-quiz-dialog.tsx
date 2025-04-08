import { POSSIBLE_QUESTIONS } from "@/app/api/quiz/generate-quiz/constants"
import { Button } from "@/components/ui/button"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import SearchSelectMultiple from "@/components/ui/search-select-multiple"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createQuiz } from "@/data-access/quizzes/create"
import { useCurrentUser } from "@/hooks/use-current-user"
import { toastError } from "@/lib/toasts"
import { useSidenav } from "@/providers/sidenav-provider"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { ChevronDown, ChevronLeft, Sparkles } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"
import { useEffect, useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import useQuizStore from "../../quizzes/add/[id]/store"
import { DifficultySelect } from "./difficulty-select"
import ImageUpload from "./image-upload"

const POSSIBLE_QUESTIONS_TYPES = Object.keys(POSSIBLE_QUESTIONS)

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

interface Props {
    isOpen: boolean
    onOpenChange: (value: boolean) => void
    content: string
}
export default function GenerateQuizDialog(props: Props) {
    const queryClient = useQueryClient()
    const { data: userData } = useCurrentUser()
    const [isLoading, setIsLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const router = useRouter()
    const generateQuizWithAi = useQuizStore((s) => s.generateQuizWithAi)
    const { isSidenavOpen, toggleSidenav } = useSidenav()
    const resetEditableQuizStore = useQuizStore((s) => s.reset)
    const addToEditQuizWithAi = useQuizStore((s) => s.generateQuizWithAi)
    useEffect(() => {
        if (props.isOpen) {
            resetEditableQuizStore()
        }
    }, [resetEditableQuizStore, props.isOpen])

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

    const onSubmit = async (data: FormValues) => {
        try {
            setIsLoading(true)
            const result = await createQuiz({
                name: data.name,
                category: data.category ? Number(data.category) : null,
                image: imageUrl,
                description: "",
                author_id: userData?.id,
                difficulty: (data.difficulty as any) || "NORMAL",
            })
            const quizId = result[0].id
            if (isSidenavOpen) {
                toggleSidenav()
            }
            router.push(`/quizzes/add/${quizId}?isGeneratingWithAi=true`)
            addToEditQuizWithAi(
                { ...data, quizId, content: props.content },
                "content",
                () => {
                    // on success
                    queryClient.refetchQueries({
                        predicate: (query) =>
                            query.queryKey.includes("current-user"),
                    })
                }
            )

            setImageUrl(null)
        } catch (error) {
            toastError("Something wrong happened.")
            console.error(error)
            setIsLoading(false)
        }
    }
    return (
        <Dialog open={props.isOpen} onOpenChange={props.onOpenChange}>
            <DialogContent className="!min-w-[800px] w-[800px]">
                <DialogTitle className="mt-10 text-neutral-600 text-center text-3xl font-extrabold">
                    {" "}
                    Generate Quiz
                </DialogTitle>

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
                <section className="flex flex-col w-full mt-1 gap-1 max-w-[900px]">
                    <Input
                        {...form.register("name")}
                        placeholder="Quiz Name"
                        className="w-full"
                        errorMessage={form.formState.errors.name?.message}
                    />

                    <div className=" -mt-1 gap-8">
                        <Select
                            defaultValue={
                                form.getValues().language || undefined
                            }
                            onValueChange={(val) =>
                                form.setValue("language", val)
                            }
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
                                                field: {
                                                    onChange,
                                                    value,
                                                    onBlur,
                                                },
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
                                                    onUnselect={(
                                                        unselectedId
                                                    ) => {
                                                        onChange(
                                                            value?.filter(
                                                                (
                                                                    questionType
                                                                ) =>
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
                    <ImageUpload
                        className=""
                        imageUrl={imageUrl}
                        onImageUrlChange={setImageUrl}
                    />

                    <Button
                        isLoading={isLoading}
                        type="button"
                        onClick={() => {
                            form.handleSubmit(onSubmit)()
                        }}
                        className="font-extrabold uppercase py-7 mt-5 text-sm"
                    >
                        Generate Quiz <Sparkles className="!w-5 !h-5" />
                    </Button>
                </section>
                <DialogDescription></DialogDescription>
            </DialogContent>
        </Dialog>
    )
}
