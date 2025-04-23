"use client"

import AnimatedLoader from "@/components/ui/animated-loader"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import TooltipWrapper from "@/components/ui/tooltip"
import { logoutUser } from "@/data-access/users/logout"
import { useCurrentUser } from "@/hooks/use-current-user"
import { toastError } from "@/lib/toasts"
import { cn } from "@/lib/ui-utils"
import { useSidenav } from "@/providers/sidenav-provider"
import { useQueryClient } from "@tanstack/react-query"
import { CreditCardIcon, LanguagesIcon, LogOutIcon, User2 } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"
import { JSX, useMemo, useState, useEffect } from "react"
import CreditIcon from "../icons/credit-icon"
import MobileNavDrawer from "./mobile-nav-drawer"
import Cookies from "js-cookie"
import { availableLanguages } from "@/utils/get-language"
import { customToFixed } from "@/utils/numbers"

export default function UserHeader() {
    const queryClient = useQueryClient()
    const { isSidenavOpen } = useSidenav()
    const { data: user, isLoading, isError } = useCurrentUser()
    const [isUserSettingOpen, setIsUserSettingOpen] = useState(false)
    const [isRTL, setIsRTL] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const language = Cookies.get("selected-language") || "en"
        setIsRTL(language === "ar")
    }, [])

    const handleLogout = async () => {
        setIsUserSettingOpen(false)
        try {
            await logoutUser()
            queryClient.refetchQueries({
                queryKey: ["current-user"],
            })
            router.replace("/landing-page")
            queryClient.invalidateQueries()
        } catch (error) {
            console.error("Logout failed:", error)
            toastError("Error while trying to logout...")
        }
    }

    const menuItems: MenuItem[] = [
        {
            icon: <CreditCardIcon className="w-6 h-6 opacity-70" />,
            label: "Buy credits",
            onClick: () => {
                setIsUserSettingOpen(false)
                router.push("/offers")
            },
            className: "text-neutral-500",
        },
        {
            icon: <LogOutIcon className="w-6 h-6 opacity-70" />,
            label: "Logout",
            onClick: () => {
                setIsUserSettingOpen(false)
                handleLogout()
            },
            className: "text-red-500 hover:text-red-500 hover:bg-red-100",
        },
    ]

    if (isLoading) {
        return (
            <div className="h-[100vh] flex items-center absolute top-0 left-0 bg-white w-full z-50 justify-center">
                <AnimatedLoader />
            </div>
        )
    }

    if (isError) {
        router.replace("/auth/login")
        return null
    }

    return (
        <header
            className={cn(
                "w-full h-[10vh] z-10 fixed transition-all duration-300 bg-white",
                {
                    " lg:pl-[300px]": isSidenavOpen && !isRTL,
                    " lg:pr-[300px]": isSidenavOpen && isRTL,
                    " lg:pl-[100px]": !isSidenavOpen && !isRTL,
                    " lg:pr-[100px]": !isSidenavOpen && isRTL,
                }
            )}
        >
            <div
                className={cn(
                    "flex h-full border-b-2 items-center px-4 sm:px-8 lg:px-20",
                    {
                        "flex-row-reverse": isRTL,
                    }
                )}
            >
                <MobileNavDrawer />
                <div
                    className={cn("ml-auto flex items-center gap-1", {
                        "md:-ml-10 md:mr-auto": isRTL,
                    })}
                >
                    <Popover
                        open={isUserSettingOpen}
                        onOpenChange={setIsUserSettingOpen}
                    >
                        <PopoverTrigger className="cursor-pointer rtl:md:flex-row rtl:flex-row-reverse w-fit p-1 mt-2 rounded-2xl flex items-center gap-2 font-bold text-lg text-neutral-600 md:px-3 py-1 active:scale-95 hover:bg-neutral-100 transition-transform">
                            <div
                                className={cn("flex text-nowrap flex-col", {
                                    "items-end": isRTL,
                                    "items-start": !isRTL,
                                })}
                            >
                                <p
                                    className={cn(
                                        "first-letter:uppercase md:text-base text-sm pr-px max-w-[200px] truncate w-fit mx-2",
                                        {
                                            "pl-px pr-0": isRTL,
                                        }
                                    )}
                                >
                                    {" "}
                                    {user?.identities?.[0].displayName}
                                </p>
                                <div
                                    className={cn(
                                        "md:text-sm text-xs w-full gap-2 justify-end flex text-neutral-500 text-left font-semibold",
                                        {
                                            "justify-start text-right": isRTL,
                                        }
                                    )}
                                >
                                    <TooltipWrapper
                                        asChild
                                        content="Your credit balance"
                                    >
                                        <div className="flex w-fit items-center cursor-pointer gap-1 rounded-full text-sm md:mt-0 mt-1 md:text-lg bg-blue-100/70 border border-blue-200 pl-2 pr-3 py-[1px] scale-95 text-neutral-600/90 hover:bg-blue-100 transition-colors">
                                            <CreditIcon className="h-6 w-6 md:scale-125 opacity-80" />
                                            <span className="font-extrabold pr-1">
                                                {customToFixed(
                                                    Number(
                                                        user?.credit_balance ||
                                                            0
                                                    ),
                                                    1
                                                )}
                                            </span>
                                        </div>
                                    </TooltipWrapper>
                                </div>
                            </div>
                            <UserProfile
                                name={user?.identities?.[0].displayName}
                                image={user?.identities?.[0].avatar}
                            />
                        </PopoverTrigger>

                        <PopoverContent
                            align={isRTL ? "start" : "end"}
                            className={cn(
                                "w-72 p-0 rounded-xl shadow-lg border border-neutral-200",
                                {
                                    "-translate-x-2": !isRTL,
                                    "translate-x-2": isRTL,
                                }
                            )}
                        >
                            <UserMenu
                                items={menuItems}
                                close={() => setIsUserSettingOpen(false)}
                                isRTL={isRTL}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </header>
    )
}

