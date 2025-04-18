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
import {
    AlignLeft,
    CreditCardIcon,
    LanguagesIcon,
    LogOutIcon,
    Settings,
    User2,
} from "lucide-react"
import { useRouter } from "nextjs-toploader/app"
import { JSX, useMemo, useState } from "react"
import CreditIcon from "../icons/credit-icon"
import MobileNavDrawer from "./mobile-nav-drawer"

export default function UserHeader() {
    const queryClient = useQueryClient()
    const { isSidenavOpen } = useSidenav()
    const { data: user, isLoading, isError } = useCurrentUser()
    const [isUserSettingOpen, setIsUserSettingOpen] = useState(false)
    const router = useRouter()
    const handleLogout = async () => {
        setIsUserSettingOpen(false)
        try {
            await logoutUser()
            queryClient.refetchQueries({
                queryKey: ["current-user"],
            })
            router.replace("/auth/login")
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
                    " lg:pl-[300px]": isSidenavOpen,
                    " lg:pl-[100px]": !isSidenavOpen,
                }
            )}
        >
            <div className="flex h-full border-b-2 items-center px-4  sm:px-8 lg:px-20">
                <MobileNavDrawer />

                <div className="ml-auto flex items-center gap-1">
                    <Popover
                        open={isUserSettingOpen}
                        onOpenChange={setIsUserSettingOpen}
                    >
                        <PopoverTrigger className="cursor-pointer  w-fit p-1  mt-2 rounded-2xl  flex items-center  gap-2 font-bold text-lg text-neutral-600 md:px-3 py-1 active:scale-95 hover:bg-neutral-100 transition-transform">
                            <div className="flex text-nowrap flex-col">
                                <p className="first-letter:uppercase sm:block hidden pr-px max-w-[200px] truncate w-fit mx-2">
                                    {" "}
                                    {user?.identities?.[0].displayName}
                                </p>
                                <div className="text-sm w-full  gap-2 justify-end sm:flex hidden text-neutral-500  text-left font-semibold">
                                    <TooltipWrapper
                                        asChild
                                        content="Your credit balance"
                                    >
                                        <div className="flex w-fit   items-center cursor-pointer gap-1 rounded-full text-lg bg-blue-100/70 border border-blue-200 pl-2 pr-3 py-[1px] scale-95 text-neutral-600/90 hover:bg-blue-100 transition-colors">
                                            <CreditIcon className="h-6 w-6 scale-125 opacity-80" />
                                            <span className="font-extrabold pr-1">
                                                {user?.credit_balance?.toFixed(
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
                            align="end"
                            className="w-72 -translate-x-2 p-0 rounded-xl shadow-lg border border-neutral-200"
                        >
                            <UserMenu
                                items={menuItems}
                                close={() => setIsUserSettingOpen(false)}
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
        <div className="group relative rounded-full   active:scale-95 transition-all  ">
            <Avatar className="h-[50px] opacity-90 w-[50px]">
                <AvatarImage src={image} alt={name} />
                <AvatarFallback className="bg-neutral-100 border text-neutral-400">
                    <User2 className="h-6 w-6" />
                </AvatarFallback>
            </Avatar>
        </div>
    )
}
function UserMenu({ items, close }: { items: MenuItem[]; close: () => void }) {
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
            <div className=" ">
                <button
                    className={cn(
                        "flex group relative  text-neutral-500 w-full cursor-pointer items-center gap-3 px-4 py-3 text-base font-bold",
                        "transition-colors hover:bg-blue-100/70 hover:text-blue-400 last:border-b active:bg-blue-200/70"
                    )}
                >
                    <div className="  group-hover:flex hidden bg-white  w-64 h-44 -left-64 top-0 absolute ">
                        <div className="w-64 mt-0 rounded-none border-none overflow-visible shadow-none bg-transparent p-0!">
                            <div className="rounded-2xl -mt-1 overflow-hidden border-2 bg-white   ">
                                <div className="">
                                    {languages.map((lang) => (
                                        <div
                                            key={lang.value}
                                            className={cn(
                                                "flex items-center active:scale-95 transition-all  h-12 border-t-2 px-6 w-full cursor-pointer   hover:bg-blue-100/70 "
                                            )}
                                            onClick={() => {
                                                setLanguage(lang)
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
                                                    "text-sm font-bold text-neutral-600 ml-1"
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
                    Change language
                </button>
                {items.map((item, index) => (
                    <button
                        key={index}
                        onClick={item.onClick}
                        className={cn(
                            "flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-base font-bold",
                            "transition-colors hover:bg-blue-100/70 hover:text-blue-400 last:border-b active:bg-blue-200/70",
                            item.className
                        )}
                    >
                        {item.icon}
                        {item.label}
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
