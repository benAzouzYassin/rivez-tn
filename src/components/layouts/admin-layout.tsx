import Sidenav from "@/components/shared/sidenav"
import UserHeader from "@/components/shared/user-header"
import { cn } from "@/lib/ui-utils"
import { useSidenav } from "@/providers/sidenav-provider"
import {
    AppWindowIcon,
    Gamepad2,
    Settings,
    SquareMousePointer,
    Users2,
} from "lucide-react"
import { ReactNode } from "react"

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
                    // {
                    //     name: "Dashboard",
                    //     icon: <Home className="!w-6 !h-6" />,
                    //     route: "/admin/dashboard",
                    //     iconScale: "105",
                    // },
                    {
                        name: "Quizzes",
                        icon: <Gamepad2 className="!w-6 !h-6" />,
                        route: "/admin/quizzes",
                    },
                    {
                        name: "Submissions",
                        icon: <SquareMousePointer className="!w-6 !h-6" />,
                        route: "/admin/quiz-submissions",
                    },
                    {
                        name: "Users",
                        icon: <Users2 className="!w-6 !h-6" />,
                        route: "/admin/users",
                    },
                    {
                        name: "Home page",
                        icon: <AppWindowIcon className="!w-6 !h-6" />,
                        route: "/home",
                    },
                ]}
                bottomItem={{
                    name: "Settings",
                    icon: <Settings className="!w-6 !h-6" />,
                }}
            />
            <main
                dir="ltr"
                className={cn(
                    "transition-all pt-20 min-h-[100vh] duration-300",
                    {
                        "pl-[300px]": isSidenavOpen,
                        "pl-[100px]": !isSidenavOpen,
                    }
                )}
            >
                {children}
            </main>
        </>
    )
}