function UserProfile({ name, image }: UserProfileProps) {
    return (
        <div className="group relative rounded-full active:scale-95 transition-all">
            <Avatar className="h-[50px] opacity-90 w-[50px]">
                <AvatarImage src={image} alt={name} />
                <AvatarFallback className="bg-neutral-100 border text-neutral-400">
                    <User2 className="h-6 w-6" />
                </AvatarFallback>
            </Avatar>
        </div>
    )
}

function UserMenu({
    items,
    close,
    isRTL,
}: {
    items: MenuItem[]
    close: () => void
    isRTL: boolean
}) {
    const [language, setLanguage] = useState({
        label: "English",
        value: "en",
        flag: "/flags/usa.svg",
    })
    const languages = useMemo(() => {
        return [
            { label: "English", value: "en", flag: "/flags/usa.svg" },
            { label: "العربية", value: "ar", flag: "/flags/palestine.svg" },
            { label: "Français", value: "fr", flag: "/flags/france.svg" },
        ]
    }, [])

    return (
        <div>
            <div>
                <button
                    className={cn(
                        "flex group relative text-neutral-500 w-full cursor-pointer items-center gap-3 px-4 py-3 text-base font-bold",
                        "transition-colors hover:bg-blue-100/70 hover:text-blue-400 last:border-b active:bg-blue-200/70"
                    )}
                >
                    <div
                        className={cn(
                            "group-hover:flex hidden  w-64 h-36  top-0 absolute",
                            {
                                "-left-64": !isRTL,
                                "-right-64": isRTL,
                            }
                        )}
                    >
                        <div className="w-64 mt-0 rounded-none border-none overflow-visible shadow-none bg-transparent p-0!">
                            <div className="rounded-2xl -mt-1 overflow-hidden border-2 bg-white">
                                <div>
                                    {languages.map((lang) => (
                                        <div
                                            key={lang.value}
                                            className={cn(
                                                "flex items-center active:scale-95 transition-all h-12 border-t-2 px-6 w-full cursor-pointer hover:bg-blue-100/70",
                                                {
                                                    "flex-row-reverse justify-between":
                                                        isRTL,
                                                }
                                            )}
                                            onClick={() => {
                                                setLanguage(lang)
                                                if (
                                                    availableLanguages.includes(
                                                        lang.value as any
                                                    )
                                                ) {
                                                    Cookies.set(
                                                        "selected-language",
                                                        lang.value
                                                    )
                                                    window.location.reload()
                                                }
                                                close()
                                            }}
                                        >
                                            <img
                                                alt={lang.label}
                                                className="rounded-sm h-5 w-5 mr-2"
                                                src={lang.flag}
                                            />
                                            <span
                                                className={cn(
                                                    "text-sm font-bold text-neutral-600 ml-1",
                                                    { "ml-0 mr-1": isRTL }
                                                )}
                                            >
                                                {lang.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <LanguagesIcon className="w-6 h-6 opacity-70" />
                    <span className={cn({ "mr-auto": isRTL })}>
                        Change language
                    </span>
                </button>
                {items.map((item, index) => (
                    <button
                        key={index}
                        onClick={item.onClick}
                        className={cn(
                            "flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-base font-bold",
                            "transition-colors hover:bg-blue-100/70 hover:text-blue-400 last:border-b active:bg-blue-200/70",
                            item.className,
                            { "flex-row-reverse": isRTL }
                        )}
                    >
                        {item.icon}
                        <span className={cn({ "mr-auto": isRTL })}>
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    )
}

type MenuItem = {
    icon: JSX.Element
    label: string
    onClick: () => void
    className: string
}

type UserProfileProps = {
    name: string
    image?: string
}
