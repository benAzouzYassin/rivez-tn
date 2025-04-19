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
import useUpdateQuizStore, { FillInTheBlankStoreContent } from "../../store"
interface Props extends ButtonHTMLAttributes<any> {questionId: string
    questionContent: FillInTheBlankStoreContent
    parts: string[]}

const BLANK_SEPARATOR = "___"
export default function EditText({
    questionId,
    className,
    questionContent,
    parts,
    ...props
}: Props) {
    const [isOpen, setIsOpen] = useState(false)
    const updateQuestion = useUpdateQuizStore((s) => s.updateQuestion)
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
                <DialogTitle></DialogTitle>
                <DialogDescription></DialogDescription>

                <div className="flex flex-col gap-4">
                    <p className="-mb-2 font-semibold text-lg text-neutral-700">
                        To make a blank field insert this text :
                        {` ${BLANK_SEPARATOR}`}
                    </p>
                    <Textarea
                        placeholder="Enter text content"
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value)
                            if (isError && e.target.value.trim() !== "") {
                                setIsError(false)
                            }
                        }}
                        className="w-full  text-lg min-h-24 font-bold"
                        errorMessage={isError ? "This field is required." : ""}
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
                                Add paragraph
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
