"use client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/ui-utils"
import { useSidenav } from "@/providers/sidenav-provider"
import { ChevronRight } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"
import { useState } from "react"

interface NavItem {
    name: string
    icon: string
    iconScale?: string
    route?: string
}
type Props = {
    items: NavItem[]
    settingsItem: NavItem
}
export default function Sidenav(props: Props) {
    const { isSidenavOpen, toggleSidenav } = useSidenav()
    const [selected, setSelected] = useState("Learn")
    const router = useRouter()
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
                onClick={() => {
                    setSelected(item.name)
                    if (item.route) {
                        router.push(item.route)
                    }
                }}
                className={cn(styles.base, styles.active, additionalClasses)}
            >
                <img
                    alt=""
                    src={`/icons/${item.icon}.svg`}
                    className={cn(
                        "h-8 transition-transform w-8 min-w-8 min-h-8 ",
                        item.iconScale,
                        {
                            "-translate-x-1": !isSidenavOpen,
                        }
                    )}
                />
                {isSidenavOpen && <span className="ml-3">{item.name}</span>}
            </Button>
        )
    }

    return (
        <nav
            className={cn(
                "h-full z-10  group  hover:border-r-[#1CB0F6] border-r-2 px-4 pt-10 fixed top-0 left-0 transition-all  duration-300",
                {
                    "w-[256px]": isSidenavOpen,
                    "w-[100px]": !isSidenavOpen,
                }
            )}
        >
            <Button
                onClick={toggleSidenav}
                variant={"outline"}
                className="absolute scale-100 active:scale-95 -right-4 bg-[#1CB0F6] hover:bg-[#1c8df6bc] hover:cursor-pointer group-hover:opacity-100 border-2 duration-300 border-[#1CB0F6] opacity-0 top-6 !p-1 h-fit rounded-full w-fit"
            >
                <ChevronRight
                    className={cn(
                        "!w-5 transition-all  text-white stroke-[2.5] !h-5",
                        {
                            "rotate-180": isSidenavOpen,
                        }
                    )}
                />
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
