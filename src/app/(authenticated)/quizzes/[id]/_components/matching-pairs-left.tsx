import { Button } from "@/components/ui/button"
import { cn } from "@/lib/ui-utils"
import { memo, useEffect, useRef, useState } from "react"

interface Props {
    options: string[]
    onOptionClick: (opt: string) => void
    selectedOption: string | null
    wrongOptions: string[]
    correctSelections: string[]
    inCorrectSelections: string[][]
    readonly: boolean
}

function MatchingPairsLeft(props: Props) {
    return (
        <div className="flex flex-col gap-5 min-w-[200px] justify-center">
            {props.options.map((opt) => (
                <OptionButton
                    onClick={() => props.onOptionClick(opt)}
                    key={opt}
                    readonly={props.readonly}
                    optionText={opt}
                    isSelected={props.selectedOption === opt}
                    isSelectedCorrectly={props.correctSelections.includes(opt)}
                    incorrectSelections={props.inCorrectSelections}
                />
            ))}
        </div>
    )
}

export default memo(MatchingPairsLeft)

function OptionButton(props: {
    onClick: () => void
    optionText: string
    isSelected: boolean
    isSelectedCorrectly: boolean
    incorrectSelections: string[][]
    readonly: boolean
}) {
    const incorrectAnswerStyles =
        "incorrect-answer bg-red-200 hover:bg-red-200 hover:shadow-red-300/50 border-red-300/45 hover:border-red-300 hover:border-red-300/45 shadow-red-300!"
    const incorrectSelectionsHistory = useRef(props.incorrectSelections)
    const [isShowingIncorrectAnimation, setIsShowingIncorrectAnimation] =
        useState(false)

    useEffect(() => {
        let animationTimerId: any
        if (
            incorrectSelectionsHistory.current.length !==
            props.incorrectSelections.length
        ) {
            const latestIncorrectSelections =
                props.incorrectSelections[props.incorrectSelections.length - 1]
            if (latestIncorrectSelections.includes(props.optionText)) {
                setIsShowingIncorrectAnimation(true)
                animationTimerId = setTimeout(() => {
                    setIsShowingIncorrectAnimation(false)
                }, 700)
            }
            incorrectSelectionsHistory.current = props.incorrectSelections
        }

        return () => {
            clearTimeout(animationTimerId)
            setIsShowingIncorrectAnimation(false)
        }
    }, [props.incorrectSelections, props.optionText])

    const correctAnswerStyles =
        "correct-answer bg-green-200 hover:bg-green-200 hover:shadow-green-300/50 border-green-300/45 hover:border-green-300 hover:border-green-300/45 shadow-green-300"
    const hasAnimatedCorrectSelection = useRef(false)
    const [isShowingCorrectAnimation, setIsShowingCorrectAnimation] =
        useState(false)
    const [hasCompletedCorrectAnimation, setHasCompletedCorrectAnimation] =
        useState(false)

    useEffect(() => {
        let animationTimerId: any

        if (
            hasAnimatedCorrectSelection.current === false &&
            props.isSelectedCorrectly
        ) {
            setIsShowingCorrectAnimation(true)
            animationTimerId = setTimeout(() => {
                setIsShowingCorrectAnimation(false)
                setHasCompletedCorrectAnimation(true)
            }, 700)
            hasAnimatedCorrectSelection.current = true
        }
        return () => clearTimeout(animationTimerId)
    }, [props.isSelectedCorrectly])

    return (
        <Button
            onClick={() => {
                if (!props.readonly) {
                    props.onClick()
                }
            }}
            disabled={hasCompletedCorrectAnimation}
            variant={"secondary"}
            className={cn(
                "min-h-[65px] font-semibold  shadow-[0px_3px_0px_0px] py-4 h-fit transition-all duration-200 text-base text-neutral-700  hover:bg-neutral-100 hover:border-neutral-200 hover:shadow-neutral-200",
                {
                    "bg-sky-200 hover:bg-sky-200 hover:shadow-sky-300/50 border-sky-300/45 hover:border-sky-300/45  shadow-sky-300":
                        props.isSelected &&
                        !isShowingCorrectAnimation &&
                        !isShowingIncorrectAnimation,
                },
                { [correctAnswerStyles]: isShowingCorrectAnimation },
                { [incorrectAnswerStyles]: isShowingIncorrectAnimation }
            )}
        >
            <p className="max-w-[400px] text-wrap">{props.optionText}</p>
        </Button>
    )
}
