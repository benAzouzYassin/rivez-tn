import { cn } from "@/lib/ui-utils"
import { useDroppable } from "@dnd-kit/core"
import { memo, ReactNode } from "react"
import Item from "./item"
import { Trash2, X } from "lucide-react"
import useQuizStore, { FillInTheBlankStoreContent } from "../../store"
import EditText from "./edit-text"

interface Props {
    content: FillInTheBlankStoreContent
    questionId: string
}

function Parts({ content, questionId }: Props) {
    const BLANK_SEPARATOR = "___"

    const paragraphs = content.parts.join(BLANK_SEPARATOR).split("\n")
    const updateQuestion = useQuizStore((s) => s.updateQuestion)

    const segments = paragraphs.map((paragraph, paragraphIndex) => ({
        paragraphIndex,
        segments: paragraph.split(BLANK_SEPARATOR),
    }))
    const getItemIndex = (paragraphIndex: number, segmentIndex: number) => {
        let result = 0
        segments.forEach((item) => {
            if (item.paragraphIndex < paragraphIndex) {
                result += item.segments.length
            }
            if (item.paragraphIndex === paragraphIndex) {
                result += segmentIndex
            }
        })
        return result
    }
    return (
        <div className="mt-12 border-2 p-2 rounded-lg border-neutral-100    relative w-full min-h-56 max-w-[900px]">
            {paragraphs.map((paragraph, paragraphIndex) => {
                const segments = paragraph.split(BLANK_SEPARATOR)

                return (
                    <div
                        key={`paragraph-${paragraphIndex}`}
                        className="max-w-[900px] relative "
                    >
                        {segments.map((segment, segmentIndex) => {
                            // Find the selected item for this index
                            const itemIndex = getItemIndex(
                                paragraphIndex,
                                segmentIndex
                            )

                            const selectedItem = content.correct.find(
                                (item) => item.index === itemIndex
                            )

                            return (
                                <span
                                    className={cn(
                                        "text-4xl  relative font-bold group text-neutral-600"
                                    )}
                                    key={`segment-${paragraphIndex}-${segmentIndex}`}
                                >
                                    <span className="h-14 !w-0 inline-flex opacity-0">
                                        .
                                    </span>
                                    {segment}
                                    {segmentIndex < segments.length - 1 && (
                                        <BlankField
                                            index={getItemIndex(
                                                paragraphIndex,
                                                segmentIndex
                                            )}
                                        >
                                            {selectedItem && (
                                                <div className="group relative">
                                                    <button
                                                        onClick={() => {
                                                            updateQuestion(
                                                                {
                                                                    content: {
                                                                        correct:
                                                                            content.correct.filter(
                                                                                (
                                                                                    item
                                                                                ) =>
                                                                                    item.index !==
                                                                                    getItemIndex(
                                                                                        paragraphIndex,
                                                                                        segmentIndex
                                                                                    )
                                                                            ),
                                                                        options:
                                                                            [
                                                                                ...content.options,
                                                                                {
                                                                                    localId:
                                                                                        selectedItem.optionId,
                                                                                    text: selectedItem.option,
                                                                                },
                                                                            ],
                                                                        parts: content.parts,
                                                                    },
                                                                },
                                                                questionId
                                                            )
                                                        }}
                                                        className="bg-red-50 z-10 opacity-0 group-hover:opacity-100 transition-all active:scale-95 -right-2 cursor-pointer  absolute rounded-full border-2 p-px w-fit h-fit border-red-400/30"
                                                    >
                                                        <X className="text-red-400 w-4 h-4 stroke-3 " />
                                                    </button>
                                                    <Item
                                                        className="grow"
                                                        text={
                                                            selectedItem.option
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </BlankField>
                                    )}
                                </span>
                            )
                        })}
                    </div>
                )
            })}
            <EditText
                parts={content.parts}
                className={cn(
                    content.parts.length
                        ? "absolute  -top-4 -right-1"
                        : "w-28 h-20 flex items-center absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 justify-center"
                )}
                questionContent={content}
                questionId={questionId}
            />
        </div>
    )
}

function BlankField(props: { index: number; children: ReactNode }) {
    const { setNodeRef, isOver } = useDroppable({
        id: props.index,
    })
    return (
        <span
            ref={setNodeRef}
            className={cn(
                "h-14  border-b-4 mx-2  border-neutral-300 rounded-md mt-auto  min-w-24 inline-flex",
                {
                    "border-[3px]  rounded border-blue-400/40": isOver,
                    "border-white -translate-y-2": !!props.children,
                }
            )}
        >
            {props.children}
        </span>
    )
}

export default memo(Parts)
