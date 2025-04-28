"use client"
import { ErrorDisplay } from "@/components/shared/error-display"
import { Button } from "@/components/ui/button"
import DashboardPagination from "@/components/ui/dashboard-pagination"
import { DataTable } from "@/components/ui/data-table"
import {
    QuizWithCategory,
    readQuizzesWithDetails,
} from "@/data-access/quizzes/read"

import { useQuery } from "@tanstack/react-query"
import { Filter, Plus } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"
import { parseAsInteger, parseAsString, useQueryState } from "nuqs"
import Search from "./_components/search"
import { columns } from "./table-columns"

export default function Page() {
    const router = useRouter()
    const [searchValue, setSearchValue] = useQueryState(
        "search-value",
        parseAsString.withDefault("")
    )
    const [itemsPerPage, setItemsPerPage] = useQueryState(
        "items-per-page",
        parseAsInteger.withDefault(10)
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
        queryKey: [
            "quizzes",
            "quizzes_categories",
            "quiz_submissions",
            "quizzes_questions",
            itemsPerPage,
            currentPage,
            searchValue,
        ],
        queryFn: () =>
            readQuizzesWithDetails({
                isAdmin: true,
                userId: null,
                filters: {
                    name: searchValue || undefined,
                },
                pagination: {
                    itemsPerPage,
                    currentPage,
                },
            }),
    })
    const data = response?.data
    if (isError) {
        return <ErrorDisplay />
    }
    return (
        <section
            className="
                flex flex-col min-h-[50vh] px-10 py-10
                bg-white dark:bg-neutral-900
                transition-colors
            "
        >
            <div className="flex items-center gap-3">
                <h1 className="text-[2.5rem] font-bold text-neutral-900 dark:text-neutral-100 transition-colors">
                    Quizzes List
                </h1>
                <div
                    className="
                        text-lg font-extrabold opacity-80 py-1 px-5 rounded-full
                        bg-blue-50 text-blue-600 border-2 border-blue-400
                        dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-700
                        transition-colors
                    "
                >
                    {response?.count || 0} Quiz
                </div>
            </div>
            <section className="flex justify-between mt-5 mb-3 min-h-10">
                <Search
                    searchValue={searchValue}
                    onSearchChange={setSearchValue}
                />
                <div className="flex gap-3">
                    <Button
                        disabled
                        variant={"secondary"}
                        className="
                            text-base !cursor-not-allowed
                            text-sky-700 border-blue-300 shadow-blue-300
                            dark:text-sky-300 dark:border-blue-700 dark:shadow-blue-900/40
                            transition-colors
                        "
                    >
                        <Filter />
                        Filters (soon...)
                    </Button>
                    <Button
                        className="
                            text-base
                            bg-blue-600 text-white
                            dark:bg-blue-700 dark:text-blue-100
                            transition-colors
                        "
                        variant={"blue"}
                        onClick={() => {
                            router.push("/quizzes/add")
                        }}
                    >
                        <Plus />
                        Add quiz
                    </Button>
                </div>
            </section>
            <div
                className="
                    bg-white dark:bg-neutral-800
                    border border-neutral-200 dark:border-neutral-700
                    rounded-xl shadow
                    transition-colors
                "
            >
                <DataTable
                    isLoading={isFetching}
                    columns={columns}
                    data={data || []}
                />
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

export type Item = QuizWithCategory
