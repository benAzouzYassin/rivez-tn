"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { wait } from "@/utils/wait"
import { useEffect, useState } from "react"
import AiQuizDialogContent from "./ai-quiz-dialog-content"
import QuizGenerationTypeContent from "./quiz-generation-type-content"
import SimpleQuizDialogContent from "./simple-quiz-dialog-content"

export default function AddQuizDialog(props: Props) {
    const [generationType, setGenerationType] = useState<
        "manual" | "auto" | null
    >(null)
    useEffect(() => {
        if (!props.isOpen) {
            wait(100).then(() => setGenerationType(null))
        }
    }, [props.isOpen])
    return (
        <Dialog open={props.isOpen} onOpenChange={props.onOpenChange}>
            <DialogContent className="sm:max-w-[45vw] max-h-[96vh] transition-all flex flex-col overflow-y-auto py-10">
                {generationType === null && (
                    <QuizGenerationTypeContent
                        onTypeChange={setGenerationType}
                    />
                )}
                {generationType === "auto" && (
                    <AiQuizDialogContent
                        onBackClick={() => setGenerationType(null)}
                    />
                )}
                {generationType === "manual" && (
                    <SimpleQuizDialogContent
                        onBackClick={() => setGenerationType(null)}
                    />
                )}
            </DialogContent>
        </Dialog>
    )
}

interface Props {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}
