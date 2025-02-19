import { Checkbox } from "@/components/ui/checkbox"
import ImageWithPreview from "@/components/ui/img-with-preview"
import { cn } from "@/lib/ui-utils"
import { ColumnDef } from "@tanstack/react-table"
import { TableItem } from "./page"
import { formatDate } from "@/utils/date"
// import MoreButton from "./_components/more-button"
import { Badge } from "@/components/ui/badge"
import TooltipWrapper from "@/components/ui/tooltip"
import MoreButton from "./_components/submissions-more-button"

export const columns: ColumnDef<TableItem>[] = [
    {
        id: "checkbox",
        header: ({ table }) => {
            return (
                <Checkbox
                    checked={table.getIsAllRowsSelected()}
                    onCheckedChange={(checked) =>
                        table.toggleAllRowsSelected(!!checked)
                    }
                    className="border-neutral-400/60 z-[2] w-6 h-6"
                />
            )
        },
        cell: ({ row }) => (
            <div className="flex p-0 relative min-h-16 items-center justify-center">
                <div
                    className={cn(
                        "absolute bg-blue-500 rounded-r-full w-2 scale-y-0 h-20 -top-2 -left-2 transition-transform",
                        {
                            "scale-y-100": row.getIsSelected(),
                        }
                    )}
                ></div>
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={() => row.toggleSelected()}
                    className="w-6 h-6"
                />
            </div>
        ),
    },
    {
        id: "Quiz",
        header: "Quiz",
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-4">
                    <div
                        className={cn(
                            "min-h-14  h-14 ml-4 relative w-14 min-w-14 rounded-xl",
                            { " bg-zinc-200/70": !row.original?.quizImage }
                        )}
                    >
                        {!!row.original?.quizImage && (
                            <div className=" overflow-hidden  rounded-xl  h-full w-full ">
                                <ImageWithPreview
                                    alt=""
                                    src={row.original.quizImage}
                                    className="object-cover object-center"
                                />
                            </div>
                        )}
                    </div>
                    <p className="text-left !text-sm font-semibold">
                        {row.original?.quiz}
                    </p>
                </div>
            )
        },
    },

    {
        id: "Duration ",
        header: "Duration ",
        cell: ({ row }) => {
            return (
                <div className="flex items-center  min-w-[200px] !text-base font-semibold justify-center">
                    {row.original?.duration?.toFixed(1)} Second
                </div>
            )
        },
    },

    {
        id: "Correct questions",
        header: "Correct ",
        cell: ({ row }) => {
            return (
                <TooltipWrapper content="Correct questions" asChild>
                    <Badge
                        variant={"green"}
                        className="flex text-lg font-bold mx-auto w-fit"
                    >
                        {row.original?.correct}
                    </Badge>
                </TooltipWrapper>
            )
        },
    },
    {
        id: "Wrong questions",
        header: "Wrong ",
        cell: ({ row }) => {
            return (
                <TooltipWrapper content="Failed questions" asChild>
                    <Badge
                        variant={"red"}
                        className="flex text-lg font-bold mx-auto w-fit"
                    >
                        {row.original?.wrong}
                    </Badge>
                </TooltipWrapper>
            )
        },
    },
    {
        id: "Skipped questions",
        header: "Skipped ",
        cell: ({ row }) => {
            return (
                <TooltipWrapper content="Skipped questions" asChild>
                    <Badge
                        variant={"gray"}
                        className="flex text-lg font-bold mx-auto w-fit"
                    >
                        {row.original?.skipped}
                    </Badge>
                </TooltipWrapper>
            )
        },
    },

    {
        id: "Date",
        header: "Date",
        cell: ({ row }) => {
            return (
                <div className="flex items-center !text-base font-semibold justify-center">
                    {formatDate(row.original?.date, { format: "short" })}
                </div>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return (
                <div className="min-w-[70px] flex items-center  justify-center">
                    <div className="">
                        {row.original?.submissionId ? (
                            <MoreButton itemId={row.original?.submissionId} />
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            )
        },
    },
]
