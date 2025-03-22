"use client"
import AnimatedTabs from "@/components/shared/animated-tabs"
import EmptyDisplay from "@/components/shared/empty-display"
import { ErrorDisplay } from "@/components/shared/error-display"
import { Button } from "@/components/ui/button"
import DashboardPagination from "@/components/ui/dashboard-pagination"
import {
    QuizWithCategory,
    readQuizzesWithDetails,
} from "@/data-access/quizzes/read"
import { useIsAdmin } from "@/hooks/use-is-admin"
import { cn } from "@/lib/ui-utils"
import { useQuery } from "@tanstack/react-query"
import { BookOpen, ChevronRight, Plus, ZapIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "nextjs-toploader/app"
import { parseAsInteger, parseAsString, useQueryState } from "nuqs"
import { useState } from "react"
import Item from "./_components/item"
import ItemSkeleton from "./_components/item-skeleton"
import Search from "./_components/search"
import { useCurrentUser } from "@/hooks/use-current-user"

export default function Page() {
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
        queryFn: () =>
            readQuizzesWithDetails({
                isAdmin,
                userId: userData?.id || "",
                filters: {
                    name: searchValue || undefined,
                    isFeatured: activeTab === "popular",
                },
                pagination: {
                    itemsPerPage,
                    currentPage,
                },
            }),
    })
    const data = response?.data

    const tabs = [
        {
            id: "popular",
            label: "Popular Quizzes ",
            icon: <ZapIcon size={18} />,
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
        <section className="flex flex-col min-h-[50vh] px-10 py-10">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl text-neutral-600  font-extrabold">
                    Quizzes
                </h1>
                <div className="flex items-center gap-2">
                    <div className="mt-5 ">
                        <Search
                            searchValue={searchValue}
                            onSearchChange={setSearchValue}
                        />
                    </div>

                    <Link href={"/quizzes/add"}>
                        <Button className="text-base h-[3.2rem]">
                            <Plus className="-mr-1 !w-5 stroke-2 !h-5" /> Add
                            Quiz
                        </Button>
                    </Link>
                    {isAdmin && (
                        <Link href={"/admin/quizzes"}>
                            <Button
                                variant={"secondary"}
                                className="w-fit text-base h-[3.2rem] text-blue-500 border-blue-400 shadow-blue-400"
                            >
                                Dashboard{" "}
                                <ChevronRight className="stroke-3 !w-5 !h-5" />
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            <div className="w-full border-2 min-h-screen rounded-2xl p-5">
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
                        "grid  rounded-2xl  grid-cols-3 ml-auto px-2 py-2   gap-8 mb-2"
                    )}
                >
                    {isFetching &&
                        Array.from({ length: 8 }).map((_, i) => (
                            <ItemSkeleton key={i} />
                        ))}
                </div>

                <div className="mb-4 ">
                    <div
                        className={cn(
                            "grid grid-cols-3 rounded-2xl ml-auto px-2 py-2   gap-8 mb-2"
                        )}
                    >
                        {data?.map((item) => {
                            return <Item item={item} key={item.id} />
                        })}
                    </div>
                </div>

                {activeTab === "personal" && !data?.length && (
                    <EmptyDisplay
                        title="You have no quizzes yet"
                        icon={
                            <BookOpen size={50} className="text-indigo-500" />
                        }
                        buttonText="Generate your quiz"
                        description=""
                        onClick={() => router.push("/quizzes/add")}
                    />
                )}
                {activeTab === "popular" && !data?.length && (
                    <EmptyDisplay
                        title="No popular quizzes yet"
                        icon={<ZapIcon size={50} className="text-indigo-500" />}
                        buttonText="Add new quiz"
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
