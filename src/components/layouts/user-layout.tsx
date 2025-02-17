import Sidenav from "@/components/shared/sidenav"
import UserHeader from "@/components/shared/user-header"
import { useCurrentUser } from "@/hooks/use-current-user"
import { cn } from "@/lib/ui-utils"
import { useSidenav } from "@/providers/sidenav-provider"
import { ChartColumnDecreasing, Home, LockIcon, Settings } from "lucide-react"
import { ReactNode } from "react"

type Props = {
    children?: Readonly<ReactNode>
}
export default function UserLayout({ children }: Props) {
    const { isSidenavOpen } = useSidenav()
    const user = useCurrentUser()
    const adminItems =
        user.data?.user_role === "ADMIN"
            ? [
                  {
                      name: "Dashboard",
                      icon: <LockIcon className="!w-6 !h-6" />,
                      route: "/admin/dashboard",
                  },
              ]
            : []
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
                    ...adminItems,
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
