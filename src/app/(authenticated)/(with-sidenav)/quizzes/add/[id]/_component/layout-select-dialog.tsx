import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/ui-utils"
import { ChevronLeft, Edit, Sparkles } from "lucide-react"
import { ReactNode, useRef, useState } from "react"
import FillInTheBlank from "./layouts-icons/fill-in-the-blank"
import MatchingPairs from "./layouts-icons/matching-pairs"
import MultipleChoiceHorizontal from "./layouts-icons/multiple-choice-horizontal"
import MultipleChoiceVertical from "./layouts-icons/multiple-choice-vertical"
import { Store } from "../store"
import AddQuestionWithAiForm from "./add-question-with-ai-form"
import { wait } from "@/utils/wait"

type Props = {
    contentClassName?: string
    trigger: ReactNode
    onSelect: (layoutType: LayoutOptions) => void
    enableAi?: boolean
    onSelectWithAi?: (
        layoutType: LayoutOptions,
        data: Omit<
            Parameters<Store["addQuestionWithAi"]>["0"]["data"],
            "questionType"
        >
    ) => void
}

export default function LayoutSelectDialog(props: Props) {
    const [isOpen, setIsOpen] = useState(false)
    const [tab, setTab] = useState<"layout-select" | "mode-select" | "ai-form">(
        "layout-select"
    )
    const selectedLayout = useRef<LayoutOptions>(null)
    const handleLayoutSelect = (layout: LayoutOptions) => {
        if (props.enableAi) {
            selectedLayout.current = layout
            setTab("mode-select")
        } else {
            props.onSelect(layout)
            setIsOpen(false)
        }
    }
    const handleModeSelect = (mode: "ai" | "custom") => {
        if (mode === "custom") {
            setIsOpen(false)
            wait(100).then(() => {
                setTab("layout-select")
                props.onSelect?.(selectedLayout.current!)
                selectedLayout.current = null
            })
        }
        if (mode === "ai") {
            setTab("ai-form")
        }
    }
    return (
        <Dialog onOpenChange={setIsOpen} open={isOpen}>
            <DialogTrigger asChild>{props.trigger}</DialogTrigger>
            <DialogContent
                className={cn(
                    " rounded-xl  transition-all  pb-6 overflow-hidden border  max-w-[1000px] ",
                    props.contentClassName,
                    {
                        "w-fit": tab === "mode-select",
                    }
                )}
            >
                <div className="p-4 bg-muted">
                    <DialogTitle className="text-center  pb-3 text-neutral-500 font-extrabold text-3xl">
                        {tab === "layout-select"
                            ? "Select a question layout"
                            : "Do you want to use ai ?"}
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </div>
                {tab === "ai-form" && (
                    <AddQuestionWithAiForm
                        onBackClick={() => setTab("mode-select")}
                        onSubmit={(data) => {
                            setIsOpen(false)
                            props.onSelectWithAi?.(
                                selectedLayout.current!,
                                data
                            )
                            wait(100).then(() => {
                                setTab("layout-select")
                                selectedLayout.current = null
                            })
                        }}
                    />
                )}
                {tab === "mode-select" && (
                    <div className="grid relative   grid-cols-2 mx-auto py-3 gap-6 w-full max-w-2xl">
                        <Button
                            onClick={() => setTab("layout-select")}
                            className="absolute -top-24 text-base "
                            variant={"secondary"}
                        >
                            <ChevronLeft className="!w-5 -mr-1 stroke-3 !h-5" />
                            Back
                        </Button>
                        <Card
                            onClick={() => handleModeSelect("ai")}
                            asButton
                            className="cursor-pointer active:translate-y-1 active:shadow-none hover:bg-neutral-100 border-3   transition-all group overflow-hidden relative"
                        >
                            <CardContent className="flex flex-col items-center justify-center p-6 h-56">
                                <div className="bg-blue-100 rounded-full p-3 mb-4">
                                    <Sparkles className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform" />
                                </div>
                                <p className="text-2xl font-bold text-blue-500 mb-2">
                                    Use AI
                                </p>
                                <p className="text-base text-neutral-500 font-medium text-center mb-3">
                                    Generate content automatically with our
                                    smart assistant
                                </p>
                            </CardContent>
                        </Card>

                        <Card
                            onClick={() => handleModeSelect("custom")}
                            asButton
                            className="cursor-pointer  active:translate-y-1 active:shadow-none border-3  hover:bg-neutral-100  transition-all group overflow-hidden relative"
                        >
                            <CardContent className="flex flex-col items-center justify-center p-6 h-56">
                                <div className="bg-gray-100 rounded-full p-3 mb-4">
                                    <Edit className="h-6 w-6 text-neutral-600 group-hover:scale-110 transition-transform" />
                                </div>
                                <p className="text-2xl font-bold text-neutral-700 mb-2">
                                    Custom
                                </p>
                                <p className="text-base text-neutral-500 font-medium text-center mb-3">
                                    Create your own content with our editing
                                    tools
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}
                {tab === "layout-select" && (
                    <>
                        <div className="p-0">
                            <div className="p-0 grid gap-5 grid-cols-3">
                                <div className="fle flex-col items-center justify-center">
                                    <h3 className="text-base font-bold text-neutral-500 text-center ">
                                        Image on left, options on right
                                    </h3>
                                    <div
                                        onClick={() => {
                                            handleLayoutSelect(
                                                "horizontal-multiple-choice"
                                            )
                                        }}
                                        className="ml-auto mt-1 flex items-center justify-center"
                                    >
                                        <MultipleChoiceHorizontal
                                            imageClassName="h-[140px] w-[130px] ml-2 mt-6"
                                            itemClassName="h-7 mt-1 first:mt-5 w-[110px]"
                                            className="!w-[290px] h-[210px]"
                                        />
                                    </div>
                                </div>
                                <div
                                    className="flex flex-col items-center justify-center"
                                    onClick={() => {
                                        handleLayoutSelect(
                                            "vertical-multiple-choice"
                                        )
                                    }}
                                >
                                    <h3 className="text-base font-bold text-neutral-500 text-center ">
                                        Image on the top, options on bottom
                                    </h3>

                                    <MultipleChoiceVertical
                                        textClassName="hidden"
                                        imageClassName="h-20 w-[90%] mx-auto mt-4"
                                        itemClassName="h-7 mt-1 w-[85%] odd:ml-4 even:ml-1"
                                        className="!w-[310px] h-[210px]"
                                    />
                                </div>
                                <div
                                    className="flex flex-col items-center justify-center"
                                    onClick={() => {
                                        handleLayoutSelect("matching-pairs")
                                    }}
                                >
                                    <h3 className="text-base font-bold text-neutral-500 text-center ">
                                        Terms on left, definitions on right
                                    </h3>

                                    <MatchingPairs
                                        itemClassName="h-6 mt-1"
                                        className="!w-[290px] pt-4 px-5 h-[210px]"
                                    />
                                </div>
                                <div
                                    className="flex flex-col items-center justify-center"
                                    onClick={() => {
                                        handleLayoutSelect(
                                            "multiple-choice-without-image"
                                        )
                                    }}
                                >
                                    <h3 className="text-base font-bold text-neutral-500 text-center ">
                                        Options without an image.
                                    </h3>

                                    <MultipleChoiceVertical
                                        textClassName="mb-7 mt-8"
                                        imageClassName="hidden"
                                        itemClassName="h-8  mt-1 w-[85%] odd:ml-4 even:ml-1"
                                        className="!w-[310px] h-[210px]"
                                    />
                                </div>
                                <div
                                    className="flex flex-col items-center justify-center"
                                    onClick={() => {
                                        handleLayoutSelect("fill-in-the-blank")
                                    }}
                                >
                                    <h3 className="text-base font-bold text-neutral-500 text-center ">
                                        Fill in the blank.
                                    </h3>

                                    <FillInTheBlank
                                        isMinimized={false}
                                        questionTextClassName="mb-7 mt-8"
                                        className="!w-[310px] h-[210px]"
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
export type LayoutOptions =
    | "vertical-multiple-choice"
    | "horizontal-multiple-choice"
    | "matching-pairs"
    | "multiple-choice-without-image"
    | "fill-in-the-blank"
