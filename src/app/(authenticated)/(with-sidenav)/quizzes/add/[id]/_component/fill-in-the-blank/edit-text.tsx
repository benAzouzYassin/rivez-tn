import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/ui-utils"
import { PenLine } from "lucide-react"
import { ButtonHTMLAttributes, useEffect, useState } from "react"
import useQuizStore, { FillInTheBlankStoreContent } from "../../store"
import { getLanguage } from "@/utils/get-language"

interface Props extends ButtonHTMLAttributes<any> {
    questionId: string
    questionContent: FillInTheBlankStoreContent
    parts: string[]
}

const BLANK_SEPARATOR = "___"
export default function EditText({
    questionId,
    className,
    questionContent,
    parts,
    ...props
}: Props) {
    const lang = getLanguage()
    const t = translation[lang]
    const [isOpen, setIsOpen] = useState(false)
    const updateQuestion = useQuizStore((s) => s.updateQuestion)
    const [inputValue, setInputValue] = useState(parts.join(BLANK_SEPARATOR))
    const [isError, setIsError] = useState(false)

    useEffect(() => {
        setInputValue(parts.join(BLANK_SEPARATOR))
    }, [parts])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button
                    {...props}
                    className={cn(
                        "border-2 cursor-pointer  active:scale-95 transition-all hover:bg-neutral-100 rounded-xl bg-white px-1 py-1  border-neutral-200",
                        "",
                        className
                    )}
                >
                    <PenLine className="w-6 text-neutral-500 h-6" />
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-[650px]">
                <DialogTitle>{t["Edit Text"]}</DialogTitle>
                <DialogDescription>
                    {t["Edit the text content for the question."]}
                </DialogDescription>

                <div className="flex flex-col gap-4">
                    <p className="-mb-2 font-semibold text-lg text-neutral-700">
                        {t["To make a blank field insert this text :"]}
                        {` ${BLANK_SEPARATOR}`}
                    </p>
                    <Textarea
                        placeholder={t["Enter text content"]}
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value)
                            if (isError && e.target.value.trim() !== "") {
                                setIsError(false)
                            }
                        }}
                        className="w-full  text-lg min-h-24 font-bold"
                        errorMessage={
                            isError ? t["This field is required."] : ""
                        }
                    />

                    <div className="flex justify-end gap-3 -mt-5">
                        <div className="flex gap-2">
                            <Button
                                onClick={() => {
                                    if (!inputValue) {
                                        return setIsError(true)
                                    }
                                    const newParts = inputValue.split("___")

                                    updateQuestion(
                                        {
                                            content: {
                                                correct: [],
                                                parts: newParts,
                                                options: [
                                                    ...questionContent.options,
                                                    ...questionContent.correct.map(
                                                        (item) => ({
                                                            text: item.option,
                                                            localId:
                                                                item.optionId,
                                                        })
                                                    ),
                                                ],
                                            },
                                        },
                                        questionId
                                    )
                                    setInputValue("")
                                    setIsOpen(false)
                                }}
                            >
                                {t["Add paragraph"]}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

const translation = {
    en: {
        "Edit Text": "Edit Text",
        "Edit the text content for the question.":
            "Edit the text content for the question.",
        "To make a blank field insert this text :":
            "To make a blank field insert this text :",
        "Enter text content": "Enter text content",
        "This field is required.": "This field is required.",
        "Add paragraph": "Add paragraph",
    },
    ar: {
        "Edit Text": "تعديل النص",
        "Edit the text content for the question.": "تعديل محتوى النص للسؤال.",
        "To make a blank field insert this text :":
            "لإنشاء حقل فارغ، أدخل هذا النص:",
        "Enter text content": "أدخل محتوى النص",
        "This field is required.": "هذا الحقل مطلوب.",
        "Add paragraph": "إضافة فقرة",
    },
    fr: {
        "Edit Text": "Modifier le texte",
        "Edit the text content for the question.":
            "Modifier le contenu du texte pour la question.",
        "To make a blank field insert this text :":
            "Pour créer un champ vide, insérez ce texte :",
        "Enter text content": "Entrer le contenu du texte",
        "This field is required.": "Ce champ est obligatoire.",
        "Add paragraph": "Ajouter un paragraphe",
    },
}
