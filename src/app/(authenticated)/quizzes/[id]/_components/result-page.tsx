"use client"
import SuccessIcon from "@/components/icons/success"
import TimeIcon from "@/components/icons/time"
import XpIcon from "@/components/icons/xp"
import { Button } from "@/components/ui/button"
import { formatSeconds } from "@/utils/date"
import { motion } from "framer-motion"
import Link from "next/link"

type Props = {
    secondsSpent: number
    correctQuestions: number
    xpGained: number
}
export default function ResultPage(props: Props) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.2,
            },
        },
    }

    const statsCardVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.2,
            },
        },
    }

    const stats = [
        {
            Icon: SuccessIcon,
            value: props.correctQuestions.toString(),
            label: "Correct Answers",
            iconClass: "w-12 h-12",
        },
        {
            Icon: XpIcon,
            value: props.xpGained.toString(),
            label: "XP Gained",
            iconClass: "w-10 h-10",
        },
        {
            Icon: TimeIcon,
            value: formatSeconds(props.secondsSpent),
            label: "Time Spent",
            iconClass: "w-10 h-10",
        },
    ]

    return (
        <motion.section
            className="h-fit "
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.div
                className="flex flex-col items-center justify-center"
                variants={itemVariants}
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                    }}
                >
                    <SuccessIcon className="w-64 h-64 mt-0" />
                </motion.div>
                <motion.p
                    className="text-6xl text-center uppercase font-black text-neutral-800 mt-3"
                    variants={itemVariants}
                >
                    Quiz Over
                </motion.p>
                <motion.p
                    className="text-neutral-500 mt-5 font-semibold text-center max-w-[600px] text-lg"
                    variants={itemVariants}
                >
                    GG! Well played! 🎉 Your effort was truly impressive, and we
                    appreciate the time and energy you put into this quiz. Thank
                    you for participating.
                </motion.p>
            </motion.div>

            <motion.div
                className="grid max-w-[800px] mt-10 gap-10 mx-auto grid-cols-3"
                variants={containerVariants}
            >
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        className="h-44 border-2 border-neutral-200 flex items-center justify-center flex-col rounded-2xl"
                        variants={statsCardVariants}
                        whileHover={{
                            scale: 1.05,
                            transition: { duration: 0.2 },
                        }}
                    >
                        <div className="flex items-center gap-1 justify-center">
                            <stat.Icon className={stat.iconClass} />
                            <motion.span
                                className="text-[2.4rem] ml-1 font-black text-neutral-700"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 + index * 0.2 }}
                            >
                                {stat.value}
                            </motion.span>
                        </div>
                        <p className="text-neutral-500/60 mt-3 text-2xl font-extrabold">
                            {stat.label}
                        </p>
                    </motion.div>
                ))}
                <Link href={"/home"} className="col-span-3">
                    <Button
                        variant={"green"}
                        className="w-full col-span-3 text-xl h-14 bg-neutral-800 border-neutral-500 shadow-neutral-500"
                    >
                        Back to home
                    </Button>
                </Link>
            </motion.div>
        </motion.section>
    )
}
