import { cn } from "@/lib/ui-utils"
import { memo, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"

interface Props {
    options: string[]
    onOptionClick: (opt: string) => void
    selectedOption: string | null
    correctSelections: string[]
    inCorrectSelections: string[][]
    readonly: boolean
}

function MatchingPairsRight(props: Props) {
    return (
        <div
            onClick={() => {}}
            className="flex flex-col gap-5 min-w-[200px] justify-center"
        >
            {props.options.map((opt) => (
                <OptionButton
                    readonly={props.readonly}
                    onClick={() => props.onOptionClick(opt)}
                    key={opt}
                    optionText={opt}
                    isSelected={props.selectedOption === opt}
                    isSelectedCorrectly={props.correctSelections.includes(opt)}
                    incorrectSelections={props.inCorrectSelections}
                />
            ))}
        </div>
    )
}

export default memo(MatchingPairsRight)

function OptionButton(props: {
    onClick: () => void
    optionText: string
    isSelected: boolean
    isSelectedCorrectly: boolean
    incorrectSelections: string[][]
    readonly: boolean
}) {
    const incorrectAnswerStyles =
        "incorrect-answer bg-red-200 hover:bg-red-200 hover:shadow-red-300/50 border-red-300/45 hover:border-red-300 hover:border-red-300/45 shadow-red-300! dark:bg-red-900/40 dark:hover:bg-red-900/60 dark:border-red-700 dark:shadow-red-900/40"
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
        "correct-answer bg-green-200 hover:bg-green-200 hover:shadow-green-300/50 border-green-300/45 hover:border-green-300 hover:border-green-300/45 shadow-green-300 dark:bg-green-900/60 dark:hover:bg-green-900/60 dark:border-green-700 dark:shadow-green-700/40"

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
            }, 710)
            hasAnimatedCorrectSelection.current = true
        }
        return () => clearTimeout(animationTimerId)
    }, [props.isSelectedCorrectly])
    return (
        <Button
            id={props.optionText}
            variant={"secondary"}
            disabled={hasCompletedCorrectAnimation}
            onClick={() => {
                if (!props.readonly) {
                    props.onClick()
                }
            }}
            className={cn(
                // Base styles
                "min-h-[65px] font-semibold py-4 shadow-[0px_3px_0px_0px] h-fit transition-all duration-200 text-base text-neutral-700 hover:bg-neutral-100 hover:border-neutral-200 hover:shadow-neutral-200",
                // Dark mode base
                "dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700 dark:hover:border-neutral-700 dark:hover:shadow-neutral-800 dark:border-neutral-700  transition-colors",
                // Selected (sky) styles
                {
                    "bg-sky-200 hover:bg-sky-200 hover:shadow-sky-300/50 border-sky-300/45 hover:border-sky-300 shadow-sky-300 dark:bg-sky-900/40 dark:hover:bg-sky-900/60 dark:border-sky-700 dark:shadow-sky-900/40":
                        props.isSelected &&
                        !isShowingCorrectAnimation &&
                        !isShowingIncorrectAnimation,
                },
                // Correct/Incorrect animation styles
                { [correctAnswerStyles]: isShowingCorrectAnimation },
                { [incorrectAnswerStyles]: isShowingIncorrectAnimation }
            )}
        >
            <p className="max-w-[600px] text-wrap">{props.optionText}</p>
        </Button>
    )
}
