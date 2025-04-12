"use client"
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { useCurrentUser } from "@/hooks/use-current-user"
import { cn } from "@/lib/ui-utils"
import { AlignRight } from "lucide-react"
import { useMotionValueEvent, useScroll } from "motion/react"
import Link from "next/link"
import { useState } from "react"

export default function Nav() {
    const isAuthenticated = useCurrentUser()
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
        <nav
            className={cn(
                "flex z-50 bg-none transition-all justify-between items-center px-4 sm:px-8 md:px-12 lg:px-20 h-16 sm:h-20",
                {
                    "fixed w-full bg-[#EEFBFC] z-[999] shadow-white border-b-2 shadow":
                        isScrolled,
                }
            )}
        >
            <svg
                className={cn(
                    "w-[400px] md:w-[600px] md:block hidden lg:w-[800px] left-0 transition-all z-20 absolute",
                    {
                        "opacity-0": isScrolled,
                    }
                )}
            >
                <path
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#D8F0F5"
                    d="M0 0L553.32 0C460.324 86.6554 339.304 133.986 211.834 129.469C136.571 126.802 66.2931 106.455 0 71.106L0 0Z"
                />
            </svg>

            <div className="flex items-center justify-center font-bold text-xl text-gray-800">
                {/* Logo could go here */}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-center gap-8 lg:gap-16 xl:gap-24 pl-0 lg:pl-20">
                <button
                    onClick={() => scrollToSection("top")}
                    className="text-gray-600 cursor-pointer z-20 text-base lg:text-lg font-medium hover:underline underline-offset-4"
                >
                    Home
                </button>
                <button
                    onClick={() => scrollToSection("tools")}
                    className="text-gray-600 z-20 text-base lg:text-lg font-medium hover:underline underline-offset-4"
                >
                    Tools
                </button>
                <button
                    onClick={() => scrollToSection("about")}
                    className="text-gray-600 z-20 text-base lg:text-lg font-medium hover:underline underline-offset-4"
                >
                    About us
                </button>
                <button
                    onClick={() => scrollToSection("contact")}
                    className="text-gray-600 z-20 text-base lg:text-lg font-medium hover:underline underline-offset-4"
                >
                    Contact
                </button>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
                {!isAuthenticated && (
                    <Link
                        href={"/auth/login"}
                        className="to-[#ada3fc] flex items-center justify-center z-50 hover:font-semibold font-medium active:scale-100 hover:to-[#a99dffe4] text-white font-sans bg-gradient-to-tl from-[#7654fc] hover:from-[#7654fc] h-9 md:h-10 lg:h-11 px-4 md:px-6 lg:px-8 cursor-pointer hover:scale-105 transition-all duration-250 rounded-full hover:shadow-[0_2px_7px_rgba(118,84,252,0.6)] text-sm lg:text-base"
                    >
                        Login
                    </Link>
                )}
                <Link
                    href={isAuthenticated ? "/home" : "/auth/register"}
                    className="to-[#70e8f8] flex items-center justify-center active:scale-100 z-50 hover:font-semibold font-medium hover:to-[#7beefde3] text-white font-sans bg-gradient-to-tl from-[#12abde] hover:from-[#12abde] h-9 md:h-10 lg:h-11 px-4 md:px-6 lg:px-8 cursor-pointer hover:scale-105 transition-all rounded-full duration-250 hover:shadow-[0_2px_7px_rgba(18,171,222,0.6)] text-sm lg:text-base"
                >
                    Get started
                </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden z-[999]">
                <button
                    onClick={() => {
                        setIsOpen(!isOpen)
                    }}
                    className="h-10 cursor-pointer z-[999] w-10 rounded-full"
                >
                    <AlignRight className="h-10 text-[#0c4888] stroke-[2.7] w-10" />
                    <span className="sr-only">Toggle menu</span>
                </button>
                <Drawer open={isOpen} onOpenChange={setIsOpen}>
                    <DrawerContent className="h-[80vh] pb-2">
                        <DrawerHeader className="text-center">
                            <DrawerTitle className="text-3xl font-bold">
                                Menu
                            </DrawerTitle>
                            <DrawerDescription className="text-lg font-medium"></DrawerDescription>
                        </DrawerHeader>
                        <div className="flex overflow-y-auto h-[80vh] flex-col items-center justify-center gap-3 p-6">
                            <button
                                onClick={() => scrollToSection("top")}
                                className="text-gray-600 text-xl font-semibold border rounded-xl w-full py-4 border-gray-300"
                            >
                                Home
                            </button>
                            <button
                                onClick={() => scrollToSection("tools")}
                                className="text-gray-600 text-xl font-semibold border rounded-xl w-full py-4 border-gray-300"
                            >
                                Tools
                            </button>
                            <button
                                onClick={() => scrollToSection("about")}
                                className="text-gray-600 text-xl font-semibold border rounded-xl w-full py-4 border-gray-300"
                            >
                                About us
                            </button>
                            <button
                                onClick={() => scrollToSection("contact")}
                                className="text-gray-600 text-xl font-semibold border rounded-xl w-full py-4 border-gray-300"
                            >
                                Contact
                            </button>

                            <div className="flex flex-col w-full gap-4 mt-4">
                                <Link
                                    href={"/auth/login"}
                                    className="to-[#ada3fc] flex items-center justify-center z-50 hover:font-semibold font-medium active:scale-100 hover:to-[#a99dffe4] text-white font-sans bg-gradient-to-tl from-[#7654fc] hover:from-[#7654fc] h-12 px-8 cursor-pointer transition-all duration-250 rounded-full hover:shadow-[0_2px_7px_rgba(118,84,252,0.6)] text-lg w-full"
                                >
                                    Login
                                </Link>
                                <Link
                                    href={"/auth/register"}
                                    className="to-[#70e8f8] flex items-center justify-center active:scale-100 z-50 hover:font-semibold font-medium hover:to-[#7beefde3] text-white font-sans bg-gradient-to-tl from-[#12abde] hover:from-[#12abde] h-12 px-8 cursor-pointer transition-all rounded-full duration-250 hover:shadow-[0_2px_7px_rgba(18,171,222,0.6)] text-lg w-full"
                                >
                                    Get started
                                </Link>
                            </div>
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>
        </nav>
    )
}
