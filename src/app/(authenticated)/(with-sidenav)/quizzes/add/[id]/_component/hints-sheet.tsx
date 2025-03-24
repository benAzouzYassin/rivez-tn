import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

import { cn } from "@/lib/ui-utils"

import {
    ChevronLeft,
    Lightbulb,
    LightbulbIcon,
    Loader2,
    PlusCircleIcon,
    SaveIcon,
    XCircleIcon,
} from "lucide-react"
import dynamic from "next/dynamic"
import { memo, useEffect, useMemo, useState } from "react"
import { QuizQuestionType } from "../store"
import GenerateHintDialog from "./generate-hint-dialog"
const RichTextEditor = dynamic(
    () => import("@/components/shared/rich-text-editor"),
    {
        loading: () => (
            <div className=" flex items-center justify-center w-full h-72">
                <Loader2 className="animate-spin duration-300 w-9 text-neutral-400 h-9" />
            </div>
        ),
        ssr: false,
    }
)
interface Props {
    hints: QuizQuestionType["hints"]
    setHints: (hints: Props["hints"]) => void
    selectedQuestion: QuizQuestionType
}
function HintsSheet(props: Props) {
    const [isAdding, setIsAdding] = useState(false)
    const [currentEditorContent, setCurrentEditorContent] = useState<string>("")
    const [displayedEditorContent, setDisplayedEditorContent] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [nameInputValue, setNameInputValue] = useState("")

    const startAddingHint = () => {
        setIsAdding(true)
    }

    const deleteHint = (id: string) => {
        props.setHints(props.hints.filter((hint) => hint.id !== id))
    }
    const handleBackBtn = () => {
        setSelectedId(null)
        setIsAdding(false)
    }

    const selectedHint = useMemo(
        () => props.hints.find((hint) => hint.id === selectedId),
        [props.hints, selectedId]
    )

    const saveHint = () => {
        props.setHints([
            ...props.hints,
            {
                content: currentEditorContent,
                id: crypto.randomUUID(),
                name: nameInputValue,
            },
        ])
        setNameInputValue("")
        setDisplayedEditorContent("")
        setCurrentEditorContent("")
        setIsAdding(false)
        setSelectedId(null)
    }
    const updateHint = () => {
        props.setHints(
            props.hints.map((hint) => ({
                ...hint,
                content: currentEditorContent,
                name: nameInputValue,
            }))
        )
        setNameInputValue("")
        setDisplayedEditorContent("")
        setCurrentEditorContent("")
        setIsAdding(false)
        setSelectedId(null)
    }

    useEffect(() => {
        if (selectedHint) {
            setDisplayedEditorContent(selectedHint.content || "")
            setCurrentEditorContent(selectedHint.content || "")
            setNameInputValue(selectedHint.name || "")
        }
    }, [selectedHint])

    const handleGenerateEnd = (content: string) => {
        setCurrentEditorContent(content)
        setDisplayedEditorContent(content)
    }
    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <button className="h-10 text-center hover:bg-blue-50 cursor-pointer active:scale-95 transition-all  text-blue-600/80 font-bold text-lg flex items-center justify-center fixed rounded-l-xl border-blue-500/70 top-44 border-r-0 right-0 w-20 gap-px border-2">
                    <Lightbulb className="w-6 h-6" />
                    Hint
                </button>
            </SheetTrigger>

            <SheetContent
                className={cn(
                    " min-w-[70vw] w-[70vw] p-0 transition-all overflow-hidden border-none bg-white px-0 "
                )}
            >
                <div className="flex flex-col h-full">
                    <SheetHeader className="p-4  ">
                        <SheetTitle asChild>
                            <div className="flex mt-3 items-center gap-3">
                                {(!!selectedId || isAdding) && (
                                    <Button
                                        onClick={handleBackBtn}
                                        variant={"secondary"}
                                    >
                                        <ChevronLeft className="w-5 h-5 stroke-3" />
                                        Back
                                    </Button>
                                )}
                                <p className="flex text-4xl  font-extrabold   items-center text-neutral-700 gap-2 ">
                                    Quiz Hints
                                </p>
                            </div>
                        </SheetTitle>
                    </SheetHeader>
                    <ScrollArea className="flex-1 px-4  ">
                        {(selectedId !== null || isAdding) && (
                            <div className="mt-5 relative">
                                <label
                                    className="pl-1 font-semibold"
                                    htmlFor="hint-name"
                                >
                                    Name
                                </label>
                                <Input
                                    value={nameInputValue}
                                    onChange={(e) =>
                                        setNameInputValue(e.target.value)
                                    }
                                    id="hint-name"
                                    className="h-14 w-full"
                                    placeholder="Hint name"
                                />
                                <GenerateHintDialog
                                    onGenerateEnd={handleGenerateEnd}
                                    question={props.selectedQuestion}
                                />
                                <RichTextEditor
                                    displayedEditorContent={
                                        displayedEditorContent
                                    }
                                    placeholder="Your hint content"
                                    onHtmlChange={setCurrentEditorContent}
                                    containerClassName=" "
                                    contentClassName="h-[calc(100vh-21rem)]"
                                />
                            </div>
                        )}
                        {selectedId === null && (
                            <div className="space-y-3 mt-8 pr-2">
                                {props.hints.length === 0 && !isAdding ? (
                                    <div className="mt-44 w-full flex flex-col items-center justify-center">
                                        <LightbulbIcon className="w-16 h-16 text-amber-300 mb-4" />
                                        <p className="text-2xl font-semibold text-neutral-400">
                                            No hints yet
                                        </p>
                                        <p className="text-neutral-400 mb-6">
                                            Add hints to help students solve
                                            problems
                                        </p>
                                        <Button
                                            onClick={startAddingHint}
                                            className="mt-2"
                                        >
                                            <PlusCircleIcon className="w-5 h-5 mr-2" />
                                            Create First Hint
                                        </Button>
                                    </div>
                                ) : (
                                    props.hints.map((hint) => (
                                        <Card
                                            onClick={() => {
                                                setSelectedId(hint.id)
                                            }}
                                            key={hint.id}
                                            className={`relative active:scale-95 rounded-2xl hover:bg-blue-100/70 pl-1 hover:border-blue-300 hover:shadow-blue-300 hover:pl-2 transition-all cursor-pointer  overflow-hidden`}
                                        >
                                            <CardContent className="px-2  rounded-2xl pt-5 pb-2 flex items-start gap-3">
                                                <LightbulbIcon className="!w-7 stroke-3 !h-7 text-amber-400 mt-0.5 flex-shrink-0" />
                                                <div className="flex-1 ">
                                                    <p className="text-lg text-neutral-600 max-w-[90%] font-bold">
                                                        {hint.name}
                                                    </p>
                                                </div>
                                                <button
                                                    className="p-2 h-auto  top-0 absolute right-0 text-red-400 cursor-pointer hover:scale-105 transition-all hover:text-red-500"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        deleteHint(hint.id)
                                                    }}
                                                >
                                                    <XCircleIcon className="!w-5 !h-5" />
                                                </button>
                                            </CardContent>
                                            <CardFooter className="pt-0 pb-2 px-3"></CardFooter>
                                        </Card>
                                    ))
                                )}
                            </div>
                        )}
                    </ScrollArea>

                    <SheetFooter className="p-2 border-t bg-gray-50">
                        {!isAdding && !selectedId && !!props.hints.length && (
                            <Button
                                onClick={startAddingHint}
                                className="h-14 text-lg"
                            >
                                <PlusCircleIcon className="!w-5 !h-5" />
                                Add New Hint
                            </Button>
                        )}
                        {isAdding && !selectedId && (
                            <Button onClick={saveHint} className="h-14 text-lg">
                                <SaveIcon className="!w-5 !h-5" />
                                Save Hint
                            </Button>
                        )}
                        {!!selectedId && (
                            <Button
                                onClick={updateHint}
                                className="h-14 text-lg"
                            >
                                <SaveIcon className="!w-5 !h-5" />
                                Save Hint modifications
                            </Button>
                        )}
                    </SheetFooter>
                </div>
            </SheetContent>
        </Sheet>
    )
}
export default memo(HintsSheet)
// TODO make the endpoint accept the type of the question and accept the content of the question
// TODO make the hints get the content of the question and the question and send it
