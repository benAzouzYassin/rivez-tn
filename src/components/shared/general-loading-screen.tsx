"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface Props {
    text: string
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

            if (elapsedMs < 2000) {
                setProgress(Math.min(30, elapsedMs / 66.67))
            } else if (elapsedMs < 5000) {
                const additionalProgress = (elapsedMs - 2000) / 150
                setProgress(Math.min(50, 30 + additionalProgress))
            } else if (elapsedMs < 10000) {
                const additionalProgress = (elapsedMs - 5000) / 250
                setProgress(Math.min(70, 50 + additionalProgress))
            } else if (elapsedMs < 15000) {
                const additionalProgress = (elapsedMs - 10000) / 333.33
                setProgress(Math.min(85, 70 + additionalProgress))
            } else if (elapsedMs < 20000) {
                const additionalProgress = (elapsedMs - 15000) / 500
                setProgress(Math.min(95, 85 + additionalProgress))
            } else if (elapsedMs < 25000) {
                const additionalProgress = (elapsedMs - 20000) / 1666.67
                setProgress(Math.min(98, 95 + additionalProgress))
            } else {
                setProgress(99)
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

    return (
        <motion.main
            className="min-h-[70vh] flex items-center justify-center bg-white"
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
                                        fill="#f5f5f5"
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
                                            />{" "}
                                            <stop
                                                offset="100%"
                                                stopColor="#3b82f6"
                                            />{" "}
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute text-3xl font-extrabold text-neutral-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
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
