"use client"

import { useLayoutEffect, useState } from "react"
import Confetti from "react-confetti"
import { useQuestionsStore } from "../store"
import ResultPage from "./result-page"

export default function Result() {
    const [windowDimensions, setWindowDimensions] = useState({
        width: 0,
        height: 0,
    })
    const savedResult = useQuestionsStore((s) => s.savedResult)

    useLayoutEffect(() => {
        setWindowDimensions({
            width: window.innerWidth,
            height: window.innerHeight,
        })
    }, [])

    return (
        <div className="flex min-h-screen justify-center pb-10   flex-col mt-2 max-w-4xl mx-auto px-4">
            <Confetti
                width={windowDimensions.width}
                height={windowDimensions.height}
                recycle={false}
                tweenDuration={3000}
                numberOfPieces={400}
                gravity={0.3}
            />

            <ResultPage
                correctQuestions={savedResult?.correctAnswers || 0}
                secondsSpent={savedResult?.secondsSpent || 0}
                xpGained={savedResult?.xpGained || 0}
            />
        </div>
    )
}
