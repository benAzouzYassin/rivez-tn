"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface Props {
    text: string
    enableBlob?: boolean
}
export default function GeneralLoadingScreen(props: Props) {
    const [progress, setProgress] = useState(0)
    const [loading, setLoading] = useState(true)
    const initialTimestamp = useRef(Date.now())
    const animationFrame = useRef<number>(null)

    useEffect(() => {
        const simulateTopLoader = () => {
            const now = Date.now()
            const elapsedMs = now - initialTimestamp.current

            if (elapsedMs < 3500) {
                setProgress(Math.min(25, elapsedMs / 140))
            } else if (elapsedMs < 9500) {
                const additionalProgress = (elapsedMs - 3500) / 300
                setProgress(Math.min(45, 25 + additionalProgress))
            } else if (elapsedMs < 17500) {
                const additionalProgress = (elapsedMs - 9500) / 400
                setProgress(Math.min(65, 45 + additionalProgress))
            } else if (elapsedMs < 27500) {
                const additionalProgress = (elapsedMs - 17500) / 666.67
                setProgress(Math.min(80, 65 + additionalProgress))
            } else if (elapsedMs < 39500) {
                const additionalProgress = (elapsedMs - 27500) / 800
                setProgress(Math.min(95, 80 + additionalProgress))
            } else if (elapsedMs < 45000) {
                const additionalProgress = (elapsedMs - 39500) / 1100
                setProgress(Math.min(98, 95 + additionalProgress))
            } else {
                setProgress(100)
                setLoading(false)
                return
            }

            animationFrame.current = requestAnimationFrame(simulateTopLoader)
        }

        animationFrame.current = requestAnimationFrame(simulateTopLoader)

        return () => {
            if (animationFrame.current) {
                cancelAnimationFrame(animationFrame.current)
            }
        }
    }, [])

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    }

    const circleVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
            },
        },
    }
    if (props.enableBlob) {
        return <LoadingBlob text={props.text} />
    }
    return (
        <motion.main
            className="min-h-[70vh] flex items-center justify-center bg-white dark:bg-neutral-900  transition-colors"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.div
                className="flex flex-col -translate-y-20 items-center justify-center"
                variants={containerVariants}
            >
                <motion.div
                    className="mt-5 flex flex-col items-center gap-3"
                    variants={containerVariants}
                >
                    <motion.div
                        className="relative w-screen flex items-center justify-center gap-2"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div
                            className="relative"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                            }}
                        >
                            <div className="relative w-56 h-56">
                                <div className="absolute w-56 h-56 rounded-full"></div>
                                <svg
                                    className="absolute w-56 h-56"
                                    viewBox="0 0 100 100"
                                >
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="38"
                                        fill="white"
                                        className="dark:fill-[#232946]"
                                        stroke="url(#blueGradient)"
                                        strokeWidth="8"
                                        strokeDasharray="239.5"
                                        strokeDashoffset={
                                            239.5 -
                                            (239.5 * Math.min(progress, 99)) /
                                                100
                                        }
                                        strokeLinecap="round"
                                        transform="rotate(-90 50 50)"
                                    />
                                    <defs>
                                        <linearGradient
                                            id="blueGradient"
                                            x1="0%"
                                            y1="0%"
                                            x2="100%"
                                            y2="0%"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#93c5fd"
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor="#3b82f6"
                                            />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute text-3xl font-extrabold text-neutral-500 dark:text-blue-200 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    {Math.round(progress)}%{" "}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.main>
    )
}

function LoadingBlob(props: { text: string }) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    }

    const pulseVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: [0.3, 0.6, 0.3],
            scale: [0.8, 1, 0.8],
            transition: {
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
            },
        },
    }

    const circleVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
            },
        },
    }

    return (
        <motion.main
            className="min-h-[70vh] flex items-center justify-center bg-white   dark:bg-neutral-900 transition-colors"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.div
                className="flex flex-col -translate-y-20 items-center justify-center"
                variants={containerVariants}
            >
                {props.text !== null && (
                    <motion.h2
                        className="text-5xl pb-1 flex items-end font-black text-transparent bg-clip-text bg-gradient-to-r from-neutral-600 to-neutral-800 dark:from-blue-200 dark:to-blue-400"
                        variants={circleVariants}
                    >
                        {props.text || "Loading "}{" "}
                        <div className="flex items-center gap-1 -translate-y-2 ml-1">
                            <div className="w-3 h-3 bg-neutral-700 dark:bg-blue-300 rounded-full"></div>
                            <div className="w-3 h-3 bg-neutral-700 dark:bg-blue-400 rounded-full"></div>
                            <div className="w-3 h-3 bg-neutral-700 dark:bg-blue-500 rounded-full"></div>
                        </div>
                    </motion.h2>
                )}
                <motion.div
                    className="mt-5 flex flex-col items-center gap-3"
                    variants={containerVariants}
                >
                    <motion.div
                        className="relative w-screen flex items-center justify-center gap-2"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div
                            className="relative"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                            }}
                        >
                            {/* Pulsing circles with blue gradients for dark mode */}
                            <motion.div
                                className="absolute left-1/2 -translate-x-1/2 top-0 w-24 h-24 bg-gradient-to-r from-blue-300 to-blue-300 dark:from-blue-900 dark:to-blue-900 rounded-full blur-sm"
                                variants={pulseVariants}
                            />
                            <motion.div
                                className="absolute left-1/2 -translate-x-1/2 top-0 w-24 h-24 bg-gradient-to-r from-blue-300 to-blue-400 dark:from-blue-800 dark:to-blue-700 rounded-full blur-sm"
                                variants={pulseVariants}
                                style={{ animationDelay: "0.3s" }}
                            />
                            <motion.div
                                className="absolute left-1/2 -translate-x-1/2 top-0 w-24 h-24 bg-gradient-to-r from-blue-400 to-blue-500 dark:from-blue-700 dark:to-blue-500 rounded-full blur-sm"
                                variants={pulseVariants}
                                style={{ animationDelay: "0.6s" }}
                            />
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.main>
    )
}
