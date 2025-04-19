"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/ui-utils"
import { useSidenav } from "@/providers/sidenav-provider"
import { ChevronRight } from "lucide-react"
import { ReactNode } from "react"
import { NavButton } from "./nav-button"
import { ScrollArea } from "../ui/scroll-area"

interface NavItem {
    name: string
    icon: ReactNode
    route?: string
    subItems?: Omit<NavItem, "subItems">[]
}

type Props = {
    items: NavItem[]
    bottomItem: NavItem
}

export default function Sidenav(props: Props) {
    const { isSidenavOpen, toggleSidenav } = useSidenav()

    return (
        <nav
            className={cn(
                "h-full lg:block hidden  z-10 group hover:border-r-[#8aa8fb] border-r-2 px-2 pt-10 fixed top-0 left-0 transition-all duration-300",
                {
                    "w-[300px]": isSidenavOpen,
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
            <ScrollArea className="  scale-x-[-1]  h-[calc(100vh-14.1rem)] px-2 mt-14 ">
                <div className="scale-x-[-1]  pl-[6px]">
                    <NavButton
                        item={props.items[0]}
                        isNameVisible={isSidenavOpen}
                        additionalClasses="md:!text-base"
                    />
                    {props.items.slice(1).map((item) => (
                        <NavButton
                            key={item.name}
                            item={item}
                            isNameVisible={isSidenavOpen}
                            additionalClasses="mt-1 md:!text-base"
                        />
                    ))}
                </div>
            </ScrollArea>
            <div className="absolute border-t bg-white  bottom-0 pt-6 pb-10 px-3 left-0 w-full">
                <NavButton
                    item={props.bottomItem}
                    isNameVisible={isSidenavOpen}
                    additionalClasses="mt-1 py-7 pl-6 hover:bg-blue-400/90 rounded-xl border-b-4 border-blue-400/70 bg-blue-400/80 text-white gap-2 !text-lg"
                />
            </div>
        </nav>
    )
}
