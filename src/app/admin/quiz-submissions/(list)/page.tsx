"use client"
import { ErrorDisplay } from "@/components/shared/error-display"
import { Button } from "@/components/ui/button"
import DashboardPagination from "@/components/ui/dashboard-pagination"
import { DataTable } from "@/components/ui/data-table"

import AddCategoryDialog from "@/components/shared/add-category-dialog"
import { readSubmissionsWithAllData } from "@/data-access/quiz_submissions/read"
import { useQuery } from "@tanstack/react-query"
import { Filter } from "lucide-react"
import { parseAsInteger, parseAsString, useQueryState } from "nuqs"
import { useEffect, useState } from "react"
import { columns } from "./table-columns"
import SearchInput from "@/components/shared/search-input"

export default function Page() {
    // const [viewMode, setViewMode] = useLocalStorage("view-mode", "list")
    const [viewMode, setViewMode] = useState("list")

    useEffect(() => {
        const savedMode = localStorage.getItem("view-mode") || "list"
        setViewMode(["cards", "list"].includes(savedMode) ? savedMode : "list")
    }, [])

    const [quizSearchValue, setQuizSearchValue] = useQueryState(
        "quiz-search-value",
        parseAsString.withDefault("")
    )
    const [userSearchValue, setUserSearchValue] = useQueryState(
        "user-search-value",
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
    const [isAddingCategory, setIsAddingCategory] = useState(false)

    const {
        data: response,
        isError,
        isFetching,
    } = useQuery({
        queryKey: [
            "quiz_submissions",
            "quiz_submission_answers",
            "quizzes",
            "user_profiles",
            itemsPerPage,
            currentPage,
            quizSearchValue,
            userSearchValue,
        ],
        queryFn: () =>
            readSubmissionsWithAllData({
                pagination: {
                    itemsPerPage,
                    currentPage,
                },
                filters: {
                    quizSearch: quizSearchValue,
                    userSearch: userSearchValue,
                },
            }),
    })
    const data = response?.data
    if (isError) {
        return <ErrorDisplay />
    }
    return (
        <section className="flex flex-col min-h-[50vh] p-10">
            <div className="flex items-center gap-3">
                <h1 className="text-[2.5rem] font-bold">Submissions List</h1>
                <div className="text-lg font-extrabold opacity-80 py-1 px-5  rounded-full bg-blue-50 text-blue-600 border-2 border-blue-400">
                    {response?.count || 0} Submission
                </div>
            </div>
            <section className=" flex justify-between my-5 min-h-10">
                <div className="flex items-center gap-2">
                    <SearchInput
                        searchValue={userSearchValue}
                        onSearchChange={setUserSearchValue}
                        placeholder="Username / Email "
                    />
                    <SearchInput
                        searchValue={quizSearchValue}
                        onSearchChange={setQuizSearchValue}
                        placeholder="Quiz name"
                    />
                </div>
                <div className="flex  gap-3">
                    <Button
                        disabled
                        variant={"secondary"}
                        className="text-base  !cursor-not-allowed text-sky-700 border-blue-300 shadow-blue-300"
                    >
                        <Filter />
                        Filters (soon...)
                    </Button>
                </div>
            </section>

            <DataTable
                isLoading={isFetching}
                columns={columns}
                data={data || []}
            />
            <DashboardPagination
                currentPage={currentPage}
                itemsCount={response?.count || 0}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={setItemsPerPage}
            />
            <AddCategoryDialog
                isOpen={isAddingCategory}
                onOpenChange={setIsAddingCategory}
            />
        </section>
    )
}

export type Item = Awaited<
    ReturnType<typeof readSubmissionsWithAllData>
>["data"][number]
