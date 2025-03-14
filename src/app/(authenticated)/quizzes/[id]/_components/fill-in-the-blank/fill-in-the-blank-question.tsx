import ConfirmationBanner from "../confirmation-banner"
import CorrectAnswerBanner from "../correct-answer-banner"
import WrongAnswerBanner from "../wrong-answer-banner"
import { QuestionType, useQuestionsStore } from "../../store"
import { useCurrentUser } from "@/hooks/use-current-user"
import { toastError } from "@/lib/toasts"
import { FillInTheBlankContent } from "@/schemas/questions-content"
import { restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers"

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
import { useQueryClient } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import FillInTheBlankItem from "./fill-in-the-blank-item"
import FillInTheBlankOptions from "./fill-in-the-blank-options"
import FillInTheBlankParts from "./fill-in-the-blank-parts"

type Props = {
    question: { content: FillInTheBlankContent } & QuestionType
    questionsCount: number
}

export default function FillInTheBlankQuestion(props: Props) {
    const [results, setResults] = useState({
        wrong: [] as { index: number; option: string | null }[],
        correct: [] as { index: number; option: string | null }[],
    })
    const [selected, setSelected] = useState<
        Record<PositionIndex, OptionIndex | undefined>
    >({})
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: defaultKeyboardCoordinateGetter,
        })
    )

    const [renderDate, setRenderDate] = useState(new Date())
    const queryClient = useQueryClient()
    useEffect(() => {
        setRenderDate(new Date())
        if (window !== undefined) {
            window.scroll({
                behavior: "smooth",
                top: 0,
            })
        }
    }, [props.question])
    const user = useCurrentUser()
    const params = useParams()
    const quizId = params["id"] as string
    const currentQuestionIndex = useQuestionsStore(
        (s) => s.currentQuestionIndex
    )
    const incrementQuestionIndex = useQuestionsStore(
        (s) => s.incrementQuestionIndex
    )
    const handleFailedQuestions = useQuestionsStore(
        (s) => s.addFailedQuestionIds
    )
    const handleSkippedQuestions = useQuestionsStore(
        (s) => s.addSkippedQuestionIds
    )
    const handleQuizFinish = useQuestionsStore((s) => s.handleQuizFinish)
    const addAnswerToState = useQuestionsStore((s) => s.addAnswer)

    const [isCorrectBannerOpen, setIsCorrectBannerOpen] = useState(false)
    const [isWrongBannerOpen, setIsWrongBannerOpen] = useState(false)

    const handleNextQuestion = () => {
        if (currentQuestionIndex === props.questionsCount - 1) {
            if (user.data?.id) {
                handleQuizFinish({ quizId, userId: user.data.id }).then(
                    (success) => {
                        if (success) {
                            queryClient.invalidateQueries({
                                predicate: (query) =>
                                    query.queryKey.some((key) =>
                                        [
                                            "quiz_submissions",
                                            "current-user",
                                        ].includes(key as string)
                                    ),
                            })
                        } else {
                            toastError("Something went wrong.")
                        }
                    }
                )
            } else {
                return toastError("Something went wrong.")
            }
        }

        setSelected([])
        incrementQuestionIndex()
        setIsCorrectBannerOpen(false)
        setResults({
            wrong: [],
            correct: [],
        })
    }

    const handleWrongAnswer = () => {
        handleFailedQuestions([props.question.id])

        addAnswerToState({
            questionId: props.question.id,
            questionType: "FILL_IN_THE_BLANK",
            responses: results,
            failedAttempts: null,
            secondsSpent: (new Date().getTime() - renderDate.getTime()) / 1000,
        })
        if (currentQuestionIndex === props.questionsCount - 1) {
            if (user.data?.id) {
                handleQuizFinish({ quizId, userId: user.data.id }).then(
                    (success) => {
                        if (success) {
                            queryClient.invalidateQueries({
                                predicate: (query) =>
                                    query.queryKey.some((key) =>
                                        [
                                            "quiz_submissions",
                                            "current-user",
                                        ].includes(key as string)
                                    ),
                            })
                        } else {
                            toastError("Something went wrong.")
                        }
                    }
                )
            } else {
                return toastError("Something went wrong.")
            }
        }
        setSelected([])
        incrementQuestionIndex()
        setIsWrongBannerOpen(false)
        setResults({
            wrong: [],
            correct: [],
        })
    }
    const allOptions = props.question.content.options.map((opt, i) => {
        return { text: opt, id: i }
    })

    const [activeDraggedId, setActiveDraggedId] = useState<number | null>(null)
    return (
        <>
            <div className="flex flex-col relative h-fit items-center justify-center">
                <div>
                    <p className="max-w-[1200px] mb-1 pt-5 text-4xl text-center font-extrabold top-0 text-neutral-700  w-full left-0">
                        {props.question?.question ||
                            "Fill in the blank with the correct options :"}{" "}
                    </p>
                    <div className="  transition-all ">
                        <DndContext
                            onDragStart={(event) =>
                                setActiveDraggedId(
                                    Number(event.active.id.toString()) ?? null
                                )
                            }
                            onDragEnd={(event) => {
                                setActiveDraggedId(null)
                                const optionId = Number(event.active.id)

                                if (event.over?.id === "non-selected-options") {
                                    // we unselect th item if it is returned to the list of non selected options
                                    const positionToRemove = Object.entries(
                                        selected
                                    ).find(
                                        ([, opt]) =>
                                            !isNaN(optionId) && opt === optionId
                                    )?.[0]

                                    if (!isNaN(Number(positionToRemove))) {
                                        setSelected({
                                            ...selected,
                                            [Number(positionToRemove)]:
                                                undefined,
                                        })
                                    }
                                    return
                                }

                                const dropZoneId = Number(event.over?.id)
                                if (!isNaN(dropZoneId) && !isNaN(optionId)) {
                                    const isDropZoneEmpty =
                                        selected[Number(dropZoneId)] ===
                                            undefined ||
                                        selected[Number(dropZoneId)] === null

                                    if (!isDropZoneEmpty) return

                                    const oldDropZone = Number(
                                        Object.entries(selected).find(
                                            ([, currOpt]) =>
                                                currOpt === optionId
                                        )?.[0]
                                    )

                                    setSelected(
                                        isNaN(oldDropZone)
                                            ? {
                                                  ...selected,
                                                  [dropZoneId]: optionId,
                                              }
                                            : {
                                                  ...selected,
                                                  [oldDropZone]: undefined,
                                                  [dropZoneId]: optionId,
                                              }
                                    )
                                }
                            }}
                            modifiers={[restrictToFirstScrollableAncestor]}
                            sensors={sensors}
                            collisionDetection={closestCenter}
                        >
                            <div
                                key={currentQuestionIndex}
                                className="max-w-[900px] min-h-[70px]  transition-all min-w-[700px] flex-wrap justify-start items-center mt-12  w-full flex"
                            >
                                <FillInTheBlankOptions
                                    options={allOptions.filter(
                                        (opt) =>
                                            !Object.values(selected).includes(
                                                opt.id
                                            )
                                    )}
                                />
                            </div>
                            <div className="max-w-[900px] transition-all pb-56  min-w-[700px] flex-wrap justify-start items-center mt-2  w-full">
                                <FillInTheBlankParts
                                    incorrectItems={results.wrong.map(
                                        (item) => item.index
                                    )}
                                    correctItems={results.correct.map(
                                        (item) => item.index
                                    )}
                                    unselectOption={(position) => {
                                        setSelected({
                                            ...selected,
                                            [position]: undefined,
                                        })
                                    }}
                                    allOptions={allOptions}
                                    selected={selected}
                                    parts={props.question.content.parts}
                                />
                            </div>
                            <DragOverlay>
                                {String(activeDraggedId) ? (
                                    <FillInTheBlankItem
                                        text={
                                            props.question.content.options.find(
                                                (_, i) =>
                                                    Number(activeDraggedId) ===
                                                    i
                                            ) || ""
                                        }
                                        id={Number(activeDraggedId)}
                                    />
                                ) : null}
                            </DragOverlay>
                        </DndContext>
                    </div>
                </div>
            </div>

            <ConfirmationBanner
                onSkip={() => {
                    handleSkippedQuestions([props.question.id])
                    addAnswerToState({
                        questionId: props.question.id,
                        questionType: "FILL_IN_THE_BLANK",
                        responses: {
                            correct: [],
                            wrong: [],
                        },
                        failedAttempts: null,
                        secondsSpent:
                            (new Date().getTime() - renderDate.getTime()) /
                            1000,
                    })
                    handleNextQuestion()
                }}
                actionType={
                    Object.values(selected).filter((item) => item !== undefined)
                        .length === props.question.content.correct.length
                        ? "confirm"
                        : "skip"
                }
                onConfirm={() => {
                    const correctContent = props.question.content.correct
                    const populatedSelected = Object.entries(selected).map(
                        ([position, optionIndex]) => {
                            return {
                                index: Number(position),
                                option:
                                    optionIndex !== undefined
                                        ? props.question.content.options[
                                              optionIndex
                                          ]
                                        : null,
                            }
                        }
                    )

                    const groupedItems = populatedSelected.reduce(
                        (acc, curr) => {
                            const correctOption = correctContent.find(
                                (item) => item.index === curr.index
                            )?.option
                            if (curr.option === correctOption) {
                                return {
                                    wrong: acc.wrong,
                                    correct: [...acc.correct, curr],
                                }
                            }
                            return {
                                wrong: [...acc.wrong, curr],
                                correct: acc.correct,
                            }
                        },
                        {
                            correct: [] as typeof populatedSelected,
                            wrong: [] as typeof populatedSelected,
                        }
                    )
                    setResults(groupedItems)
                    const isAllCorrect =
                        groupedItems.correct.length ===
                        props.question.content.correct.length
                    if (isAllCorrect) {
                        return setIsCorrectBannerOpen(true)
                    } else {
                        return setIsWrongBannerOpen(true)
                    }
                }}
                isOpen={true}
            />
            <CorrectAnswerBanner
                onNextClick={() => {
                    addAnswerToState({
                        questionId: props.question.id,
                        questionType: "FILL_IN_THE_BLANK",
                        responses: results,
                        failedAttempts: null,
                        secondsSpent:
                            (new Date().getTime() - renderDate.getTime()) /
                            1000,
                    })
                    handleNextQuestion()
                }}
                isOpen={isCorrectBannerOpen}
            />
            <WrongAnswerBanner
                onNextClick={handleWrongAnswer}
                isOpen={isWrongBannerOpen}
            />
        </>
    )
}

export type OptionIndex = number
export type PositionIndex = number
