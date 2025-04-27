"use client"
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { cn } from "@/lib/ui-utils"
import { AlignJustifyIcon } from "lucide-react"
import { useMotionValueEvent, useScroll } from "motion/react"
import Link from "next/link"
import { useState } from "react"
import { Translation } from "../translations/english"
import { LanguageSelector } from "@/components/shared/language-selector"
import { ThemeToggle } from "@/components/shared/theme-toggle"

interface Props {
    translation: Translation
    defaultLang: string
}
export default function Nav({ translation, defaultLang }: Props) {
    const { scrollY } = useScroll()
    const [isScrolled, setIsScrolled] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest > 100 && !isScrolled) {
            setIsScrolled(true)
        }
        if (latest < 100 && isScrolled) {
            setIsScrolled(false)
        }
    })

    const scrollToSection = (id: string) => {
        setIsOpen(false)
        if (id === "top") {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            })
            return
        }

        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({ behavior: "smooth" })
        }
    }

    return (
        <div className="h-16 sm:h-20">
            <nav
                className={cn(
                    "flex md:flex-row flex-row-reverse z-50 bg-none bg-white dark:bg-neutral-900 justify-between items-center px-4 sm:px-8 border-b-2 border-b-transparent md:px-12 lg:px-20 h-16 sm:h-20",
                    {
                        "fixed w-full bg-white dark:bg-neutral-900 z-[999] shadow-white dark:shadow-neutral-950 border-b-neutral-200 dark:border-b-neutral-800":
                            isScrolled,
                    }
                )}
            >
                <svg
                    className={cn(
                        "w-[400px] md:w-[600px] md:block hidden lg:w-[800px] left-0 rtl:right-0 rtl:scale-x-[-1] rtl:left-auto transition-all z-20 absolute",
                        {
                            "opacity-0": isScrolled,
                        }
                    )}
                >
                    <path
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#D8F0F5"
                        className="dark:fill-neutral-800"
                        d="M0 0L553.32 0C460.324 86.6554 339.304 133.986 211.834 129.469C136.571 126.802 66.2931 106.455 0 71.106L0 0Z"
                    />
                </svg>

                {/* Desktop Navigation */}
                <div className="hidden mx-auto md:flex items-center justify-center gap-8 lg:gap-16 xl:gap-24 pl-0 lg:pl-20 rtl:pr-0 rtl:lg:pr-20 rtl:pl-0">
                    <button
                        onClick={() => scrollToSection("top")}
                        className="text-neutral-600 cursor-pointer dark:text-neutral-200 font-bold z-20 text-base lg:text-lg hover:underline underline-offset-4"
                    >
                        {translation["Home"]}
                    </button>
                    <button
                        onClick={() => scrollToSection("tools")}
                        className="text-neutral-600 cursor-pointer dark:text-neutral-200 font-bold z-20 text-base lg:text-lg hover:underline underline-offset-4"
                    >
                        {translation["Tools"]}
                    </button>
                    <button
                        onClick={() => scrollToSection("about")}
                        className="text-neutral-600 cursor-pointer dark:text-neutral-200 font-bold z-20 text-base lg:text-lg hover:underline underline-offset-4"
                    >
                        {translation["About us"]}
                    </button>
                    <button
                        onClick={() => scrollToSection("contact")}
                        className="text-neutral-600 cursor-pointer dark:text-neutral-200 font-bold z-20 text-base lg:text-lg hover:underline underline-offset-4"
                    >
                        {translation["Contact"]}
                    </button>
                </div>
                <div className="flex md:flex-row md:items-center w-fit gap-2">
                    <ThemeToggle />

                    <LanguageSelector defaultLang={defaultLang} />
                    <div className="flex items-center gap-4">
                        <Link
                            href={"/auth/register"}
                            className="bg-blue-400 dark:bg-blue-500 min-w-28 flex items-center justify-center active:scale-100 z-50 hover:font-semibold font-medium hover:to-blue-500 text-white font-sans hover:bg-gradient-to-br hover:from-blue-400 dark:hover:from-blue-500 dark:hover:to-blue-700 h-10 lg:h-11 px-4 md:px-6 lg:px-5 cursor-pointer hover:scale-105 transition-all rounded-full duration-250 hover:shadow-[0_2px_7px_rgba(18,171,222,0.6)] dark:hover:shadow-[0_2px_7px_rgba(37,99,235,0.5)] text-sm lg:text-base"
                        >
                            {translation["Get started"]}
                        </Link>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden z-[999]">
                    <button
                        onClick={() => {
                            setIsOpen(!isOpen)
                        }}
                        className="h-10 cursor-pointer z-[999] w-10 rounded-full"
                    >
                        <AlignJustifyIcon className="h-10 text-neutral-700 dark:text-neutral-400 stroke-[2.4] w-10 rtl:scale-x-[-1]" />
                        <span className="sr-only">Toggle menu</span>
                    </button>
                    <Drawer open={isOpen} onOpenChange={setIsOpen}>
                        <DrawerContent className="h-[80vh] pb-2 dark:bg-neutral-900 dark:border-t dark:border-neutral-700">
                            <DrawerHeader className="text-center">
                                <DrawerTitle className="text-3xl font-bold dark:text-neutral-100">
                                    {translation["Menu"]}
                                </DrawerTitle>
                                <DrawerDescription className="text-lg font-medium dark:text-neutral-400"></DrawerDescription>
                            </DrawerHeader>
                            <div className="flex overflow-y-auto h-[80vh] flex-col items-center justify-center gap-3 p-6">
                                <button
                                    onClick={() => scrollToSection("top")}
                                    className="text-gray-600 cursor-pointer dark:text-neutral-200 text-xl font-semibold border rounded-xl w-full py-4 border-gray-300 dark:border-neutral-700 dark:hover:bg-neutral-800"
                                >
                                    {translation["Home"]}
                                </button>
                                <button
                                    onClick={() => scrollToSection("tools")}
                                    className="text-gray-600 cursor-pointer dark:text-neutral-200 text-xl font-semibold border rounded-xl w-full py-4 border-gray-300 dark:border-neutral-700 dark:hover:bg-neutral-800"
                                >
                                    {translation["Tools"]}
                                </button>
                                <button
                                    onClick={() => scrollToSection("about")}
                                    className="text-gray-600 cursor-pointer dark:text-neutral-200 text-xl font-semibold border rounded-xl w-full py-4 border-gray-300 dark:border-neutral-700 dark:hover:bg-neutral-800"
                                >
                                    {translation["About us"]}
                                </button>
                                <button
                                    onClick={() => scrollToSection("contact")}
                                    className="text-gray-600 cursor-pointer dark:text-neutral-200 text-xl font-semibold border rounded-xl w-full py-4 border-gray-300 dark:border-neutral-700 dark:hover:bg-neutral-800"
                                >
                                    {translation["Contact"]}
                                </button>
                                <div className="flex mt-1 flex-col w-full gap-4 ">
                                    <Link
                                        href={"/auth/register"}
                                        className="flex items-center justify-center active:scale-100 z-50 hover:font-semibold font-medium text-white font-sans bg-blue-400 dark:bg-blue-500 h-14 px-8 cursor-pointer transition-all rounded-xl duration-250 hover:shadow-[0_2px_7px_rgba(18,171,222,0.6)] dark:hover:shadow-[0_2px_7px_rgba(37,99,235,0.5)] text-xl w-full"
                                    >
                                        {translation["Get started"]}
                                    </Link>
                                </div>
                            </div>
                        </DrawerContent>
                    </Drawer>
                </div>
            </nav>
        </div>
    )
}
