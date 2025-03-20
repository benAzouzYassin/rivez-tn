import { Plus } from "lucide-react"
import useUpdateQuizStore from "../store"
import LayoutSelectDialog from "./layout-select-dialog"
import { memo } from "react"
import { cn } from "@/lib/ui-utils"

interface Props {
    displayOrder: number
    className?: string
}
function AddQuestionButton(props: Props) {
    const addQuestion = useUpdateQuizStore((s) => s.addQuestion)
    return (
        <LayoutSelectDialog
            onSelect={(layoutType) => {
                switch (layoutType) {
                    case "fill-in-the-blank":
                        addQuestion({
                            hints: [],
                            displayOrder: props.displayOrder,
                            questionId: null,
                            localId: crypto.randomUUID(),
                            questionText: "",
                            imageUrl: null,
                            codeSnippets: null,
                            imageType: "none",
                            layout: "vertical",
                            type: "FILL_IN_THE_BLANK",
                            content: {
                                correct: [],
                                options: [],
                                parts: [],
                            },
                        })
                        window.scrollTo({
                            behavior: "smooth",
                            top: 0,
                        })
                        break
                    case "multiple-choice-without-image":
                        addQuestion({
                            hints: [],
                            displayOrder: props.displayOrder,
                            questionId: null,
                            localId: crypto.randomUUID(),
                            questionText: "",
                            imageUrl: null,
                            codeSnippets: null,
                            imageType: "none",
                            layout: "vertical",
                            type: "MULTIPLE_CHOICE",
                            content: {
                                options: [],
                            },
                        })
                        window.scrollTo({
                            behavior: "smooth",
                            top: 0,
                        })
                        break
                    case "matching-pairs":
                        addQuestion({
                            hints: [],
                            displayOrder: props.displayOrder,
                            questionId: null,
                            imageType: "none",
                            localId: crypto.randomUUID(),
                            questionText: "",
                            imageUrl: null,
                            codeSnippets: null,
                            layout: "vertical",
                            type: "MATCHING_PAIRS",
                            content: {
                                leftOptions: [],
                                rightOptions: [],
                            },
                        })
                        window.scrollTo({
                            behavior: "smooth",
                            top: 0,
                        })
                        break

                    case "vertical-multiple-choice":
                        addQuestion({
                            hints: [],
                            displayOrder: props.displayOrder,
                            questionId: null,
                            localId: crypto.randomUUID(),
                            questionText: "",
                            imageUrl: null,
                            codeSnippets: null,
                            imageType: "normal-image",
                            layout: "vertical",
                            type: "MULTIPLE_CHOICE",
                            content: {
                                options: [],
                            },
                        })
                        window.scrollTo({
                            behavior: "smooth",
                            top: 0,
                        })
                        break
                    case "horizontal-multiple-choice":
                        addQuestion({
                            hints: [],
                            displayOrder: props.displayOrder,
                            questionId: null,
                            localId: crypto.randomUUID(),
                            questionText: "",
                            imageUrl: null,
                            codeSnippets: null,
                            imageType: "normal-image",
                            layout: "horizontal",
                            type: "MULTIPLE_CHOICE",
                            content: {
                                options: [],
                            },
                        })
                        window.scrollTo({
                            behavior: "smooth",
                            top: 0,
                        })
                        break
                    default:
                        break
                }
            }}
            trigger={
                <div className="flex items-center">
                    <button
                        className={cn(
                            "h-full flex items-center justify-center min-w-32 hover:cursor-pointer hover:bg-neutral-50 active:scale-95 transition-all border-dashed border-neutral-300 border-2 rounded-lg",
                            props.className
                        )}
                    >
                        <Plus className="w-16 h-16 text-neutral-300 stroke-1" />
                    </button>
                </div>
            }
        />
    )
}
export default memo(AddQuestionButton)
