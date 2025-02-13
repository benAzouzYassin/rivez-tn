import { ReactNode } from "react"
import { useSidenav } from "@/providers/sidenav-provider"
import { cn } from "@/lib/ui-utils"
import UserHeader from "@/components/shared/user-header"
import Sidenav from "@/components/shared/sidenav"
import { ChartColumnDecreasing, Home, Settings } from "lucide-react"

type Props = {
    children?: Readonly<ReactNode>
}
export default function UserLayout({ children }: Props) {
    const { isSidenavOpen } = useSidenav()

    return (
        <>
            <UserHeader />
            <Sidenav
                items={[
                    {
                        name: "Learn",
                        icon: <Home className="!w-6 !h-6" />,
                        route: "/learn",
                    },
                    {
                        name: "Ranking",
                        icon: <ChartColumnDecreasing className="!w-6 !h-6" />,
                    },
                    // { name: "Quests", icon: "box" },
                    // { name: "Shop", icon: "loot" },
                ]}
                settingsItem={{
                    name: "Settings",
                    icon: <Settings className="!w-6 !h-6" />,
                    iconScale: "scale-95",
                }}
            />
            <main
                className={cn("transition-all pt-20 duration-300", {
                    "pl-[256px]": isSidenavOpen,
                    "pl-[100px]": !isSidenavOpen,
                })}
            >
                {children}
            </main>
        </>
    )
}
