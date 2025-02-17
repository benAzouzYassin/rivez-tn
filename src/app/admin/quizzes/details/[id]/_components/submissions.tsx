import { DataTable } from "@/components/ui/data-table"
import { columns } from "../table-columns"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { readQuizSubmissions } from "@/data-access/quizzes/read"
export default function Submissions() {
    const params = useParams()
    const quizId = Number(params["id"])
    const { isLoading, data } = useQuery({
        queryKey: [
            "quiz_submissions",
            "user_profiles",
            "quiz_submission_answers",
            quizId,
        ],
        queryFn: () => readQuizSubmissions({ quizId }),
    })
    return (
        <DataTable columns={columns} isLoading={isLoading} data={data || []} />
    )
}

export type SubmissionType = Awaited<
    ReturnType<typeof readQuizSubmissions>
>[number]
