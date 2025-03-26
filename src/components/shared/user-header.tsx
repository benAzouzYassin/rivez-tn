"use client"

import { LanguageSelector } from "@/components/shared/language-selector"
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
import { CreditCardIcon, LogOutIcon, Settings, User2 } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"
import { JSX, useState } from "react"
import CreditIcon from "../icons/credit-icon"

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
            icon: <Settings className="w-6 h-6 opacity-70" />,
            label: "Settings",
            onClick: () => {
                setIsUserSettingOpen(false)
                router.push("/settings")
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
                "w-full h-[10vh] max-h-[90px] z-10 fixed transition-all duration-300 bg-white/95 backdrop-blur-sm supports-backdrop-filter:bg-white/60",
                {
                    "pl-[300px]": isSidenavOpen,
                    "pl-[100px]": !isSidenavOpen,
                }
            )}
        >
            <div className="flex h-full border-b-2 items-center   px-8 md:px-20">
                <div className="ml-auto flex items-center gap-1">
                    <LanguageSelector className="h-12 px-4" />

                    <Popover
                        open={isUserSettingOpen}
                        onOpenChange={setIsUserSettingOpen}
                    >
                        <PopoverTrigger className="cursor-pointer  w-fit p-1  mt-2 rounded-2xl  flex items-center  gap-2 font-bold text-lg text-neutral-600 px-3 py-1 active:scale-95 hover:bg-neutral-100 transition-transform">
                            <div className="flex text-nowrap flex-col">
                                <p className="first-letter:uppercase pr-px w-fit mx-2">
                                    {" "}
                                    {user?.identities?.[0].displayName}
                                </p>
                                <div className="text-sm w-full flex gap-2 justify-end text-neutral-500  text-left font-semibold">
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
                            <UserMenu items={menuItems} />
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
function UserMenu({ items }: { items: MenuItem[] }) {
    return (
        <div>
            <div className=" ">
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
