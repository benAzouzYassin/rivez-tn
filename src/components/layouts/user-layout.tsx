import Sidenav from "@/components/shared/sidenav"
import UserHeader from "@/components/shared/user-header"
import { useCurrentUser } from "@/hooks/use-current-user"
import { cn } from "@/lib/ui-utils"
import { useSidenav } from "@/providers/sidenav-provider"
import {
    ClockIcon,
    CopyIcon,
    FileTextIcon,
    Home,
    LockIcon,
    PlusCircle,
    WandSparklesIcon,
} from "lucide-react"
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
                      route: "/admin/quizzes",
                  },
              ]
            : []
    return (
        <>
            <UserHeader />
            <Sidenav
                items={[
                    {
                        name: "Home",
                        icon: <Home className="!w-6 !h-6" />,
                        route: "/home",
                    },
                    {
                        name: "Generate a quiz",
                        icon: <WandSparklesIcon className="!w-6 !h-6" />,
                        route: "/generate-quiz",
                    },
                    {
                        name: "Flash cards",
                        icon: <CopyIcon className="!w-6 !h-6" />,
                        route: "/flash-cards",
                    },
                    {
                        name: "Spaced repetition",
                        icon: <ClockIcon className="!w-6 !h-6" />,
                        route: "/spaced-repetition",
                    },
                    {
                        name: "Summarize PDF",
                        icon: <FileTextIcon className="!w-6 !h-6" />,
                        route: "/summarize-pdf",
                    },
                    ...adminItems,
                ]}
                bottomItem={{
                    route: "/get-credits",
                    name: "Get credits",
                    icon: <PlusCircle className="!w-6 stroke-[2.5]  !h-6" />,
                    iconScale: "scale-95",
                }}
            />
            <main
                className={cn("transition-all pt-20 duration-300", {
                    "pl-[300px]": isSidenavOpen,
                    "pl-[100px]": !isSidenavOpen,
                })}
            >
                {children}
            </main>
        </>
    )
}
