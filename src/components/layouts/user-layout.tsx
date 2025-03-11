import Sidenav from "@/components/shared/sidenav"
import UserHeader from "@/components/shared/user-header"
import { useCurrentUser } from "@/hooks/use-current-user"
import { cn } from "@/lib/ui-utils"
import { useSidenav } from "@/providers/sidenav-provider"
import {
    BookOpen,
    Brain,
    ClockIcon,
    CopyIcon,
    FileTextIcon,
    Home,
    LayoutGrid,
    LayoutListIcon,
    LockIcon,
    LucidePresentation,
    PlusCircle,
    Search,
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
                        name: "Courses",
                        icon: <BookOpen className="!w-6 !h-6" />,
                        route: "/courses",
                        subItems: [
                            {
                                icon: <LayoutListIcon className="!w-6 !h-6" />,
                                name: "All courses",
                                iconScale: "",
                                route: "/courses/all",
                            },
                            {
                                icon: (
                                    <LucidePresentation className="!w-6 !h-6" />
                                ),
                                name: "My courses",
                                iconScale: "",
                                route: "/courses/my-courses",
                            },
                        ],
                    },
                    {
                        name: "Quizzes",
                        icon: <WandSparklesIcon className="!w-6 !h-6" />,
                        route: "/generate-quiz",
                    },
                    {
                        name: "Flashcards",
                        icon: <CopyIcon className="!w-6 !h-6" />,
                        route: "/flash-cards",
                        subItems: [
                            {
                                icon: <LayoutGrid className="!w-6 !h-6" />,
                                name: "Flashcard List",
                                route: "/flash-cards/list",
                            },
                            {
                                icon: <PlusCircle className="!w-6 !h-6" />,
                                name: "Generate",
                                route: "/flash-cards/add",
                            },
                            {
                                icon: <Search className="!w-6 !h-6" />,
                                name: "Discover",
                                route: "/flash-cards/discover",
                            },
                        ],
                    },
                    {
                        name: "Summarize PDF",
                        icon: <FileTextIcon className="!w-6 !h-6" />,
                        route: "/summarize-pdf",
                    },
                    {
                        name: "Mindmaps",
                        icon: <Brain className="!w-6 !h-6" />,
                        route: "/mind-map",
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
