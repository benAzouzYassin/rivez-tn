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
    isSidenavOpen: boolean
    additionalClasses?: string
}

export function NavButton({
    item,
    isSidenavOpen,
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
                    isSidenavOpen={isSidenavOpen}
                    additionalClasses={additionalClasses}
                />
            ) : isSidenavOpen ? (
                <Button
                    key={item.name}
                    variant="secondary"
                    onClick={() => {
                        if (item.route) {
                            router.push(item.route)
                        }
                    }}
                    className={cn(
                        "py-7 text-base   bg-white text-[#545454] hover:bg-neutral-100 border-white font-extrabold rounded-xl shadow-none w-full justify-start",
                        additionalClasses,
                        "transition-all",
                        {
                            "bg-[#D3EEFA]/50 text-[#27b3ef] hover:bg-[#cdeffd]/80 border-[#8cd9f9]/70 border-2":
                                isSelected,
                        }
                    )}
                >
                    {item.icon}
                    {isSidenavOpen && <span className="ml-2">{item.name}</span>}
                </Button>
            ) : (
                <TooltipWrapper
                    align="end"
                    duration={0}
                    content={item.name}
                    contentClassName={cn(
                        "  translate-y-12 rounded-lg  font-bold text-neutral-600/90 text-sm  w-[110px] text-center translate-x-[90px]",
                        { "opacity-0 ": isSidenavOpen }
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
                            "py-7 text-base  bg-white text-[#545454] hover:bg-neutral-100 border-white font-extrabold rounded-xl shadow-none w-full justify-start",
                            additionalClasses,
                            "transition-all",
                            {
                                "bg-[#D3EEFA]/50 text-[#27b3ef] hover:bg-[#cdeffd]/80 border-[#8cd9f9]/70 border-2":
                                    isSelected,
                            }
                        )}
                    >
                        {item.icon}
                        {isSidenavOpen && (
                            <span className="ml-2">{item.name}</span>
                        )}
                    </Button>
                </TooltipWrapper>
            )}
        </>
    )
}
