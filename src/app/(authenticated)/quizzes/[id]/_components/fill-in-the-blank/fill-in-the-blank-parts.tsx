import { cn } from "@/lib/ui-utils"
import { useDroppable } from "@dnd-kit/core"
import { memo, ReactNode } from "react"
import { OptionIndex, PositionIndex } from "./fill-in-the-blank-question"
import FillInTheBlankItem from "./fill-in-the-blank-item"

interface TextWithBlanksProps {
    parts: string[]
    selected: Record<PositionIndex, OptionIndex | undefined>
    allOptions: { text: string; id: number }[]
    unselectOption: (id: number) => void
    incorrectItems: PositionIndex[]
    correctItems: PositionIndex[]
}

function TextWithBlanks({
    parts,
    selected,
    allOptions,
    unselectOption,
    incorrectItems,
    correctItems,
}: TextWithBlanksProps) {
    const BLANK_SEPARATOR = "........."

    const paragraphs = parts.join(BLANK_SEPARATOR).split("\n")

    const segments = paragraphs.map((paragraph, paragraphIndex) => ({
        paragraphIndex,
        segments: paragraph.split(BLANK_SEPARATOR),
    }))
    const geDropZoneIndex = (paragraphIndex: number, segmentIndex: number) => {
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
        <>
            {paragraphs.map((paragraph, paragraphIndex) => {
                const segments = paragraph.split(BLANK_SEPARATOR)

                return (
                    <div
                        key={`paragraph-${paragraphIndex}`}
                        className="max-w-[900px] px-3 md:px-0 "
                    >
                        {segments.map((segment, segmentIndex) => {
                            const dropZoneIndex = geDropZoneIndex(
                                paragraphIndex,
                                segmentIndex
                            )
                            const selectedItem = allOptions.find(
                                (opt) => opt.id === selected[dropZoneIndex]
                            )
                            return (
                                <span
                                    className="md:text-3xl sm:px-0  sm:text-2xl text-base lg:text-4xl font-bold text-neutral-600"
                                    key={`segment-${paragraphIndex}-${segmentIndex}`}
                                >
                                    <span className="h-16 !w-0 inline-flex opacity-0">
                                        .
                                    </span>
                                    {segment}
                                    {segmentIndex < segments.length - 1 && (
                                        <BlankField index={dropZoneIndex}>
                                            {selectedItem && (
                                                <FillInTheBlankItem
                                                    isCorrect={correctItems.includes(
                                                        dropZoneIndex
                                                    )}
                                                    isInCorrect={incorrectItems.includes(
                                                        dropZoneIndex
                                                    )}
                                                    isSelected={true}
                                                    id={selectedItem?.id}
                                                    text={selectedItem?.text}
                                                    handleRemoveBtn={() => {
                                                        unselectOption(
                                                            dropZoneIndex
                                                        )
                                                    }}
                                                />
                                            )}
                                        </BlankField>
                                    )}
                                </span>
                            )
                        })}
                    </div>
                )
            })}
        </>
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

export default memo(TextWithBlanks)
