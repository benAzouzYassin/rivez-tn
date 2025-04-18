import {
    Brain,
    Gamepad2Icon,
    Home,
    LockIcon,
    PlusCircle,
    Rocket,
    Telescope,
} from "lucide-react"
import { useCurrentUser } from "./use-current-user"

export function useNavigationItems() {
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
    const normalUserItems = [
        {
            name: "Home",
            icon: <Home className="!w-6 !h-6" />,
            route: "/home",
        },
        {
            name: "Quizzes",
            icon: <Gamepad2Icon className="!w-6 !h-6" />,
            route: "/quizzes",
        },
        {
            name: "Mind maps",
            icon: <Brain className="!w-6 !h-6" />,
            route: "/mind-maps",
        },
        {
            name: "Summarize",
            icon: <Telescope className="!w-6 !h-6" />,
            route: "/summarize",
        },
        {
            name: "Our Offers",
            icon: <Rocket className="!w-6 !h-6" />,
            route: "/offers",
        },

        ...adminItems,
    ]
    const bottomItem = {
        route: "/get-credits",
        name: "Get credits",
        icon: <PlusCircle className="!w-6 stroke-[2.5]  !h-6" />,
    }
    return { normalUserItems, bottomItem }
}
