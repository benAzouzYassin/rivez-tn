"use client"

import XpIcon from "@/components/icons/xp"
import { Button } from "@/components/ui/button"
import { useAtom } from "jotai"
import { motion } from "motion/react"
import { useLayoutEffect, useState } from "react"
import Confetti from "react-confetti"
import { questionsAtom, wrongAnswersIdsAtom } from "../atoms"
import Link from "next/link"

export default function Result() {
    const [questions] = useAtom(questionsAtom)
    const [wrongAnswersIds] = useAtom<string[]>(wrongAnswersIdsAtom)

    const totalQuestions: number = questions.length
    const wrongAnswers: number = wrongAnswersIds.length
    const correctAnswers: number = totalQuestions - wrongAnswers
    const score: number = Math.round((correctAnswers / totalQuestions) * 100)
    const xpEarned: number = Math.round(score * 2)

    const [windowDimensions, setWindowDimensions] = useState({
        width: 0,
        height: 0,
    })

    useLayoutEffect(() => {
        setWindowDimensions({
            width: window.innerWidth,
            height: window.innerHeight,
        })
    }, [])
    return (
        <div className="flex   flex-col mt-2 max-w-4xl mx-auto px-4">
            <Confetti
                width={windowDimensions.width}
                height={windowDimensions.height}
                recycle={false}
                tweenDuration={3000}
                numberOfPieces={400}
                gravity={0.3}
            />
            <motion.h1
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-5xl pt-10 text-[#ffae00] text-center font-extrabold"
            >
                Lesson completed! 🎉
            </motion.h1>

            <div className="mt-12 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ResultCard
                        title="TOTAL XP"
                        value={xpEarned}
                        icon={<XpIcon className="w-10 h-10" />}
                        color="text-[#ffae00]"
                        bgColor="bg-[#ff8c00c8]"
                    />
                    <ResultCard
                        title="Accuracy"
                        value={`${score}%`}
                        icon={
                            <img
                                src="/icons/accuracy.svg"
                                alt="Accuracy"
                                className="h-10 w-10"
                            />
                        }
                        color="text-[#3275c8]"
                        bgColor="bg-[#3275c8]/80"
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white p-6 border  rounded-2xl shadow-[0px_0px_10px] shadow-neutral-100"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <StatisticItem
                            icon="/icons/sign-question.svg"
                            label="Total Questions"
                            value={totalQuestions}
                        />
                        <StatisticItem
                            icon="/icons/sign-check.svg"
                            label="Correct Answers"
                            value={correctAnswers}
                        />
                        <StatisticItem
                            icon="/icons/sign-error.svg"
                            label="Wrong Answers"
                            value={wrongAnswers}
                        />
                        <StatisticItem
                            icon="/icons/monitor.svg"
                            label="Accuracy Rate"
                            value={`${score}%`}
                        />
                    </div>
                </motion.div>

                <Button
                    className="w-full h-14 text-2xl font-bold relative"
                    variant="blue"
                >
                    <Link
                        href={"/"}
                        className=" absolute top-0 left-0  w-full h-full flex items-center justify-center"
                    >
                        Continue
                    </Link>
                </Button>
            </div>
        </div>
    )
}
const StatisticItem = ({ label, value, icon }: StatisticItemProps) => (
    <div className="flex flex-col items-center p-4 border rounded-2xl hover:bg-gray-100 transition-colors">
        <div className="w-full flex items-center justify-between gap-4">
            <div className="flex flex-col">
                <span className="text-sm text-gray-500 font-medium">
                    {label}
                </span>
                <span className="text-2xl font-bold text-gray-900">
                    {value}
                </span>
            </div>
            <div className="h-12 w-12 rounded-full flex items-center justify-center">
                <img alt="" src={icon} className=" h-8 opacity-90 w-8" />
            </div>
        </div>
    </div>
)
const ResultCard: React.FC<ResultCardProps> = ({
    title,
    value,
    icon,
    color,
    bgColor,
}) => (
    <div className={`h-60 flex relative rounded-[40px] ${bgColor}`}>
        <p className="absolute font-extrabold text-2xl top-6 text-center text-white w-full">
            {title}
        </p>
        <div className="h-40 w-[97%] mx-auto flex items-center justify-center mb-2 mt-auto rounded-[35px] bg-white">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className={`font-extrabold text-4xl ${color} flex items-center gap-2`}
            >
                {icon}
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    {value}
                </motion.span>
            </motion.div>
        </div>
    </div>
)
interface ResultCardProps {
    title: string
    value: string | number
    icon: React.ReactNode
    color: string
    bgColor: string
}

interface StatisticItemProps {
    label: string
    value: string | number
    icon: string
}
