"use client"

import { motion } from "framer-motion"
import { useRouter } from "nextjs-toploader/app"
import { Button } from "../ui/button"
import { useEffect } from "react"

interface ErrorDisplayProps {
    message?: string
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
    message = "An error has occurred",
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
        </motion.section>
    )
}
function Icon(props: { className?: string }) {
    return (
        <svg
            className={props.className}
            xmlns="http://www.w3.org/2000/svg"
            width="217"
            height="217"
            viewBox="0 0 217 217"
            fill="none"
        >
            <g clipPath="url(#clip0_3238_58)">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M67.7479 25.9802C56.4006 31.1367 40.2041 46.2051 37.8211 53.8367C36.144 59.2053 37.7934 64.7 42.2419 67.815C45.5653 70.1429 48.0005 69.4213 51.7742 68.7561C55.7479 68.0555 57.773 67.137 62.0692 61.7804C67.3665 55.1758 71.3402 51.854 79.0515 47.5819C85.141 44.2079 85.746 41.3039 86.423 36.6454C86.799 34.0566 86.488 32.295 85.249 29.9902C81.896 23.7549 75.7472 22.3467 67.7479 25.9802Z"
                    fill="#F66464"
                />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M73.8271 5.97839C46.0873 15.4483 24.2183 34.7602 11.0216 61.4409C6.44966 70.6855 1.21447 90.046 0.556166 100.149C-1.16783 126.587 6.03386 151.169 21.726 172.404C65.0614 231.05 152.301 230.75 195.448 171.808C213.427 147.246 219.879 117.983 213.991 87.694C210.47 69.5764 204.244 55.7381 193.355 41.8247C171.333 13.6831 137.294 -1.61601 101.469 0.523395C88.8321 1.27849 85.9021 1.85559 73.8271 5.97839ZM66.1822 26.9139C54.9268 32.2668 40.0981 46.5681 37.8487 54.24C36.2654 59.6381 37.8225 64.1358 42.3246 67.1727C45.6882 69.4423 47.0077 69.7267 50.7695 68.9948C54.7303 68.2249 55.7548 67.447 59.9567 62.0172C65.1381 55.3202 69.0532 51.9295 76.6888 47.5235C82.7181 44.0447 84.4451 41.9213 85.0401 37.2516C85.3711 34.6556 85.0301 32.9007 83.7511 30.6179C80.2896 24.4421 74.117 23.1405 66.1822 26.9139Z"
                    fill="#EF2323"
                />
                <path
                    d="M62.1255 89.045C56.6248 83.5444 56.6248 74.6261 62.1255 69.1255C67.6261 63.6248 76.5444 63.6248 82.045 69.1255L149.807 136.887C155.307 142.388 155.307 151.306 149.807 156.807C144.306 162.307 135.388 162.307 129.887 156.807L62.1255 89.045Z"
                    fill="white"
                />
                <path
                    d="M134.887 69.1255C140.388 63.6248 149.306 63.6248 154.807 69.1255C160.307 74.6261 160.307 83.5444 154.807 89.045L87.045 156.807C81.5444 162.307 72.6261 162.307 67.1255 156.807C61.6248 151.306 61.6248 142.388 67.1255 136.887L134.887 69.1255Z"
                    fill="white"
                />
            </g>
            <defs>
                <clipPath id="clip0_3238_58">
                    <rect width="217" height="217" fill="white" />
                </clipPath>
            </defs>
        </svg>
    )
}
