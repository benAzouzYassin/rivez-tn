import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/ui-utils"
import { PlusCircle } from "lucide-react"
import { ButtonHTMLAttributes, useState } from "react"
import useQuizStore, { FillInTheBlankStoreContent } from "../../store"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
type Props = {
    questionId: string
    questionContent: FillInTheBlankStoreContent
} & ButtonHTMLAttributes<any>

export default function AddOptionButton({
    questionId,
    className,
    questionContent,
    ...props
}: Props) {
    const [isOpen, setIsOpen] = useState(false)
    const updateQuestion = useQuizStore((s) => s.updateQuestion)
    const [inputValue, setInputValue] = useState("")
    const [isError, setIsError] = useState(false)
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button
                    {...props}
                    className={cn(
                        "bg-white min-w-[100px]  border-dashed min-h-[52px] h-fit my-auto text-stone-300 hover:bg-stone-300/20 hover:cursor-pointer hover:border-stone-300 hover:text-stone-300 border-[3px] border-neutral-300 justify-center active:scale-95 shadow-none  flex items-center px-4 shadow-[#E5E5E5] rounded-xl transition-colors",
                        "relative group transform transition-all duration-300 ease-in-out",
                        className
                    )}
                >
                    <PlusCircle className="w-7 h-7" />
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle></DialogTitle>
                <DialogDescription></DialogDescription>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        if (!inputValue) {
                            return setIsError(true)
                        }
                        updateQuestion(
                            {
                                content: {
                                    correct: questionContent.correct,
                                    options: [
                                        ...questionContent.options,
                                        {
                                            localId: crypto.randomUUID(),
                                            text: inputValue,
                                        },
                                    ],
                                    parts: questionContent.parts,
                                },
                            },
                            questionId
                        )
                        setInputValue("")
                        setIsOpen(false)
                    }}
                >
                    <Input
                        className="w-full"
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value)
                            if (e.target.value) {
                                setIsError(false)
                            }
                        }}
                        type="text"
                        errorMessage={
                            isError ? "This field is required" : undefined
                        }
                        placeholder="New option value..."
                    />
                    <Button>Add option</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
