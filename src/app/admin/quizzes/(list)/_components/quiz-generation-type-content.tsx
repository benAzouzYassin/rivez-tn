"use client"

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Brain, PenTool } from "lucide-react"

type Props = {
    onTypeChange: (value: "manual" | "auto") => void
}

export default function QuizGenerationTypeContent({ onTypeChange }: Props) {
    return (
        <div className="px-4 pb-10">
            <DialogTitle className="text-3xl py-5 font-extrabold text-neutral-700 text-center mb-2">
                How would you like to create your quiz?
            </DialogTitle>
            <DialogDescription className="text-center text-gray-500 mb-8"></DialogDescription>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <Card
                    className="group cursor-pointer  hover:border-blue-300 hover:bg-blue-50/70 hover:shadow-blue-300 transition-all duration-300 border-2  hover:scale-[1.02]"
                    onClick={() => onTypeChange("auto")}
                >
                    <CardHeader className="space-y-4 flex flex-col items-center text-center">
                        <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center  transition-colors">
                            <Brain className="h-10 w-10 group-hover:text-blue-500 text-neutral-600" />
                        </div>
                        <CardTitle className="text-xl group-hover:text-blue-500 font-bold">
                            AI Generation
                        </CardTitle>
                        <CardDescription className="text-base">
                            Let AI create engaging quiz questions based on your
                            content
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card
                    className="group cursor-pointer  hover:border-blue-300 hover:bg-blue-50/70 hover:shadow-blue-300 transition-all duration-300 border-2  hover:scale-[1.02]"
                    onClick={() => onTypeChange("manual")}
                >
                    <CardHeader className="space-y-4 flex flex-col items-center text-center">
                        <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center  transition-colors">
                            <PenTool className="h-10 w-10 group-hover:text-blue-500 text-neutral-600" />
                        </div>
                        <CardTitle className="text-xl  group-hover:text-blue-500 -mt-1 font-bold">
                            Manual Creation
                        </CardTitle>
                        <CardDescription className="text-base">
                            Create and customize your own quiz questions from
                            scratch
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </div>
    )
}
