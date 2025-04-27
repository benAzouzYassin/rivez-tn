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
import { getLanguage } from "@/utils/get-language"

export function useNavigationItems() {
    const lang = getLanguage()
    const t = translation[lang]
    const user = useCurrentUser()
    const adminItems =
        user.data?.user_role === "ADMIN"
            ? [
                  {
                      name: t["Dashboard"],
                      icon: <LockIcon className="!w-6 !h-6" />,
                      route: "/admin/quizzes",
                  },
              ]
            : []
    const normalUserItems = [
        {
            name: t["Home"],
            icon: <Home className="!w-6 !h-6" />,
            route: "/home",
        },
        {
            name: t["Quizzes"],
            icon: <Gamepad2Icon className="!w-6 !h-6" />,
            route: "/quizzes",
        },
        {
            name: t["Mind maps"],
            icon: <Brain className="!w-6 !h-6" />,
            route: "/mind-maps",
        },
        {
            name: t["Summarize"],
            icon: <Telescope className="!w-6 !h-6" />,
            route: "/summarize?list=true",
        },
        {
            name: t["Our Offers"],
            icon: <Rocket className="!w-6 !h-6" />,
            route: "/offers",
        },

        ...adminItems,
    ]
    const bottomItem = {
        route: "/offers",
        name: t["Get credits"],
        icon: <PlusCircle className="!w-6 stroke-[2.5]  !h-6" />,
    }
    return { normalUserItems, bottomItem }
}
const translation = {
    en: {
        Dashboard: "Dashboard",
        Home: "Home",
        Quizzes: "Quizzes",
        "Mind maps": "Mind maps",
        Summarize: "Summarize",
        "Our Offers": "Our Offers",
        "Get credits": "Get credits",
    },
    fr: {
        Dashboard: "Tableau de bord",
        Home: "Accueil",
        Quizzes: "Quiz",
        "Mind maps": "Cartes mentales",
        Summarize: "Résumer",
        "Our Offers": "Nos offres",
        "Get credits": "Nos offres",
    },
    ar: {
        Dashboard: "لوحة القيادة",
        Home: "الرئيسية",
        Quizzes: "اختبارات",
        "Mind maps": "خرائط ذهنية",
        Summarize: "تلخيص",
        "Our Offers": "عروضنا",
        "Get credits": "الحصول على رصيد",
    },
}
