import { Checkbox } from "@/components/ui/checkbox"
import ImageWithPreview from "@/components/ui/img-with-preview"
import { cn } from "@/lib/ui-utils"
import { ColumnDef } from "@tanstack/react-table"
import { formatDate } from "@/utils/date"
import { Badge } from "@/components/ui/badge"
import TooltipWrapper from "@/components/ui/tooltip"
import { SubmissionType } from "./_components/submissions"
import SubmissionsMoreButton from "./_components/submissions-more-button"

export const columns: ColumnDef<SubmissionType>[] = [
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
        id: "Name",
        header: () => <div className="text-center">User</div>,
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-4">
                    <div
                        className={cn(
                            "min-h-14  h-14 ml-4 relative w-14 min-w-14 rounded-xl",
                            {
                                " bg-zinc-200/70":
                                    !row.original?.user?.avatar_url,
                            }
                        )}
                    >
                        {!!row.original?.user?.avatar_url && (
                            <div className=" overflow-hidden  rounded-xl  h-full w-full ">
                                <ImageWithPreview
                                    alt=""
                                    src={row.original.user.avatar_url}
                                    className="object-cover object-center"
                                />
                            </div>
                        )}
                    </div>
                    <p className="text-center text-base font-semibold">
                        {row.original?.user?.username ||
                            row.original?.user?.email}
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
                    {row.original?.seconds_spent?.toFixed(1)} Second
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
                        {
                            row.original?.quiz_submission_answers?.filter(
                                (item) => !!item.is_answered_correctly
                            ).length
                        }{" "}
                    </Badge>
                </TooltipWrapper>
            )
        },
    },
    {
        id: "Failed questions",
        header: "Wrong ",
        cell: ({ row }) => {
            return (
                <TooltipWrapper content="Failed questions" asChild>
                    <Badge
                        variant={"red"}
                        className="flex text-lg font-bold mx-auto w-fit"
                    >
                        {
                            row.original?.quiz_submission_answers?.filter(
                                (item) =>
                                    !item.is_answered_correctly &&
                                    !item.is_skipped
                            ).length
                        }{" "}
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
                        {
                            row.original?.quiz_submission_answers?.filter(
                                (item) => item.is_skipped
                            ).length
                        }{" "}
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
                    {formatDate(row.original?.created_at, { format: "short" })}
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
                        {row.original?.id ? (
                            <SubmissionsMoreButton itemId={row.original?.id} />
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            )
        },
    },
]
