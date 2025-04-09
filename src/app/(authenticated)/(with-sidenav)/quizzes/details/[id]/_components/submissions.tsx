import { DataTable } from "@/components/ui/data-table"
import { columns } from "../table-columns"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { readQuizSubmissions } from "@/data-access/quizzes/read"
import { parseAsInteger, useQueryState } from "nuqs"
import DashboardPagination from "@/components/ui/dashboard-pagination"
export default function Submissions() {
    const [itemsPerPage, setItemsPerPage] = useQueryState(
        "items-per-page",
        parseAsInteger.withDefault(5)
    )

    const [currentPage, setCurrentPage] = useQueryState(
        "page",
        parseAsInteger.withDefault(1)
    )
    const params = useParams()
    const quizId = Number(params["id"])
    const { isLoading, data } = useQuery({
        queryKey: [
            "quiz_submissions",
            "user_profiles",
            "quiz_submission_answers",
            itemsPerPage,
            currentPage,
            quizId,
        ],
        queryFn: () =>
            readQuizSubmissions({
                quizId,
                pagination: {
                    currentPage,
                    itemsPerPage,
                },
            }),
    })
    return (
        <>
            <DataTable
                columns={columns}
                isLoading={isLoading}
                data={data?.items || []}
            />
            <DashboardPagination
                currentPage={currentPage}
                itemsCount={data?.count || 0}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={setItemsPerPage}
            />
        </>
    )
}

export type SubmissionType = Awaited<
    ReturnType<typeof readQuizSubmissions>
>["items"][number]
