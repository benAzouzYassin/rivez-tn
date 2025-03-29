import Sidenav from "@/components/shared/sidenav"
import UserHeader from "@/components/shared/user-header"
import { useCurrentUser } from "@/hooks/use-current-user"
import { cn } from "@/lib/ui-utils"
import { useSidenav } from "@/providers/sidenav-provider"
import {
    BookOpen,
    Brain,
    CopyIcon,
    FileText,
    Gamepad2Icon,
    Home,
    ImageIcon,
    LayoutListIcon,
    LockIcon,
    PlusCircle,
    Rocket,
    Telescope,
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
                        route: "/courses/list",
                    },
                    {
                        name: "Quizzes",
                        icon: <Gamepad2Icon className="!w-6 !h-6" />,
                        route: "/quizzes",
                        subItems: [
                            {
                                icon: <LayoutListIcon className="!w-6 !h-6" />,
                                name: "Quizzes List",
                                route: "/quizzes/list",
                            },
                            {
                                icon: (
                                    <WandSparklesIcon className="!w-6 !h-6" />
                                ),
                                name: "Generate quiz",
                                route: "/quizzes/add",
                            },
                        ],
                    },
                    // {
                    //     name: "Leaderboard",
                    //     icon: <AwardIcon className="!w-6 !h-6" />,
                    //     route: "/leaderboard",
                    // },

                    // {
                    //     name: "Flashcards",
                    //     icon: <CopyIcon className="!w-6 !h-6" />,
                    //     route: "/flash-cards",
                    // },
                    {
                        name: "Mind maps",
                        icon: <Brain className="!w-6 !h-6" />,
                        route: "/mind-maps",
                    },
                    {
                        name: "Explain",
                        icon: <Telescope className="!w-6 !h-6" />,
                        subItems: [
                            {
                                icon: <FileText className="!w-6 !h-6" />,
                                name: "Upload PDF",
                                route: "/pdf-summarizer",
                            },
                            {
                                icon: <ImageIcon className="!w-6 !h-6" />,
                                name: "Upload Image",
                                route: "/image-summarizer",
                            },
                        ],
                    },
                    {
                        name: "Our Offers",
                        icon: <Rocket className="!w-6 !h-6" />,
                        route: "/offers",
                    },

                    ...adminItems,
                ]}
                bottomItem={{
                    route: "/get-credits",
                    name: "Get credits",
                    icon: <PlusCircle className="!w-6 stroke-[2.5]  !h-6" />,
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
