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
import { parseAsInteger, parseAsString, useQueryState } from "nuqs"
import { useState } from "react"
import AddQuizDialog from "./_components/add-quiz-dialog"
import Search from "./_components/search"
import { columns } from "./table-columns"

export default function Page() {
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
    const [isAddingQuiz, setIsAddingQuiz] = useState(false)

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
    console.log(data)
    if (isError) {
        return <ErrorDisplay />
    }
    return (
        <section className="flex flex-col min-h-[50vh] px-10 py-10">
            <div className="flex items-center gap-3">
                <h1 className="text-[2.5rem] font-bold">Quizzes List</h1>
                <div className="text-lg font-extrabold opacity-80 py-1 px-5  rounded-full bg-blue-50 text-blue-600 border-2 border-blue-400">
                    {response?.count || 0} Quiz
                </div>
            </div>
            <section className=" flex justify-between mt-5 mb-3 min-h-10">
                <Search
                    searchValue={searchValue}
                    onSearchChange={setSearchValue}
                />
                <div className="flex  gap-3">
                    <Button
                        disabled
                        variant={"secondary"}
                        className="text-base  !cursor-not-allowed text-sky-700 border-blue-300 shadow-blue-300"
                    >
                        <Filter />
                        Filters (soon...)
                    </Button>
                    <Button
                        className="text-base "
                        variant={"blue"}
                        onClick={() => {
                            setIsAddingQuiz(true)
                        }}
                    >
                        <Plus />
                        Add quiz
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
            <AddQuizDialog
                isOpen={isAddingQuiz}
                onOpenChange={setIsAddingQuiz}
            />
        </section>
    )
}

export type Item = QuizWithCategory
