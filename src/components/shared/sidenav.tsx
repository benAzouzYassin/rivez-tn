"use client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/ui-utils"
import { useSidenav } from "@/providers/sidenav-provider"
import { ChevronRight } from "lucide-react"
import { useState } from "react"

interface NavItem {
    name: string
    icon: string
    iconScale?: string
}
type Props = {
    items: NavItem[]
    settingsItem: NavItem
}
export default function Sidenav(props: Props) {
    const { isSidenavOpen, toggleSidenav } = useSidenav()
    const [selected, setSelected] = useState("Learn")

    const getButtonStyles = (itemName: string) => {
        return {
            base: "py-7 text-lg font-extrabold rounded-xl shadow-none  w-full justify-start",
            active:
                selected === itemName
                    ? "bg-[#D3EEFA]/50 text-[#27b3ef] hover:bg-[#cdeffd]/80 border-[#8cd9f9]/70 border-2"
                    : "bg-white text-[#545454] hover:bg-neutral-100 border-white",
        }
    }

    const renderNavButton = (item: NavItem, additionalClasses?: string) => {
        const styles = getButtonStyles(item.name)

        return (
            <Button
                key={item.name}
                variant="secondary"
                onClick={() => setSelected(item.name)}
                className={cn(styles.base, styles.active, additionalClasses)}
            >
                <img
                    alt=""
                    src={`/icons/${item.icon}.svg`}
                    className={cn("h-8 w-8", item.iconScale)}
                />
                <span className="ml-3">{item.name}</span>
            </Button>
        )
    }

    return (
        <nav
            className={cn(
                "h-full z-10 border-r-2 px-4 pt-10 fixed top-0 left-0 transition-all",
                {
                    "w-[256px]": isSidenavOpen,
                    "w-[100px]": !isSidenavOpen,
                }
            )}
        >
            <Button onClick={toggleSidenav} className="">
                <ChevronRight />
            </Button>
            {/* Main Navigation Buttons */}
            {renderNavButton(props.items[0], "mt-14")}
            {props.items.slice(1).map((item) => renderNavButton(item, "mt-1"))}

            {/* Settings Button */}
            <div className="absolute bottom-5 px-3 left-0 w-full">
                {renderNavButton(props.settingsItem, "mt-1")}
            </div>
        </nav>
    )
}
