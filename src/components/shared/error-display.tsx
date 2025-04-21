"use client"

import { motion } from "framer-motion"
import { useRouter } from "nextjs-toploader/app"
import { Button } from "../ui/button"
import { useEffect } from "react"

interface ErrorDisplayProps {
    message?: string
    hideButton?: boolean
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
    message = "An error has occurred",
    hideButton,
}) => {
    const router = useRouter()

    useEffect(() => {
        if (window !== undefined) {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            })
        }
    }, [])

    // Animation Variants
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

    const iconVariants = {
        hidden: { scale: 0 },
        visible: {
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 260,
                damping: 20,
            },
        },
    }

    return (
        <motion.section
            className="h-fit pt-20 pb-4 flex flex-col items-center justify-center bg-white"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Icon */}
            <motion.div variants={iconVariants}>
                <Icon className="w-64 h-64" />
            </motion.div>

            {/* Error Message */}
            <motion.h1
                className="text-5xl font-black text-red-500 mt-6 text-center"
                variants={itemVariants}
            >
                {message}
            </motion.h1>

            <motion.p
                className="text-neutral-500 mt-4 font-medium text-center max-w-[600px] text-lg"
                variants={itemVariants}
            >
                Something went wrong. Please try again or return to the home
                page.
            </motion.p>

            {/* Button */}
            {!hideButton && (
                <motion.div
                    className="mt-8 w-full max-w-[300px]"
                    variants={itemVariants}
                >
                    <Button
                        onClick={router.back}
                        className="w-full col-span-3 text-xl h-14 bg-neutral-800 border-neutral-500 shadow-neutral-500"
                    >
                        Go back
                    </Button>
                </motion.div>
            )}
        </motion.section>
    )
}
function Icon(props: { className?: string }) {
    return (
        <svg
            className={props.className}
            width="217"
            height="217"
            viewBox="0 0 217 217"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g clip-path="url(#clip0_1207_4)">
                <mask
                    id="mask0_1207_4"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="217"
                    height="217"
                >
                    <path d="M217 0H0V217H217V0Z" fill="white" />
                </mask>
                <g mask="url(#mask0_1207_4)">
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M67.7479 25.9802C56.4006 31.1367 40.2041 46.2051 37.8211 53.8367C36.144 59.2053 37.7934 64.7 42.2419 67.815C45.5653 70.1429 48.0005 69.4213 51.7742 68.7561C55.7479 68.0555 57.773 67.137 62.0692 61.7804C67.3665 55.1758 71.3402 51.854 79.0515 47.5819C85.141 44.2079 85.746 41.3039 86.423 36.6454C86.799 34.0566 86.488 32.295 85.249 29.9902C81.896 23.7549 75.7472 22.3467 67.7479 25.9802Z"
                        fill="#F66464"
                    />
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M73.8271 5.97842C46.0873 15.4483 24.2183 34.7602 11.0216 61.4409C6.44966 70.6855 1.21447 90.046 0.556166 100.149C-1.16783 126.587 6.03386 151.169 21.726 172.404C65.0614 231.05 152.301 230.75 195.448 171.808C213.427 147.246 219.879 117.983 213.991 87.694C210.47 69.5764 204.244 55.7381 193.355 41.8247C171.333 13.6831 137.294 -1.61598 101.469 0.523425C88.8321 1.27852 85.9021 1.85562 73.8271 5.97842ZM66.1822 26.9139C54.9268 32.2668 40.0981 46.5681 37.8487 54.24C36.2654 59.6381 37.8225 64.1358 42.3246 67.1727C45.6882 69.4423 47.0077 69.7267 50.7695 68.9948C54.7303 68.2249 55.7548 67.447 59.9567 62.0172C65.1381 55.3202 69.0532 51.9295 76.6888 47.5235C82.7181 44.0447 84.4451 41.9213 85.0401 37.2516C85.3711 34.6556 85.0301 32.9007 83.7511 30.6179C80.2896 24.4421 74.117 23.1405 66.1822 26.9139Z"
                        fill="#EF2323"
                    />
                    <path
                        d="M64.1714 88.5608C58.6095 83.1709 58.6095 74.4323 64.1714 69.0424C69.7333 63.6525 78.7508 63.6525 84.3127 69.0424L152.829 135.439C158.39 140.829 158.39 149.568 152.829 154.958C147.267 160.347 138.25 160.347 132.687 154.958L64.1714 88.5608Z"
                        fill="white"
                    />
                    <path
                        d="M134.687 69.0424C140.25 63.6525 149.267 63.6525 154.829 69.0424C160.39 74.4323 160.39 83.1709 154.829 88.5608L86.3127 154.958C80.7509 160.347 71.7333 160.347 66.1715 154.958C60.6095 149.568 60.6095 140.829 66.1715 135.439L134.687 69.0424Z"
                        fill="white"
                    />
                </g>
            </g>
            <defs>
                <clipPath id="clip0_1207_4">
                    <rect width="217" height="217" fill="white" />
                </clipPath>
            </defs>
        </svg>
    )
}
