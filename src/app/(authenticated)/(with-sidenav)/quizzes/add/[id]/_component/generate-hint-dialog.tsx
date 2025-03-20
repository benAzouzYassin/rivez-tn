import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import TooltipWrapper from "@/components/ui/tooltip"
import { generateQuestionHint } from "@/data-access/quizzes/generate-question-hint"
import { toastError } from "@/lib/toasts"
import { cn } from "@/lib/ui-utils"
import { tryCatch } from "@/utils/try-catch"
import { zodResolver } from "@hookform/resolvers/zod"
import { Sparkles, SparklesIcon } from "lucide-react"
import { useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    FillInTheBlankStoreContent,
    MatchingPairsOptions,
    MultipleChoiceOptions,
    QuizQuestionType,
} from "../store"

interface Props {
    question: QuizQuestionType
    onGenerateEnd: (content: string) => void
}
export default function GenerateHintDialog(props: Props) {
    const [open, setOpen] = useState(false)
    const hint = useRef("")
    const [isStreaming, setIsStreaming] = useState(false)

    const formSchema = useMemo(
        () =>
            z.object({
                difficulty: z
                    .enum(["easy", "medium", "hard"])
                    .default("medium"),
                subject: z
                    .string()
                    .max(100, "Subject must be less than 100 characters")
                    .optional(),
            }),
        []
    )

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            difficulty: "hard",
        },
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (!props.question.questionText) {
            return toastError(
                "Can't generate a hint while there is no question."
            )
        }
        setIsStreaming(true)
        hint.current = ""
        const { error } = await tryCatch(
            generateQuestionHint(
                {
                    question: formatQuestion(props.question) as any,
                    difficulty: data.difficulty as any,
                    subject: "",
                },
                (part) => {
                    // onChange
                    hint.current = hint.current + part
                },
                () => {
                    // onFinish
                    props.onGenerateEnd(hint.current)

                    setIsStreaming(false)
                    setOpen(false)
                }
            )
        )
        if (error) {
            toastError("Something went wrong.")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <TooltipWrapper content="Generate with ai" asChild>
                    <button
                        onClick={() => setOpen(true)}
                        className=" right-5 z-50 border rounded-full p-2 bg-white top-40 absolute cursor-pointer active:scale-90 hover:bg-purple-100 transition-all"
                    >
                        <Sparkles className="h-7 w-7 stroke-[2.5] text-purple-500/70" />
                    </button>
                </TooltipWrapper>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogTitle className="text-2xl text-neutral-600 font-extrabold">
                    Generate Question Hint
                </DialogTitle>
                <DialogDescription>
                    Fill in the details below to generate a helpful hint with
                    AI.
                </DialogDescription>
                <form
                    className="flex flex-col pt-4"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Textarea
                        id="question"
                        placeholder="Enter your hint subject (optional)"
                        className={cn("text-base w-full h-24 font-medium")}
                        errorMessage={errors.subject?.message}
                        {...register("subject")}
                    />

                    <div className="flex items-center gap-4 -mt-2 ">
                        <div className="w-full">
                            <label className="text-sm text-neutral-500 mb-1 block">
                                Difficulty
                            </label>
                            <Select
                                defaultValue={watch("difficulty")}
                                onValueChange={(value) => {
                                    register("difficulty").onChange({
                                        target: { value, name: "difficulty" },
                                    })
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select difficulty" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="easy">Easy</SelectItem>
                                    <SelectItem value="medium">
                                        Medium
                                    </SelectItem>
                                    <SelectItem value="hard">Hard</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="text-base ml-auto mt-4"
                        isLoading={isSubmitting || isStreaming}
                    >
                        Generate
                        <SparklesIcon className="ml-2 w-5 h-5" />
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

const formatQuestion = (question: QuizQuestionType) => {
    if (question.type === "FILL_IN_THE_BLANK") {
        const content = question.content as FillInTheBlankStoreContent
        return {
            questionText: question.questionText,
            type: "FILL_IN_THE_BLANK",
            content: {
                parts: content.parts,
                options: [],
                correct: content.correct,
            },
        }
    }
    if (question.type === "MATCHING_PAIRS") {
        const content = question.content as MatchingPairsOptions
        return {
            questionText: question.questionText,
            type: "MATCHING_PAIRS",
            leftOptions: content.leftOptions.map((opt) => opt.text),
            rightOptions: content.rightOptions.map((opt) => ({
                text: opt.text,
                leftOption:
                    content.leftOptions.find(
                        (item) => item.localId === opt.leftOptionLocalId
                    )?.text || "",
            })),
        }
    }

    if (question.type == "MULTIPLE_CHOICE") {
        const content = question.content as MultipleChoiceOptions
        return {
            questionText: question.questionText,
            type: "MULTIPLE_CHOICE",
            options: content.options.map((item) => ({
                ...item,
                isCorrect: item.isCorrect || false,
            })),
        }
    }
}
