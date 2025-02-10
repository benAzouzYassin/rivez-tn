"use client"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import AddQuizDialog from "./_components/add-quiz-dialog"
import { useQuery } from "@tanstack/react-query"
import {
    QuizWithCategory,
    readQuizzesWithCategory,
} from "@/data-access/quizzes/read"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./table-columns"
import { ErrorDisplay } from "@/components/shared/error-display"

export default function Page() {
    const { data, isError, isLoading } = useQuery({
        queryKey: ["quizzes"],
        queryFn: () => readQuizzesWithCategory(),
    })

    const [isAddingQuiz, setIsAddingQuiz] = useState(false)
    console.log(data)
    if (isLoading) {
        return <div>loading.....</div>
    }
    if (isError) {
        return <ErrorDisplay />
    }
    return (
        <div className="flex flex-col min-h-[50vh] px-10 py-10">
            {/* <Button
                variant={"blue"}
                onClick={() => {
                    setIsAddingQuiz(true)
                }}
            >
                <Plus />
                Add new quiz
            </Button>
            <AddQuizDialog
                isOpen={isAddingQuiz}
                onOpenChange={setIsAddingQuiz}
            /> */}
            <DataTable columns={columns} data={data || []} />
        </div>
    )
}

export type Item = QuizWithCategory
