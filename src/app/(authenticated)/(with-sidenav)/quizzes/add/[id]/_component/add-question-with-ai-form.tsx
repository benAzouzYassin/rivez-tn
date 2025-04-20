import { POSSIBLE_QUESTIONS } from "@/app/api/quiz/generate-quiz/constants"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft, SparklesIcon } from "lucide-react"
import { useMemo } from "react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { DifficultySelect } from "../../_components/difficulty-select"

const POSSIBLE_QUESTIONS_TYPES = Object.keys(POSSIBLE_QUESTIONS)

interface FormValues {
    mainTopic: string
    language?: string | null | undefined
    notes?: string | null | undefined
    difficulty?: string | null | undefined
}

interface Props {
    onSubmit: (data: FormValues) => void
    onBackClick: () => void
}

export default function AddQuestionWithAiForm(props: Props) {
    const formSchema = useMemo(
        () =>
            z.object({
                mainTopic: z
                    .string()
                    .min(1, "Main topic is required")
                    .max(100, "Input exceeds maximum length"),
                language: z.string().nullable().optional(),
                notes: z.string().nullable().optional(),
                difficulty: z.string().nullable().optional(),
            }),
        []
    )
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    })

    return (
        <section className="flex flex-col w-full md:-mt-5 mx-auto gap-4 max-w-[900px] bg-white  rounded-3xl  ">
            <Button
                variant={"secondary"}
                className="absolute top-8"
                onClick={props.onBackClick}
            >
                <ChevronLeft /> Back
            </Button>
            <div className="">
                {/* Main Topic */}
                <div>
                    <label
                        htmlFor="mainTopic"
                        className="block text-sm font-medium text-neutral-700 mb-1"
                    >
                        Subject
                    </label>
                    <Textarea
                        id="mainTopic"
                        {...form.register("mainTopic")}
                        placeholder="Enter the main topic (Be detailed !)"
                        className="w-full -mb-2"
                        errorMessage={form.formState.errors.mainTopic?.message}
                    />
                </div>
                {/* Difficulty */}
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Difficulty Level
                    </label>
                    <Controller
                        control={form.control}
                        name="difficulty"
                        render={({ field: { onChange, value, onBlur } }) => (
                            <DifficultySelect
                                selected={value as any}
                                setSelected={onChange}
                                className="w-full"
                            />
                        )}
                    />
                </div>
                {/* Language Selection */}
                <div>
                    <label
                        htmlFor="language"
                        className="block text-sm font-medium text-neutral-700 mb-1"
                    >
                        Language
                    </label>
                    <Select
                        defaultValue={form.getValues().language || undefined}
                        onValueChange={(val) => form.setValue("language", val)}
                    >
                        <SelectTrigger className="data-[placeholder]:text-neutral-400 w-full">
                            <SelectValue
                                id="language"
                                placeholder="Select language"
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="EN">English</SelectItem>
                            <SelectItem disabled value="AR">
                                Arabic{" "}
                                <span className="text-sm italic text-neutral-500">
                                    (coming soon)
                                </span>
                            </SelectItem>
                            <SelectItem disabled value="FR">
                                French{" "}
                                <span className="text-sm italic text-neutral-500">
                                    (coming soon)
                                </span>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Notes */}
                <div>
                    <label
                        htmlFor="notes"
                        className="block text-sm font-medium text-neutral-700 mb-1"
                    >
                        Additional Notes
                    </label>
                    <Textarea
                        id="notes"
                        {...form.register("notes")}
                        placeholder="Add any additional instructions for the AI..."
                        className="w-full"
                        errorMessage={form.formState.errors.notes?.message}
                    />
                </div>
            </div>

            {/* Submit Button */}
            <Button
                type="button"
                onClick={() => {
                    form.handleSubmit((data) => props.onSubmit(data))()
                }}
                className="font-extrabold uppercase mt-4 py-6 text-base w-full md:w-auto"
                variant="blue"
            >
                Generate Question
                <SparklesIcon className=" !w-6 !h-6" />
            </Button>
        </section>
    )
}
