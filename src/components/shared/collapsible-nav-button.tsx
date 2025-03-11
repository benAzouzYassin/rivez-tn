"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/ui-utils"
import { ChevronRight } from "lucide-react"
import { useState } from "react"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "../ui/collapsible"
import { NavButton, NavButtonProps } from "./nav-button"
import { usePathname } from "next/navigation"
import { useSidenav } from "@/providers/sidenav-provider"

export default function CollapsibleNavButton(props: NavButtonProps) {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()
    const isSelected = props.item.route && pathname.includes(props.item.route)
    const { isSidenavOpen } = useSidenav()
    return (
        <Collapsible className="group" open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild className="group">
                <Button
                    key={props.item.name}
                    variant="secondary"
                    className={cn(
                        "py-7 text-lg  bg-white relative text-[#545454] hover:bg-neutral-100 border-white font-extrabold rounded-xl shadow-none w-full justify-start",
                        props.additionalClasses,
                        "transition-all",
                        {
                            "bg-[#D3EEFA]/50 text-[#27b3ef] hover:bg-[#cdeffd]/80 border-[#8cd9f9]/70 border-2":
                                isSelected,
                        }
                    )}
                >
                    {props.item.icon}
                    {props.isSidenavOpen && (
                        <span className="ml-2">{props.item.name}</span>
                    )}
                    {isSidenavOpen && (
                        <ChevronRight className="absolute group-data-[state=open]:rotate-90 transition-transform right-3 !w-6 stroke-[2.7] !h-6 " />
                    )}{" "}
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <div
                    className={cn("h-2 border-l-3 translate-x-2", {
                        "translate-x-7": isSidenavOpen,
                    })}
                ></div>
                <div className="">
                    {props.item.subItems?.map((subItem) => {
                        return (
                            <NavButton
                                item={subItem}
                                isSidenavOpen={props.isSidenavOpen}
                                additionalClasses={cn(
                                    " translate-x-2 !border-l-3 last:border-b-3 !border-neutral-200 hover:!bg-neutral-100 !bg-white border-y-0 pl-3  !rounded-r-xl rounded-l-none  ",
                                    {
                                        "translate-x-7": isSidenavOpen,
                                    }
                                )}
                                key={subItem.route}
                            />
                        )
                    })}
                </div>
            </CollapsibleContent>
        </Collapsible>
    )
}
