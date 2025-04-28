import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Flag } from "lucide-react"
import { useState } from "react"

type ReportOption = {
    id: string
    boldText: string
    description: string
}

const reportOptions: ReportOption[] = [
    {
        id: "answer",
        boldText: "My answer",
        description: "should be accepted",
    },
    {
        id: "no-correct-answer",
        boldText: "No correct",
        description: "answers",
    },
    {
        id: "wrong-info",
        boldText: "Wrong information",
        description: "is presented in the question",
    },
    {
        id: "other",
        boldText: "Another option,",
        description: "i will add it below",
    },
]

type Props = {
    disabled: boolean
    quizId: string
    quizType: "question-answer" | "course"
    className?: string
}

export default function ReportQuiz({
    disabled,
    quizId,
    quizType,
    className,
}: Props) {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([])
    const [additionalComments, setAdditionalComments] = useState("")

    const handleCheckboxChange = (optionId: string) => {
        setSelectedOptions((prev) =>
            prev.includes(optionId)
                ? prev.filter((id) => id !== optionId)
                : [...prev, optionId]
        )
    }

    const handleSubmit = async () => {
        // TODO handle submit
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    disabled={disabled}
                    variant="link"
                    className={className}
                >
                    <Flag className="w-4 h-4" />
                    Report
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md rounded-3xl! p-8 bg-white dark:bg-neutral-900 transition-colors">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-neutral-800 dark:text-neutral-100">
                        Report an Issue
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    {reportOptions.map((option) => (
                        <div
                            key={option.id}
                            className="flex items-center space-x-2"
                        >
                            <Checkbox
                                id={option.id}
                                checked={selectedOptions.includes(option.id)}
                                onCheckedChange={() =>
                                    handleCheckboxChange(option.id)
                                }
                            />
                            <label
                                htmlFor={option.id}
                                className="text-base font-medium leading-none cursor-pointer text-neutral-800 dark:text-neutral-100"
                            >
                                <span className="font-bold">
                                    {option.boldText}
                                </span>{" "}
                                {option.description}
                            </label>
                        </div>
                    ))}
                    <div className="space-y-2">
                        <Textarea
                            id="additional-comments"
                            placeholder="Please provide any additional details about the issue..."
                            value={additionalComments}
                            onChange={(e) =>
                                setAdditionalComments(e.target.value)
                            }
                            className="min-h-[100px] bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                        />
                    </div>
                    <Button
                        className="w-full disabled:hover:cursor-not-allowed disabled:opacity-80 font-bold mt-6"
                        variant="blue"
                        onClick={handleSubmit}
                        disabled={selectedOptions.length === 0}
                    >
                        SUBMIT
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
