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
            count: response?.count || 0, // Note: This count likely only reflects the current data fetch, not the total shared count across all pages.
        },
        {
            id: "personal",
            label: "My Quizzes",
            icon: <BookOpen size={18} />,
            count: 0, // Note: This count is hardcoded to 0. You might want to fetch the total count for personal quizzes.
        },
    ]

    if (isError) {
        return <ErrorDisplay />
    }

    // Calculate padding for the main content to prevent overlap with the fixed header
    // Adjust these values based on the actual height of your fixed header at different breakpoints
    const contentPaddingTopClasses = "pt-[12vh] md:pt-[15vh]" // Example: Add more padding top

    return (
        <section
            className={cn(
                "flex isolate flex-col min-h-[50vh] px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10",
                contentPaddingTopClasses
            )}
        >
            <div
                className={cn(
                    "flex md:flex-row flex-col md:gap-0 gap-5 px-2 fixed top-[10vh] left-0 right-0 w-full z-40 bg-white border-t pt-4 md:px-4 sm:px-6 lg:px-8 justify-between items-center transition-all duration-300 ease-in-out", // Added transition for smoother sidenav open/close
                    {
                        "md:left-[300px] md:w-[calc(100vw-306px)]":
                            isSidenavOpen, // Apply sidenav aware positioning only on medium screens and up
                        "md:left-[100px] md:w-[calc(100vw-106px)]":
                            !isSidenavOpen, // Apply sidenav aware positioning only on medium screens and up
                    }
                )}
            >
                <h1 className="text-3xl lg:text-4xl text-neutral-600 font-extrabold truncate mr-4">
                    {" "}
                    {/* Added truncate and mr for potential overflow */}
                    Mind maps
                </h1>
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                    {" "}
                    {/* Adjusted layout for smaller screens */}
                    <div className="w-full sm:w-auto mt-2 sm:mt-0 md:block hidden">
                        {" "}
                        {/* Adjusted margin and width */}
                        <Search
                            searchValue={searchValue}
                            onSearchChange={setSearchValue}
                        />
                    </div>
                    <AddDialog isOpen={isAdding} setIsOpen={setIsAdding} />{" "}
                    {/* AddDialog is triggered by the button */}
                    {/* The add button is now inside the AddDialog component, which is good. */}
                </div>
            </div>

            {/* Main content area - padding top is handled by the section element */}
            <div className="w-full md:mt-6 mt-14 min-h-screen">
                {/* Skeleton loading state */}
                <div
                    className={cn(
                        "grid rounded-2xl grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 min-[1700px]:grid-cols-4 px-2 py-2 gap-4 sm:gap-6 md:gap-8 mb-2"
                    )}
                >
                    {isFetching &&
                        Array.from({ length: itemsPerPage }).map(
                            (
                                _,
                                i // Render skeleton based on itemsPerPage
                            ) => <ItemSkeleton key={i} />
                        )}
                </div>

                <div className="mb-4">
                    {!isFetching && (
                        <AnimatedTabs
                            className="ml-auto mb-4 overflow-x-auto" // overflow-x-auto helps responsiveness for many tabs
                            tabs={tabs}
                            activeTab={activeTab}
                            onTabChange={(tab) => {
                                setActiveTab(tab)
                                setCurrentPage(1)
                            }}
                        />
                    )}
                    {/* Actual data display grid */}
                    <div
                        className={cn(
                            "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 min-[1700px]:grid-cols-4 rounded-2xl px-2 py-2 gap-4 sm:gap-6 md:gap-8 mb-2" // Removed ml-auto to potentially center grid on smaller screens if desired, or leave for alignment
                        )}
                    >
                        {!data?.length && !isFetching && (
                            <div className="flex w-full items-center justify-center gap-4 h-80 col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-3 min-[1700px]:col-span-4 flex-col">
                                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-400 text-center px-4">
                                    {" "}
                                    {/* Adjusted text size and added padding */}
                                    no items...
                                </p>
                                {/* The Add button is now part of the fixed header for better visibility */}
                                {/* <Button onClick={() => setIsAdding(true)}>
                                    <Plus /> Add mindmap
                                </Button> */}
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
