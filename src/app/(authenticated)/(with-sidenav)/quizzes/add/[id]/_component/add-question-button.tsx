import { toastError } from "@/lib/toasts"
import { cn } from "@/lib/ui-utils"
import { useQueryClient } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import useQuizStore from "../store"
import LayoutSelectDialog, { LayoutOptions } from "./layout-select-dialog"

interface Props {
    className?: string
}
export default function AddQuestionButton(props: Props) {
    const addQuestion = useQuizStore((s) => s.addQuestion)
    const generateAddedQuestion = useQuizStore((s) => s.addQuestionWithAi)
    const queryClient = useQueryClient()
    const handleSelect = (layoutType: LayoutOptions) => {
        switch (layoutType) {
            case "fill-in-the-blank":
                addQuestion({
                    hints: [],
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
    }

    return (
        <LayoutSelectDialog
            enableAi
            onSelect={handleSelect}
            onSelectWithAi={(layout, data) => {
                const aiQuestionType = layoutTypeToAiQuestionType[layout]
                const dataForStore = layoutTypeToStoreQuestionType[layout] || {}
                generateAddedQuestion({
                    storeData: dataForStore,
                    aiData: {
                        ...data,
                        questionType: aiQuestionType,
                    },
                    onError: () => {
                        toastError("Something went wrong.")
                    },
                }).then(() => {
                    queryClient.refetchQueries({
                        predicate: (query) =>
                            query.queryKey.includes("current-user"),
                    })
                })
            }}
            trigger={
                <div className="flex items-center">
                    <button
                        className={cn(
                            "h-full translate-y-1 min-h-[82px] flex items-center justify-center min-w-32 hover:cursor-pointer hover:bg-neutral-50 active:scale-95 transition-all border-dashed border-neutral-300 border-2 rounded-lg",
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
const layoutTypeToAiQuestionType = {
    "vertical-multiple-choice": "MULTIPLE_CHOICE_WITHOUT_IMAGE",
    "horizontal-multiple-choice": "MULTIPLE_CHOICE_WITHOUT_IMAGE",
    "matching-pairs": "MATCHING_PAIRS",
    "multiple-choice-without-image": "MULTIPLE_CHOICE_WITHOUT_IMAGE",
    "fill-in-the-blank": "FILL_IN_THE_BLANK",
} as const

const layoutTypeToStoreQuestionType = {
    "vertical-multiple-choice": {
        imageType: "normal-image",
        layout: "vertical",
        type: "MULTIPLE_CHOICE",
    },
    "horizontal-multiple-choice": {
        imageType: "normal-image",
        layout: "horizontal",
        type: "MULTIPLE_CHOICE",
    },
    "matching-pairs": {
        layout: "vertical",
        type: "MATCHING_PAIRS",
        imageType: "none",
    },
    "multiple-choice-without-image": {
        imageType: "none",
        layout: "vertical",
        type: "MULTIPLE_CHOICE",
    },
    "fill-in-the-blank": {
        imageType: "none",
        layout: "vertical",
        type: "FILL_IN_THE_BLANK",
    },
} as const
