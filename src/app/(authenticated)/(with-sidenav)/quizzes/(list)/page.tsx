"use client"
import AnimatedTabs from "@/components/shared/animated-tabs"
import EmptyDisplay from "@/components/shared/empty-display"
import { ErrorDisplay } from "@/components/shared/error-display"
import { Button } from "@/components/ui/button"
import DashboardPagination from "@/components/ui/dashboard-pagination"
import {
    QuizWithCategory,
    readQuizzesWithDetails,
    readSharedQuizzesWithDetails,
} from "@/data-access/quizzes/read"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useIsAdmin } from "@/hooks/use-is-admin"
import { cn } from "@/lib/ui-utils"
import { useSidenav } from "@/providers/sidenav-provider"
import { useQuery } from "@tanstack/react-query"
import { BookOpen, ChevronRight, Plus, Share2Icon, ZapIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "nextjs-toploader/app"
import { parseAsInteger, parseAsString, useQueryState } from "nuqs"
import { useMemo, useState } from "react"
import Item from "./_components/item"
import ItemSkeleton from "./_components/item-skeleton"
import Search from "./_components/search"
import { getLanguage } from "@/utils/get-language"
import { translation } from "./translation"
import { useTheme } from "next-themes"

export default function Page() {
    const translation = useMemo(
        () => ({
            en: {
                Quizzes: "Quizzes",
                "Shared Quizzes": "Shared Quizzes",
                "My Quizzes": "My Quizzes",
                "Add Quiz": "Add Quiz",
                Dashboard: "Dashboard",
                "You have no quizzes yet": "You have no quizzes yet",
                "Generate your quiz": "Generate your quiz",
                "No popular quizzes yet": "No popular quizzes yet",
                "Add new quiz": "Add new quiz",
                "Search quizzes": "Search quizzes...",
            },
            fr: {
                Quizzes: "Quiz",
                "Shared Quizzes": "Quiz partagés",
                "My Quizzes": "Mes quiz",
                "Add Quiz": "Ajouter un quiz",
                Dashboard: "Tableau de bord",
                "You have no quizzes yet": "Vous n'avez pas encore de quiz",
                "Generate your quiz": "Générez votre quiz",
                "No popular quizzes yet": "Aucun quiz populaire pour le moment",
                "Add new quiz": "Ajouter un nouveau quiz",
                "Search quizzes": "Rechercher des quiz...",
            },
            ar: {
                Quizzes: "الاختبارات",
                "Shared Quizzes": "الاختبارات المشتركة",
                "My Quizzes": "اختباراتي",
                "Add Quiz": "إضافة اختبار",
                Dashboard: "لوحة التحكم",
                "You have no quizzes yet": "ليس لديك أي اختبارات بعد",
                "Generate your quiz": "أنشئ اختبارك",
                "No popular quizzes yet": "لا توجد اختبارات شائعة بعد",
                "Add new quiz": "أضف اختبارًا جديدًا",
                "Search quizzes": "ابحث في الاختبارات...",
            },
        }),
        []
    )
    const { theme } = useTheme()
    const isDark = theme === "dark"
    const lang = getLanguage()
    const t = translation[lang]
    const { isSidenavOpen } = useSidenav()
    const isAdmin = useIsAdmin()
    const { data: userData } = useCurrentUser()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState("personal")
    const [searchValue, setSearchValue] = useQueryState(
        "search-value",
        parseAsString.withDefault("")
    )
    const [itemsPerPage, setItemsPerPage] = useQueryState(
        "items-per-page",
        parseAsInteger.withDefault(9)
    )
    const [currentPage, setCurrentPage] = useQueryState(
        "page",
        parseAsInteger.withDefault(1)
    )
    const {
        data: response,
        isError,
        isFetching,
    } = useQuery({
        enabled: isAdmin !== null,
        queryKey: [
            "quizzes",
            "quizzes_categories",
            "quiz_submissions",
            "quizzes_questions",
            itemsPerPage,
            currentPage,
            searchValue,
            activeTab,
            isAdmin,
            userData,
        ],
        queryFn: async () => {
            if (activeTab === "personal") {
                return await readQuizzesWithDetails({
                    isAdmin,
                    userId: userData?.id || "",
                    filters: {
                        name: searchValue || undefined,
                    },
                    pagination: {
                        itemsPerPage,
                        currentPage,
                    },
                })
            } else {
                const result = await readSharedQuizzesWithDetails({
                    isAdmin,
                    userId: userData?.id || "",
                    filters: {
                        name: searchValue || undefined,
                    },
                    pagination: {
                        itemsPerPage,
                        currentPage,
                    },
                })
                const formatted = {
                    data:
                        result.data.flatMap((item) => item.quizzes) ||
                        ([] as any),
                    count: result.count,
                }
                return formatted
            }
        },
    })
    const data = response?.data

    const tabs = [
        {
            id: "shared",
            label: t["Shared Quizzes"],
            icon: <Share2Icon size={18} />,
            count: response?.count || 0,
        },
        {
            id: "personal",
            label: t["My Quizzes"],
            icon: <BookOpen size={18} />,
            count: 0,
        },
    ]
    if (isError) {
        return <ErrorDisplay />
    }
    return (
        <section
            className="
                flex flex-col min-h-[50vh] md:px-10 px-3 py-10
                bg-white dark:bg-neutral-900
                transition-colors
            "
        >
            <div
                className={cn(
                    "sm:flex hidden fixed z-50 bg-white border-t top-[10vh] pt-4 justify-between md:items-center transition-colors dark:bg-neutral-900 dark:border-neutral-800",
                    {
                        "lg:left-[300px] lg:rtl:right-[300px] left-0 lg:w-[calc(100vw-306px)] w-screen px-3 md:px-8":
                            isSidenavOpen,
                        "lg:left-[100px] lg:rtl:right-[100px] left-0 lg:w-[calc(100vw-106px)] md:px-8 px-3 w-screen":
                            !isSidenavOpen,
                    }
                )}
            >
                <h1 className="text-4xl md:pt-0 pt-3 text-neutral-600 dark:text-neutral-100 font-extrabold transition-colors">
                    {t["Quizzes"]}
                </h1>
                <div className="md:flex-row flex flex-col-reverse md:pb-0 pb-2 items-end md:items-center md:gap-2">
                    <div className="mt-5 w-full">
                        <Search
                            searchValue={searchValue}
                            onSearchChange={setSearchValue}
                        />
                    </div>
                    <Link href={"/quizzes/add"}>
                        <Button
                            variant={isDark ? "blue" : "default"}
                            className="text-base h-[3.2rem]  text-white  transition-colors"
                        >
                            <Plus className="-mr-1 !w-5 stroke-2 !h-5" />{" "}
                            {t["Add Quiz"]}
                        </Button>
                    </Link>
                    {isAdmin && (
                        <Link href={"/admin/quizzes"}>
                            <Button
                                variant={"secondary"}
                                className="w-fit text-base h-[3.2rem] text-blue-500 border-blue-400 shadow-blue-400 dark:text-blue-300 dark:border-blue-700 dark:shadow-blue-900/40 transition-colors"
                            >
                                {t["Dashboard"]}{" "}
                                <ChevronRight className="stroke-3 !w-5 !h-5" />
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            <div className="w-full md:border-2 dark:md:border-neutral-800 min-h-screen md:mt-18 sm:mt-36 rounded-2xl md:p-5 bg-white dark:bg-neutral-900 transition-colors">
                <div className="flex items-center rtl:flex-row-reverse">
                    <h1 className="text-4xl md:hidden block pb-5 text-neutral-600 dark:text-neutral-100 font-extrabold transition-colors">
                        {t["Quizzes"]}
                    </h1>
                    <Link href={"/quizzes/add"} className="md:hidden ml-auto">
                        <Button
                            variant={isDark ? "blue" : "default"}
                            className="text-base h-[3rem] -mt-4 text-white  transition-colors"
                        >
                            <Plus className="-mr-1 !w-5 stroke-2 !h-5" />{" "}
                            {t["Add Quiz"]}
                        </Button>
                    </Link>
                </div>
                <AnimatedTabs
                    className="ml-auto mb-4"
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={(tab) => {
                        setActiveTab(tab)
                        setCurrentPage(1)
                    }}
                />

                <div
                    className={cn(
                        "grid rounded-2xl min-[1800px]:grid-cols-4 md:grid-cols-3 ml-auto px-2 sm:py-2 gap-8 mb-2"
                    )}
                >
                    {isFetching &&
                        Array.from({ length: 8 }).map((_, i) => (
                            <ItemSkeleton key={i} />
                        ))}
                </div>

                <div className="mb-4">
                    <div
                        className={cn(
                            "grid sm:grid-cols-2 xl:grid-cols-3 min-[1800px]:grid-cols-4 rounded-2xl ml-auto px-2 py-2 gap-8 mb-2"
                        )}
                    >
                        {data?.map((item) => {
                            return (
                                <Item
                                    item={item as any}
                                    disableMoreBtn={activeTab === "shared"}
                                    key={item.id}
                                />
                            )
                        })}
                    </div>
                </div>

                {activeTab === "personal" && !data?.length && !isFetching && (
                    <EmptyDisplay
                        title={t["You have no quizzes yet"]}
                        icon={
                            <BookOpen
                                size={50}
                                className="text-indigo-500 dark:text-indigo-300"
                            />
                        }
                        buttonText={t["Generate your quiz"]}
                        description=""
                        onClick={() => router.push("/quizzes/add")}
                    />
                )}
                {activeTab === "popular" && !data?.length && !isFetching && (
                    <EmptyDisplay
                        title={t["No popular quizzes yet"]}
                        icon={
                            <ZapIcon
                                size={50}
                                className="text-indigo-500 dark:text-indigo-300"
                            />
                        }
                        buttonText={t["Add new quiz"]}
                        description=""
                        onClick={() => router.push("/quizzes/add")}
                    />
                )}
            </div>
            <DashboardPagination
                currentPage={currentPage}
                itemsCount={response?.count || 0}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={setItemsPerPage}
            />
        </section>
    )
}

export type ItemType = QuizWithCategory
