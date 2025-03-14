"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/ui-utils"
import { usePathname } from "next/navigation"
import { useRouter } from "nextjs-toploader/app"
import { ReactNode } from "react"

interface NavItem {
    name: string
    icon: ReactNode
    iconScale?: string
    route?: string
}

interface NavButtonProps {
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
        <Button
            key={item.name}
            variant="secondary"
            onClick={() => {
                if (item.route) {
                    router.push(item.route)
                }
            }}
            className={cn(
                "py-7 text-lg  bg-white text-[#545454] hover:bg-neutral-100 border-white font-extrabold rounded-xl shadow-none w-full justify-start",
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
    )
}
