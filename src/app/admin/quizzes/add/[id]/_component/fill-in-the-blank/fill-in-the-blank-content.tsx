import {
    closestCenter,
    defaultKeyboardCoordinateGetter,
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core"
import { restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers"
import useQuizStore, { FillInTheBlankStoreContent } from "../../store"
import { QuestionText } from "../question-text"
import Item from "./item"
import Options from "./options"
import Parts from "./parts"
import { useState } from "react"

export default function FillInTheBlankContentComp() {
    const [draggedItemData, setDraggedItemData] = useState<{
        text: string
        localId: string
    } | null>(null)
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: defaultKeyboardCoordinateGetter,
        })
    )

    const selectedQuestionId = useQuizStore((s) => s.selectedQuestionLocalId)
    const selectedQuestion = useQuizStore((s) => s.allQuestions).find(
        (q) => q.localId === selectedQuestionId
    )
    const updateQuestion = useQuizStore((s) => s.updateQuestion)
    const content =
        (selectedQuestion?.content as FillInTheBlankStoreContent) || undefined

    if (!selectedQuestion) {
        return null
    }
    return (
        <section className="w-full flex flex-col items-center min-h-56 mt-6  h-full  ">
            <div className="w-[1120px] flex flex-col items-center justify-center">
                <QuestionText
                    text={selectedQuestion.questionText}
                    localId={selectedQuestion?.localId}
                />
                <DndContext
                    onDragStart={(event) => {
                        const draggedId = event.active.id.toString() ?? null
                        const dragged = content.options.find(
                            (opt) => opt.localId === draggedId
                        )
                        setDraggedItemData(dragged || null)
                    }}
                    onDragEnd={(event) => {
                        const dropZoneIndex = event.over?.id
                        if (
                            dropZoneIndex === undefined ||
                            dropZoneIndex === null
                        ) {
                            return
                        }

                        const isDropZoneFilled = !!content.correct.find(
                            (item) =>
                                String(item.index) === String(dropZoneIndex)
                        )
                        if (isDropZoneFilled) {
                            return
                        }
                        updateQuestion(
                            {
                                content: {
                                    ...selectedQuestion.content,
                                    correct: [
                                        ...((content?.correct || []) as any),
                                        {
                                            index: dropZoneIndex,
                                            option: draggedItemData?.text,
                                            optionId: draggedItemData?.localId,
                                        },
                                    ],
                                    options: content.options.filter(
                                        (opt) =>
                                            opt.localId !==
                                            draggedItemData?.localId
                                    ),
                                    parts: content.parts,
                                },
                            },
                            selectedQuestionId || ""
                        )
                        setDraggedItemData(null)
                    }}
                    modifiers={[restrictToFirstScrollableAncestor]}
                    sensors={sensors}
                    collisionDetection={closestCenter}
                >
                    <Options
                        content={content}
                        questionId={selectedQuestionId || ""}
                    />
                    <Parts
                        content={content}
                        questionId={selectedQuestionId || ""}
                    />
                    <DragOverlay>
                        {String(draggedItemData) ? (
                            <Item text={draggedItemData?.text || ""} />
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div>
        </section>
    )
}
