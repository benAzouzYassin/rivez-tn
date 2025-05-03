"use client"

import { useState, useMemo } from "react"
import { ErrorDisplay } from "@/components/shared/error-display"
import { Button } from "@/components/ui/button"
import DashboardPagination from "@/components/ui/dashboard-pagination"
import { readMindmaps, readSharedMindmaps } from "@/data-access/mindmaps/read"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useIsAdmin } from "@/hooks/use-is-admin"
import { cn } from "@/lib/ui-utils"
import { useSidenav } from "@/providers/sidenav-provider"
import { useQuery } from "@tanstack/react-query"
import { BookOpen, Plus, Share2Icon } from "lucide-react"
import { parseAsInteger, parseAsString, useQueryState } from "nuqs"
import AddDialog from "./_components/add-dialog"
import Item from "./_components/item"
import ItemSkeleton from "./_components/item-skeleton"
import Search from "./_components/search"
import ShareDialog from "./_components/share-dialog"
import AnimatedTabs from "@/components/shared/animated-tabs"
import { getLanguage } from "@/utils/get-language"
import { useTheme } from "next-themes"

export default function Page() {
    const [activeTab, setActiveTab] = useState("personal")
    const [isSharing, setIsSharing] = useState(false)
    const [sharingId, setSharingId] = useState<number>()
    const [isAdding, setIsAdding] = useState(false)
    const { isSidenavOpen } = useSidenav()
    const isAdmin = useIsAdmin()
    const { data: userData } = useCurrentUser()
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

    const translation = useMemo(
        () => ({
            en: {
                Mindmaps: "Mindmaps",
                Shared: "Shared",
                "My mindmaps": "My mindmaps",
                "no items...": "no items...",
                "Add mindmap": "Add mindmap",
            },
            fr: {
                Mindmaps: "Cartes mentales",
                Shared: "Partagés",
                "My mindmaps": "Mes Cartes",
                "no items...": "aucun élément...",
                "Add mindmap": "Ajouter",
            },
            ar: {
                Mindmaps: "الخرائط  الذهنية",
                Shared: " المشتركة",
                "My mindmaps": "خرائطي",
                "no items...": "لا توجد عناصر...",
                "Add mindmap": "إضافة",
            },
        }),
        []
    )
    const { theme } = useTheme()
    const isDark = theme === "dark"
    const lang = getLanguage()
    const t = translation[lang]

    const {
        data: response,
        isError,
        isFetching,
    } = useQuery({
        enabled: isAdmin !== null,
        queryKey: [
            "mindmaps",
            itemsPerPage,
            currentPage,
            searchValue,
            isAdmin,
            userData,
            activeTab,
        ],
        queryFn: () => {
            if (activeTab === "personal") {
                return readMindmaps({
                    isAdmin: !!isAdmin,
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
                return readSharedMindmaps({
                    isAdmin: !!isAdmin,
                    userId: userData?.id || "",
                    filters: {
                        name: searchValue || undefined,
                    },
                    pagination: {
                        itemsPerPage,
                        currentPage,
                    },
                })
            }
        },
    })
    const data = response?.data

    const tabs = [
        {
            id: "shared",
            label: t["Shared"],
            icon: <Share2Icon size={18} />,
            count: response?.count || 0,
        },
        {
            id: "personal",
            label: t["My mindmaps"],
            icon: <BookOpen size={18} />,
            count: 0,
        },
    ]

    if (isError) {
        return <ErrorDisplay />
    }
    return (
        <section className="flex isolate flex-col min-h-[50vh] md:px-10 px-3 py-10 bg-white dark:bg-neutral-900 transition-colors">
            <div
                className={cn(
                    "flex w-full max-w-[95vw] fixed pb-4 md:pb-2 z-40 bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-700 top-[10vh] pt-4 justify-between items-center lg:max-w-screen sm:max-w-screen md:max-w-[90vw] transition-colors",
                    {
                        "ltr:lg:left-[300px] rtl:md:right-[300px]  lg:w-[calc(100vw-306px)] lg:px-8  ":
                            isSidenavOpen,
                        "ltr:lg:left-[100px] rtl:lg:right-[100px] lg:w-[calc(100vw-106px)] lg:px-8  ":
                            !isSidenavOpen,
                    }
                )}
            >
                <h1 className="md:text-4xl text-3xl text-neutral-600 dark:text-neutral-100 font-extrabold">
                    {t["Mindmaps"]}
                </h1>
                <div className="flex md:flex-col-reverse sm:flex-row lg:flex-row  items-center gap-2">
                    <div className="mt-5 md:block hidden ">
                        <Search
                            searchValue={searchValue}
                            onSearchChange={setSearchValue}
                        />
                    </div>

                    <div className="md:scale-100 flex md:self-end sm:self-auto lg:self-auto md:pr-0 pr-4 scale-90 ">
                        <AddDialog isOpen={isAdding} setIsOpen={setIsAdding} />
                    </div>
                </div>
            </div>

            <div className="w-full min-h-screen md:mt-28 lg:mt-18 mt-8">
                <div
                    className={cn(
                        "grid rounded-2xl md:grid-cols-2 grid-cols-1 xl:grid-cols-3 min-[1700px]:grid-cols-4 ml-auto px-2 py-2 gap-8 mb-2"
                    )}
                >
                    {isFetching &&
                        Array.from({ length: 8 }).map((_, i) => (
                            <ItemSkeleton key={i} />
                        ))}
                </div>

                <div className="mb-4">
                    {!isFetching && (
                        <AnimatedTabs
                            className="ml-auto mb-4"
                            tabs={tabs}
                            activeTab={activeTab}
                            onTabChange={(tab) => {
                                setActiveTab(tab)
                                setCurrentPage(1)
                            }}
                        />
                    )}
                    <div
                        className={cn(
                            "grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3 min-[1700px]:grid-cols-4 rounded-2xl ml-auto px-2 py-4 md:py-2 gap-8 mb-2"
                        )}
                    >
                        {!data?.length && !isFetching && (
                            <div className="flex w-full items-center justify-center gap-4 h-80 col-span-3 flex-col">
                                <p className="text-5xl font-bold text-neutral-400 dark:text-neutral-600">
                                    {t["no items..."]}
                                </p>
                                <Button
                                    variant={isDark ? "blue" : "default"}
                                    className="bg-blue-600  text-white dark:text-white"
                                    onClick={() => setIsAdding(true)}
                                >
                                    <Plus /> {t["Add mindmap"]}
                                </Button>
                            </div>
                        )}
                        {data?.map((item) => {
                            return (
                                <div key={item.id}>
                                    <Item
                                        isSharing={isSharing}
                                        setIsSharing={(value) => {
                                            setIsSharing(value)
                                            setSharingId(item.id)
                                        }}
                                        item={item}
                                    />
                                    <ShareDialog
                                        isOpen={
                                            isSharing && item.id === sharingId
                                        }
                                        onOpenChange={setIsSharing}
                                        id={item.id}
                                        status={item.publishing_status}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>
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

export type ItemType = Awaited<ReturnType<typeof readMindmaps>>["data"][number]
