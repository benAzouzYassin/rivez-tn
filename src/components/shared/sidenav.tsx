"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/ui-utils"
import { useSidenav } from "@/providers/sidenav-provider"
import { ChevronRight } from "lucide-react"
import { ReactNode } from "react"
import { NavButton } from "./nav-button"

interface NavItem {
    name: string
    icon: ReactNode
    iconScale?: string
    route?: string
}

type Props = {
    items: NavItem[]
    settingsItem: NavItem
}

export default function Sidenav(props: Props) {
    const { isSidenavOpen, toggleSidenav } = useSidenav()

    return (
        <nav
            className={cn(
                "h-full z-10 group hover:border-r-[#8aa8fb] border-r-2 px-4 pt-10 fixed top-0 left-0 transition-all duration-300",
                {
                    "w-[256px]": isSidenavOpen,
                    "w-[100px]": !isSidenavOpen,
                }
            )}
        >
            <Button
                onClick={toggleSidenav}
                variant="outline"
                className="absolute scale-100 active:scale-95 -right-4 bg-[#4e7bf5] hover:bg-[#467ffa] hover:cursor-pointer group-hover:opacity-100 border-2 duration-300 border-[#4676fa] opacity-0 top-6 !p-1 h-fit rounded-full w-fit"
            >
                <ChevronRight
                    className={cn(
                        "!w-5 transition-all text-white stroke-[2.5] !h-5",
                        {
                            "rotate-180": isSidenavOpen,
                        }
                    )}
                />
            </Button>

            <NavButton
                item={props.items[0]}
                isSidenavOpen={isSidenavOpen}
                additionalClasses="mt-14"
            />
            {props.items.slice(1).map((item) => (
                <NavButton
                    key={item.name}
                    item={item}
                    isSidenavOpen={isSidenavOpen}
                    additionalClasses="mt-1"
                />
            ))}

            <div className="absolute bottom-5 px-3 left-0 w-full">
                <NavButton
                    item={props.settingsItem}
                    isSidenavOpen={isSidenavOpen}
                    additionalClasses="mt-1"
                />
            </div>
        </nav>
    )
}
