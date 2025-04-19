"use client"
import SuccessIcon from "@/components/icons/success"
import TimeIcon from "@/components/icons/time"
import XpIcon from "@/components/icons/xp"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/ui-utils"
import { formatSeconds } from "@/utils/date"
import { useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { useRouter } from "nextjs-toploader/app"

type Props = {
    secondsSpent: number
    correctQuestions: number
    xpGained: number
}
export default function ResultPage(props: Props) {
    const queryClient = useQueryClient()
    const router = useRouter()
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
    const handleBackBtn = () => {
        queryClient.invalidateQueries({
            predicate: (q) => {
                return (
                    q.queryKey.includes("quiz_submission_answers") ||
                    q.queryKey.includes("quiz_submission")
                )
            },
        })
        router.push("/home")
    }
    return (
        <motion.section
            className="h-fit px-4 py-6 md:py-8 lg:py-10"
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
                    <SuccessIcon className="w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 lg:w-64 lg:h-64 mt-0" />
                </motion.div>
                <motion.p
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center uppercase font-black text-neutral-800 mt-2 md:mt-3"
                    variants={itemVariants}
                >
                    Quiz Over
                </motion.p>
                <motion.p
                    className="text-neutral-500 mt-3 md:mt-5 font-semibold text-center max-w-[600px] text-sm sm:text-base md:text-lg"
                    variants={itemVariants}
                >
                    GG! Well played! 🎉 Your effort was truly impressive, and we
                    appreciate the time and energy you put into this quiz. Thank
                    you for participating.
                </motion.p>
            </motion.div>

            <motion.div
                className="grid max-w-[800px]  mt-6 sm:mt-8 md:mt-10 gap-4 sm:gap-6 md:gap-8 lg:gap-10 mx-auto grid-cols-2 sm:grid-cols-3"
                variants={containerVariants}
            >
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        className={cn(
                            "h-28   sm:h-32 md:h-36 lg:h-44 border-2 border-neutral-200 flex items-center justify-center flex-col rounded-xl md:rounded-2xl",
                            {
                                "sm:col-span-1 col-span-2": index === 0,
                            }
                        )}
                        variants={statsCardVariants}
                        whileHover={{
                            scale: 1.03,
                            transition: { duration: 0.2 },
                        }}
                    >
                        <div className="flex items-center gap-1 justify-center">
                            <stat.Icon className={stat.iconClass} />
                            <motion.span
                                className="text-xl sm:text-2xl md:text-3xl lg:text-[2.4rem] ml-1 font-black text-neutral-700"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 + index * 0.2 }}
                            >
                                {stat.value}
                            </motion.span>
                        </div>
                        <p className="text-neutral-500/60 mt-1 sm:mt-2 md:mt-3 text-sm sm:text-lg md:text-xl lg:text-2xl font-extrabold">
                            {stat.label}
                        </p>
                    </motion.div>
                ))}
                <Button
                    onClick={handleBackBtn}
                    variant={"green"}
                    className="w-full col-span-2 sm:col-span-3 text-base sm:text-lg md:text-xl h-12 md:h-14 bg-neutral-800 border-neutral-500 shadow-neutral-500 mt-2 sm:mt-0"
                >
                    Back to home
                </Button>
            </motion.div>
        </motion.section>
    )
}
