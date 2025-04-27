"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useMemo } from "react"
import { getLanguage } from "@/utils/get-language"

type Props = {
    isOpen: boolean
    onOpenChange: (value: boolean) => void
    onEdit: () => void
    onTake: () => void
    isLoading: boolean
}

export default function QuizStartDialog({
    isOpen,
    onOpenChange,
    onEdit,
    onTake,
    isLoading,
}: Props) {
    const translation = useMemo(
        () => ({
            en: {
                title: "What would you like to do?",
                description:
                    "Do you want to edit the questions of the quiz or take it without seeing the questions?",
                edit: "Edit Questions",
                take: "Take Quiz",
            },
            fr: {
                title: "Que souhaitez-vous faire ?",
                description:
                    "Voulez-vous modifier les questions du quiz ou le passer sans voir les questions ?",
                edit: "Modifier les questions",
                take: "Passer le quiz",
            },
            ar: {
                title: "ماذا تريد أن تفعل؟",
                description:
                    "هل تريد تعديل أسئلة الاختبار أم بدء الاختبار دون رؤية الأسئلة؟",
                edit: "تعديل الأسئلة",
                take: "بدء الاختبار",
            },
        }),
        []
    )
    const lang = getLanguage()
    const t = translation[lang]

    return (
        <Dialog open={isOpen}>
            <DialogContent className="md:min-w-[400px] !rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl rtl:text-right font-bold">
                        {t.title}
                    </DialogTitle>
                </DialogHeader>
                <div className="mb-4 font-medium text-neutral-500">
                    {t.description}
                </div>
                <DialogFooter className="gap-2">
                    <Button
                        variant="secondary"
                        onClick={() => {
                            onEdit()
                            onOpenChange(false)
                        }}
                        disabled={isLoading}
                    >
                        {t.edit}
                    </Button>
                    <Button
                        isLoading={isLoading}
                        onClick={() => {
                            onTake()
                        }}
                    >
                        {t.take}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
