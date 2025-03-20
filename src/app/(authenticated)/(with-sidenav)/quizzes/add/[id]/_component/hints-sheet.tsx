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
    LightbulbIcon,
    PlusCircleIcon,
    SaveIcon,
    XCircleIcon,
} from "lucide-react"
import dynamic from "next/dynamic"
import { memo, useEffect, useMemo, useState } from "react"
import { QuizQuestionType } from "../store"
const RichTextEditor = dynamic(
    () => import("@/components/shared/rich-text-editor"),
    {
        ssr: false,
    }
)
interface Props {
    hints: QuizQuestionType["hints"]
    setHints: (hints: Props["hints"]) => void
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

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button
                    variant={"secondary"}
                    className=" fixed h-14 bottom-72 right-0 px-4 py-2 cursor-pointer shadow-sky-600 border-[#598bf0] hover:bg-blue-500 bg-[#598bf0] text-white rounded-r-none flex items-center gap-2 group"
                    aria-label="Show hint"
                >
                    <LightbulbIcon className="w-6 h-6" />
                    <span className="font-bold text-xl">Hints</span>
                </Button>
            </SheetTrigger>

            <SheetContent
                className={cn(
                    "w-96 min-w-[30vw] p-0 transition-all overflow-hidden border-none bg-white px-0 ",
                    {
                        "min-w-[70vw] w-[70vw]": !!selectedId || isAdding,
                    }
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
                            <div className="mt-5">
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
                                {props.hints.length === 0 ? (
                                    <div className="mt-44 w-full flex text-2xl font-semibold text-neutral-400 items-center justify-center">
                                        There is no hints...
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
                        {!isAdding && !selectedId && (
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
