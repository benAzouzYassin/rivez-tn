import React, { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import TooltipWrapper from "@/components/ui/tooltip"
import { Eye, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { areArraysEqual } from "@/utils/array"
import { cn } from "@/lib/ui-utils"

type Props = {
    question: string
    questionType: "MATCHING_PAIRS" | "MULTIPLE_CHOICE"
    responses: string[] | string[][]
    correctAnswers: string[] | string[][]
}

const QuestionResponses = ({
    question,
    questionType,
    responses,
    correctAnswers,
}: Props) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Button
                variant={"outline"}
                className="rounded-xl px-4 border-blue-300/80 bg-blue-50/80  text-blue-500 hover:text-blue-500 text-sm"
                onClick={() => setIsOpen(true)}
            >
                Details <Eye className="!w-5 !h-5 " />
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild></DialogTrigger>
                <DialogContent className="max-w-2xl">
                    <div className="px-2">
                        <DialogTitle className="text-2xl font-semibold text-neutral-800 mb-6"></DialogTitle>
                        <DialogDescription className="mt-4">
                            {" "}
                        </DialogDescription>
                        <div className="space-y-8">
                            <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200">
                                <p className="text-xl text-neutral-800 font-extrabold">
                                    {question}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-extrabold uppercase tracking-wider  text-neutral-500 mb-2">
                                    User Answers
                                </h3>
                                <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200">
                                    {questionType === "MULTIPLE_CHOICE" ? (
                                        <div className="space-y-4">
                                            {(responses as string[]).map(
                                                (response, index) => {
                                                    const isCorrect =
                                                        correctAnswers.includes(
                                                            response as any
                                                        )
                                                    return (
                                                        <div
                                                            key={index}
                                                            className="p-4 bg-white border border-neutral-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group"
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <span className="text-neutral-700 text-lg font-bold group-hover:text-neutral-900">
                                                                    {response}{" "}
                                                                </span>
                                                                <Badge
                                                                    className="rounded-full ml-auto"
                                                                    variant={
                                                                        isCorrect
                                                                            ? "green"
                                                                            : "red"
                                                                    }
                                                                >
                                                                    {" "}
                                                                    {isCorrect
                                                                        ? "Correct"
                                                                        : "Not correct"}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {(responses as string[][]).map(
                                                (pair, index) => {
                                                    const isCorrect =
                                                        correctAnswers.find(
                                                            (item) =>
                                                                areArraysEqual(
                                                                    item as string[],
                                                                    pair
                                                                )
                                                        )
                                                    return (
                                                        <div
                                                            key={index}
                                                            className="flex items-center gap-4"
                                                        >
                                                            <div className="flex-1 p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl border border-blue-200  transition-all duration-200">
                                                                <span className="text-blue-500 font-bold">
                                                                    {pair[0]}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center justify-center">
                                                                <ArrowRight className="w-6 h-6 text-neutral-400" />
                                                            </div>
                                                            <div
                                                                className={cn(
                                                                    "flex-1 p-4 bg-gradient-to-r  from-green-50 to-green-100/80 rounded-xl border border-green-200 transition-all duration-200",
                                                                    {
                                                                        "from-red-50 to-red-100/80 rounded-xl border border-red-200 ":
                                                                            !isCorrect,
                                                                    }
                                                                )}
                                                            >
                                                                <span
                                                                    className={cn(
                                                                        "text-green-600 font-bold",
                                                                        {
                                                                            "text-red-600":
                                                                                !isCorrect,
                                                                        }
                                                                    )}
                                                                >
                                                                    {pair[1]}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default QuestionResponses
