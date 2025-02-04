import { ReactNode } from "react"
import { useSidenav } from "@/providers/sidenav-provider"
import { cn } from "@/lib/ui-utils"
import UserHeader from "@/components/shared/user-header"
import Sidenav from "@/components/shared/sidenav"

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
                    { name: "Learn", icon: "house" },
                    { name: "Ranking", icon: "shield" },
                    { name: "Quests", icon: "box" },
                    { name: "Shop", icon: "loot" },
                ]}
                settingsItem={{
                    name: "Settings",
                    icon: "settings",
                    iconScale: "scale-95",
                }}
            />
            <main
                className={cn("transition-all", {
                    "pl-[256px]": isSidenavOpen,
                    "pl-[100px]": !isSidenavOpen,
                })}
            >
                {children}
            </main>
        </>
    )
}
