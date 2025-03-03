import { cn } from "@/lib/ui-utils"
import { useDroppable } from "@dnd-kit/core"
import { memo, ReactNode } from "react"
import { OptionId, PositionIndex } from "./fill-in-the-blank-question"
import FillInTheBlankItem from "./fill-in-the-blank-item"

interface TextWithBlanksProps {
    parts: string[]
    selected: Record<PositionIndex, OptionId | undefined>
    allOptions: { text: string; id: number }[]
    unselectOption: (id: number) => void
}

function TextWithBlanks({
    parts,
    selected,
    allOptions,
    unselectOption,
}: TextWithBlanksProps) {
    const BLANK_SEPARATOR = "........."

    const paragraphs = parts.join(BLANK_SEPARATOR).split("\n")
    return (
        <>
            {paragraphs.map((paragraph, paragraphIndex) => {
                const segments = paragraph.split(BLANK_SEPARATOR)

                return (
                    <div
                        key={`paragraph-${paragraphIndex}`}
                        className="max-w-[900px] "
                    >
                        {segments.map((segment, segmentIndex) => {
                            const selectedItem = allOptions.find(
                                (opt) => opt.id === selected[segmentIndex]
                            )
                            return (
                                <span
                                    className="text-4xl font-bold text-neutral-600"
                                    key={`segment-${paragraphIndex}-${segmentIndex}`}
                                >
                                    <span className="h-12 inline-flex"></span>
                                    {segment}
                                    {segmentIndex < segments.length - 1 && (
                                        <BlankField index={segmentIndex}>
                                            {selectedItem && (
                                                <FillInTheBlankItem
                                                    isSelected={true}
                                                    id={selectedItem?.id}
                                                    text={selectedItem?.text}
                                                    handleRemoveBtn={() => {
                                                        unselectOption(
                                                            segmentIndex
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
                "h-14  border-b-4 mx-2 border-neutral-300 rounded-md mt-auto  min-w-24 inline-flex",
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
