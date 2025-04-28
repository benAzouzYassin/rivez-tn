"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/ui-utils"
import { usePathname } from "next/navigation"
import { useRouter } from "nextjs-toploader/app"
import { ReactNode } from "react"
import CollapsibleNavButton from "./collapsible-nav-button"
import TooltipWrapper from "../ui/tooltip"

interface NavItem {
    name: string
    icon: ReactNode
    iconScale?: string
    route?: string
    subItems?: Omit<NavItem, "subItems">[]
}

export interface NavButtonProps {
    item: NavItem
    isNameVisible: boolean
    additionalClasses?: string
}

export function NavButton({
    item,
    isNameVisible,
    additionalClasses,
}: NavButtonProps) {
    const pathname = usePathname()
    const isSelected = item.route && pathname.includes(item.route)
    const router = useRouter()

    return (
        <>
            {item.subItems?.length ? (
                <CollapsibleNavButton
                    item={item}
                    isNameVisible={isNameVisible}
                    additionalClasses={additionalClasses}
                />
            ) : isNameVisible ? (
                <Button
                    key={item.name}
                    variant="secondary"
                    onClick={() => {
                        if (item.route) {
                            router.push(item.route)
                        }
                    }}
                    className={cn(
                        "py-7 text-base bg-white dark:bg-neutral-900 text-[#545454] dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 border-white dark:border-neutral-900 font-extrabold rounded-xl shadow-none w-full justify-start transition-all rtl:flex-row-reverse",
                        additionalClasses,
                        {
                            "bg-[#D3EEFA]/50 dark:bg-blue-900/40 text-[#27b3ef] dark:text-blue-300 hover:bg-[#cdeffd]/80 dark:hover:bg-blue-900/60 border-[#8cd9f9]/70 dark:border-blue-700/70 border-2":
                                isSelected,
                        }
                    )}
                >
                    {item.icon}
                    {isNameVisible && <span className="ml-2">{item.name}</span>}
                </Button>
            ) : (
                <TooltipWrapper
                    align="end"
                    duration={0}
                    content={item.name}
                    contentClassName={cn(
                        "translate-y-12 rounded-lg font-bold text-neutral-600/90 dark:text-neutral-200 text-sm w-[110px] text-center rtl:translate-x-[-90px] ltr:translate-x-[90px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-lg dark:shadow-black/30",
                        { "opacity-0 ": isNameVisible }
                    )}
                    asChild
                >
                    <Button
                        key={item.name}
                        variant="secondary"
                        onClick={() => {
                            if (item.route) {
                                router.push(item.route)
                            }
                        }}
                        className={cn(
                            "py-7 text-base bg-white dark:bg-neutral-900 text-[#545454] dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 border-white dark:border-neutral-900 font-extrabold rounded-xl shadow-none w-full justify-start transition-all",
                            additionalClasses,
                            {
                                "bg-[#D3EEFA]/50 dark:bg-blue-900/40 text-[#27b3ef] dark:text-blue-300 hover:bg-[#cdeffd]/80 dark:hover:bg-blue-900/60 border-[#8cd9f9]/70 dark:border-blue-700 border-2":
                                    isSelected,
                            }
                        )}
                    >
                        {item.icon}
                        {isNameVisible && (
                            <span className="ml-2">{item.name}</span>
                        )}
                    </Button>
                </TooltipWrapper>
            )}
        </>
    )
}
