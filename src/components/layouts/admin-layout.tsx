import { cn } from "@/lib/ui-utils"
import { useSidenav } from "@/providers/sidenav-provider"
import { ReactNode } from "react"
import UserHeader from "@/components/shared/user-header"
import Sidenav from "@/components/shared/sidenav"
import {
    AppWindowIcon,
    BookCopy,
    Gamepad2,
    Home,
    Settings,
    SquareMousePointer,
    Users2,
} from "lucide-react"

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
                        name: "Categories",
                        icon: <BookCopy className="!w-6 !h-6" />,
                        route: "/admin/categories",
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
                        name: "Public view",
                        icon: <AppWindowIcon className="!w-6 !h-6" />,
                        route: "/learn",
                    },
                ]}
                settingsItem={{
                    name: "Settings",
                    icon: <Settings className="!w-6 !h-6" />,
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
