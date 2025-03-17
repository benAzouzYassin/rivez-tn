import { cn } from "@/lib/ui-utils"
import { X } from "lucide-react"
import { memo, useState } from "react"
import useQuizStore from "../store"
import { wait } from "@/utils/wait"

type Props = {
    questionLocalId: string
    questionText: string
    isSelected: boolean
}

function QuestionPreview(props: Props) {
    const removeQuestion = useQuizStore((s) => s.removeQuestion)
    const selectQuestion = useQuizStore((s) => s.setSelectedQuestion)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleRemove = () => {
        setIsDeleting(true)
        wait(300).then(() => removeQuestion(props.questionLocalId))
    }

    return (
        <div
            className={cn(
                "relative group w-[150px] h-[100px] pb-3 transform transition-all duration-300 ease-in-out",
                {
                    "opacity-0 scale-95 -translate-y-2": isDeleting,
                    "opacity-100 scale-100 translate-y-0": !isDeleting,
                }
            )}
        >
            <button
                onClick={handleRemove}
                className="absolute -right-1 hover:cursor-pointer active:scale-95 -top-2 p-[2px] bg-red-100 border-2 border-red-400 rounded-full text-red-500/90 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-200 hover:border-red-500 hover:text-red-600"
            >
                <X className="w-4 h-4 stroke-3" />
            </button>
            <button
                onClick={() => {
                    selectQuestion(props.questionLocalId)
                    window.scrollTo({
                        behavior: "smooth",
                        top: 0,
                    })
                }}
                className={cn(
                    "h-full flex items-center justify-center w-[140px] overflow-hidden hover:bg-blue-300/10  transition-all duration-200 border rounded-xl hover:cursor-pointer hover:shadow-md border-neutral-300",
                    {
                        "bg-blue-50/90 border-blue-400/60 shadow-lg shadow-blue-200/60 border-2 hover:bg-blue-100/90":
                            props.isSelected,
                    }
                )}
            >
                <div className="max-h-[90%] h-fit overflow-hidden  ">
                    <span className="text-sm line-clamp-2 pr-2 text-neutral-400 font-medium">
                        {props.questionText}
                    </span>
                </div>
            </button>
        </div>
    )
}
export default memo(QuestionPreview)
