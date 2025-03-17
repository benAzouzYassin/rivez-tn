import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/ui-utils"
import { ColumnDef } from "@tanstack/react-table"
import QuestionResponses from "./_components/question-responses"
import { AnswerTableItem } from "./page"
import { formatSeconds } from "@/utils/date"

export const columns: ColumnDef<AnswerTableItem>[] = [
    {
        id: "checkbox",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllRowsSelected()}
                onCheckedChange={(checked) =>
                    table.toggleAllRowsSelected(!!checked)
                }
                className="border-neutral-400/60 z-[2] w-6 h-6"
            />
        ),
        cell: ({ row }) => (
            <div className="flex p-0 relative min-h-16 items-center justify-center">
                <div
                    className={cn(
                        "absolute bg-blue-500 rounded-r-full w-2 scale-y-0 h-20 -top-2 -left-2 transition-transform",
                        {
                            "scale-y-100": row.getIsSelected(),
                        }
                    )}
                />
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={() => row.toggleSelected()}
                    className="w-6 h-6"
                />
            </div>
        ),
    },
    {
        id: "Question",
        header: "Question",
        cell: ({ row }) => (
            <div className="flex items-center text-base justify-center font-bold">
                {row.original.question}
            </div>
        ),
    },
    {
        id: "Time spent",
        header: "Time spent",
        cell: ({ row }) => (
            <div className="flex items-center text-base justify-center font-bold">
                {formatSeconds(row.original?.timeSpent || 0)} Min
            </div>
        ),
    },

    {
        id: "Status",
        header: "Status",
        cell: ({ row }) => {
            return (
                <div className="flex items-center justify-center font-bold">
                    {row.original.status === "failed" && (
                        <Badge variant={"red"}> {row.original.status}</Badge>
                    )}
                    {row.original.status === "succeeded" && (
                        <Badge variant={"green"}> {row.original.status}</Badge>
                    )}
                    {row.original.status === "skipped" && (
                        <Badge variant={"gray"}> {row.original.status}</Badge>
                    )}
                </div>
            )
        },
    },

    {
        id: "actions",
        cell: ({ row }) => (
            <div className="min-w-[100px] flex items-center justify-center">
                <QuestionResponses
                    questionContent={row.original.questionContent}
                    questionImage={row.original.questionImage}
                    question={row.original.question || ""}
                    questionType={
                        (row.original.questionType as any) || "MULTIPLE_CHOICE"
                    }
                    responses={row.original.responseContent}
                    correctAnswers={row.original.correctAnswers}
                />
            </div>
        ),
    },
]

export default columns
