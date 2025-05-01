"use client"

import { getLanguage } from "@/utils/get-language"
import { motion } from "framer-motion"
import { useMemo } from "react"

export default function ResultLoadingPage() {
    const translation = useMemo(
        () => ({
            en: { "Processing answers": "Processing answers" },
            fr: { "Processing answers": "Traitement des réponses" },
            ar: { "Processing answers": "جاري معالجة الإجابات" },
        }),
        []
    )
    const lang = getLanguage()
    const t = translation[lang]
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
            className="min-h-[70vh] flex items-center justify-center bg-white dark:bg-neutral-900 transition-colors px-4"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.div
                className="flex flex-col items-center justify-center md:-translate-y-20 sm:-translate-y-10 -translate-y-6 w-full max-w-3xl"
                variants={containerVariants}
            >
                <motion.h2
                    className="text-3xl md:text-4xl lg:text-5xl pb-1 flex flex-wrap justify-center items-end font-black text-transparent bg-clip-text bg-gradient-to-r from-neutral-600 to-neutral-800 dark:from-neutral-200 dark:to-neutral-400 transition-colors"
                    variants={circleVariants}
                >
                    <span className="dark:text-neutral-100 text-neutral-900 transition-colors">
                        {t["Processing answers"]}
                    </span>
                    <div className="flex items-center gap-1 -translate-y-1 md:-translate-y-2 ml-1">
                        <div className="w-2 h-2 md:w-3 md:h-3 bg-neutral-700 dark:bg-neutral-200 rounded-full transition-colors"></div>
                        <div className="w-2 h-2 md:w-3 md:h-3 bg-neutral-700 dark:bg-neutral-300 rounded-full transition-colors"></div>
                        <div className="w-2 h-2 md:w-3 md:h-3 bg-neutral-700 dark:bg-neutral-400 rounded-full transition-colors"></div>
                    </div>
                </motion.h2>
                <motion.div
                    className="mt-2 sm:mt-3 md:mt-5 flex flex-col items-center gap-3 w-full"
                    variants={containerVariants}
                >
                    <motion.div
                        className="relative flex items-center justify-center gap-2"
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
                            {/* Pulsing circles with blue colors */}
                            <motion.div
                                className="absolute left-1/2 -translate-x-1/2 top-0 w-20 h-20 md:w-24 md:h-24 bg-gradient-to-r from-blue-300 to-blue-300 dark:from-blue-900 dark:to-blue-900 rounded-full blur-sm transition-colors"
                                variants={pulseVariants}
                            />
                            <motion.div
                                className="absolute left-1/2 -translate-x-1/2 top-0 w-20 h-20 md:w-24 md:h-24 bg-gradient-to-r from-blue-300 to-blue-400 dark:from-blue-800 dark:to-blue-900 rounded-full blur-sm transition-colors"
                                variants={pulseVariants}
                                style={{ animationDelay: "0.3s" }}
                            />
                            <motion.div
                                className="absolute left-1/2 -translate-x-1/2 top-0 w-20 h-20 md:w-24 md:h-24 bg-gradient-to-r from-blue-400 to-blue-500 dark:from-blue-700 dark:to-blue-800 rounded-full blur-sm transition-colors"
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
