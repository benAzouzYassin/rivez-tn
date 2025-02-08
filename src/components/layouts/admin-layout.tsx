import { cn } from "@/lib/ui-utils"
import { useSidenav } from "@/providers/sidenav-provider"
import { ReactNode } from "react"
import UserHeader from "@/components/shared/user-header"
import Sidenav from "@/components/shared/sidenav"

type Props = {
    children?: Readonly<ReactNode>
}
export default function AdminLayout({ children }: Props) {
    const { isSidenavOpen } = useSidenav()
    return (
        <>
            <UserHeader />
            <Sidenav
                items={[
                    {
                        name: "Dashboard",
                        icon: "house",
                        route: "/admin/dashboard",
                        iconScale: "105",
                    },
                    {
                        name: "Quizzes",
                        icon: "quiz",
                        route: "/admin/quizzes/list",
                    },
                ]}
                settingsItem={{
                    name: "Settings",
                    icon: "settings",
                    iconScale: "scale-95",
                }}
            />
            <main
                className={cn(
                    "transition-all pt-20 min-h-[100vh] duration-300",
                    {
                        "pl-[256px]": isSidenavOpen,
                        "pl-[100px]": !isSidenavOpen,
                    }
                )}
            >
                {children}
            </main>
        </>
    )
}
