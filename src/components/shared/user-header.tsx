"use client"

import XpIcon from "@/components/icons/xp"
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
import { LogOutIcon, Settings, User2 } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"
import { JSX, useState } from "react"

export default function UserHeader() {
    const queryClient = useQueryClient()
    const { isSidenavOpen } = useSidenav()
    const { data: user, isLoading } = useCurrentUser()
    const [isUserSettingOpen, setIsUserSettingOpen] = useState(false)
    const router = useRouter()

    const handleLogout = async () => {
        setIsUserSettingOpen(false)
        try {
            await logoutUser()
            router.replace("/auth/login")
            queryClient.invalidateQueries()
        } catch (error) {
            console.error("Logout failed:", error)
            toastError("Error while trying to logout...")
        }
    }

    const menuItems: MenuItem[] = [
        {
            icon: <Settings className="w-4 h-4" />,
            label: "Settings",
            onClick: () => router.push("/settings"),
            className: "text-neutral-500",
        },
        {
            icon: <LogOutIcon className="w-4 h-4" />,
            label: "Logout",
            onClick: handleLogout,
            className: "text-red-500 hover:bg-red-100",
        },
    ]

    if (isLoading) {
        return (
            <div>
                <AnimatedLoader />
            </div>
        )
    }

    return (
        <header
            className={cn(
                "w-full h-[10vh] z-10 fixed transition-all duration-300 bg-white/95 backdrop-blur-sm supports-backdrop-filter:bg-white/60",
                {
                    "pl-[256px]": isSidenavOpen,
                    "pl-[100px]": !isSidenavOpen,
                }
            )}
        >
            <div className="flex h-full border-b-2 items-center   px-8 md:px-20">
                <div className="ml-auto flex items-center gap-6">
                    <LanguageSelector />
                    <TooltipWrapper content="XP Points">
                        <div className="flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-orange-500 hover:bg-orange-100 transition-colors">
                            <XpIcon className="h-5 w-5" />
                            <span className="font-medium">{0}</span>
                        </div>
                    </TooltipWrapper>

                    <Popover
                        open={isUserSettingOpen}
                        onOpenChange={setIsUserSettingOpen}
                    >
                        <PopoverTrigger>
                            <UserProfile
                                name={user?.identities?.[0].displayName}
                                image={user?.identities?.[0].avatar}
                            />
                        </PopoverTrigger>

                        <PopoverContent
                            align="center"
                            className="w-64 -translate-x-2 p-0 rounded-xl shadow-lg border border-neutral-200"
                        >
                            <UserMenu
                                items={menuItems}
                                userName={user?.identities?.[0].displayName}
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
function UserMenu({
    items,
    userName,
}: {
    items: MenuItem[]
    userName: string
}) {
    return (
        <div>
            <div className="px-4 py-3">
                <p className="font-bold text-base  ml-1 first-letter:uppercase text-neutral-500">
                    {userName}
                </p>
            </div>
            <div className=" ">
                {items.map((item, index) => (
                    <button
                        key={index}
                        onClick={item.onClick}
                        className={cn(
                            "flex w-full items-center gap-3 px-4 py-3 text-sm font-bold",
                            "transition-colors hover:bg-neutral-100 last:border-b active:bg-neutral-100",
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
