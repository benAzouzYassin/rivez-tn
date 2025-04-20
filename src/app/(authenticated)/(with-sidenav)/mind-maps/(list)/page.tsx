"use client"
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
import { useState } from "react"
import AddDialog from "./_components/add-dialog"
import Item from "./_components/item"
import ItemSkeleton from "./_components/item-skeleton"
import Search from "./_components/search"
import ShareDialog from "./_components/share-dialog"
import AnimatedTabs from "@/components/shared/animated-tabs"

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
            label: "Shared Quizzes ",
            icon: <Share2Icon size={18} />,
            count: response?.count || 0,
        },
        {
            id: "personal",
            label: "My Quizzes",
            icon: <BookOpen size={18} />,
            count: 0,
        },
    ]

    if (isError) {
        return <ErrorDisplay />
    }
    return (
        <section className="flex isolate flex-col min-h-[50vh] md:px-10 px-3 py-10">
            <div
                className={cn(
                    "flex w-full fixed  z-40  bg-white border-t top-[10vh] pt-4  justify-between items-center",
                    {
                        "md:left-[300px] md:w-[calc(100vw-306px)] md:px-8  ":
                            isSidenavOpen,
                        "md:left-[100px] md:w-[calc(100vw-106px)] md:px-8  ":
                            !isSidenavOpen,
                    }
                )}
            >
                {" "}
                <h1 className="md:text-4xl text-3xl text-neutral-600  font-extrabold">
                    Mind maps
                </h1>
                <div className="flex  items-center gap-2">
                    <div className="mt-5 md:block hidden ">
                        <Search
                            searchValue={searchValue}
                            onSearchChange={setSearchValue}
                        />
                    </div>

                    <div className="md:scale-100 flex md:pr-0 pr-4 scale-90 ">
                        <AddDialog isOpen={isAdding} setIsOpen={setIsAdding} />
                    </div>
                </div>
            </div>

            <div className="w-full  min-h-screen md:mt-18 mt-3  ">
                <div
                    className={cn(
                        "grid  rounded-2xl md:grid-cols-2 grid-cols-1  xl:grid-cols-3  min-[1700px]:grid-cols-4 ml-auto px-2 py-2   gap-8 mb-2"
                    )}
                >
                    {isFetching &&
                        Array.from({ length: 8 }).map((_, i) => (
                            <ItemSkeleton key={i} />
                        ))}
                </div>

                <div className="mb-4 ">
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
                            "grid md:grid-cols-2 grid-cols-1   lg:grid-cols-3 min-[1700px]:grid-cols-4 rounded-2xl ml-auto px-2 py-4 md:py-2   gap-8 mb-2"
                        )}
                    >
                        {!data?.length && !isFetching && (
                            <div className="flex w-full items-center justify-center gap-4 h-80 col-span-3 flex-col">
                                <p className="text-5xl font-bold text-neutral-400">
                                    no items...
                                </p>
                                <Button onClick={() => setIsAdding(true)}>
                                    <Plus /> Add mindmap
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
