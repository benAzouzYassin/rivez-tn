import { Checkbox } from "@/components/ui/checkbox"
import ImageWithPreview from "@/components/ui/img-with-preview"
import { cn } from "@/lib/ui-utils"
import { ColumnDef } from "@tanstack/react-table"
import { Item } from "./page"
import { formatDate } from "@/utils/date"
import MoreButton from "./_components/more-button"
import { Badge } from "@/components/ui/badge"
import TooltipWrapper from "@/components/ui/tooltip"
import { CircleSlash2 } from "lucide-react"
import XpIcon from "@/components/icons/xp"

export const columns: ColumnDef<Item>[] = [
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
        header: () => <div className="text-center text-sm scale-110">User</div>,
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-4">
                    <div
                        className={cn(
                            "min-h-14  h-14 ml-4 relative w-14 min-w-14 rounded-xl",
                            {
                                " bg-zinc-200/70": !row.original?.avatar_url,
                            }
                        )}
                    >
                        {!!row.original?.avatar_url && (
                            <div className=" overflow-hidden  rounded-xl  h-full w-full ">
                                <ImageWithPreview
                                    alt=""
                                    src={row.original.avatar_url}
                                    className="object-cover object-center"
                                />
                            </div>
                        )}
                    </div>
                    <div className="text-left flex flex-col relative text-nowrap text-base font-semibold">
                        {row.original?.username || row.original?.email}{" "}
                        {row.original.is_banned && (
                            <Badge
                                className="text-xs py-0 px-2 w-fit rounded-full"
                                variant={"red"}
                            >
                                Banned
                            </Badge>
                        )}
                    </div>
                </div>
            )
        },
    },
    {
        id: "XP",
        header: () => <div className="text-sm scale-110 ">XP</div>,
        cell: ({ row }) => {
            return (
                <div className="flex items-center  !text-base font-semibold justify-center">
                    <Badge
                        variant={"orange"}
                        className=" bg-amber-100/30 h-8 min-w-7 gap-1 text-center flex items-center justify-center border text-amber-500 rounded-full "
                    >
                        {row.original.xp_points} <XpIcon className="h-4  w-4" />
                    </Badge>
                </div>
            )
        },
    },

    {
        id: "Email",
        header: () => <div className="text-sm scale-110 ">Email</div>,
        cell: ({ row }) => {
            return (
                <div className="flex items-center !text-base font-semibold justify-center">
                    {row.original?.email}
                </div>
            )
        },
    },
    {
        id: "Phone",
        header: () => <div className="text-sm scale-110 ">Phone</div>,
        cell: ({ row }) => {
            return (
                <div className="flex items-center !text-base font-semibold justify-center">
                    {row.original?.phone || (
                        <CircleSlash2 className="opacity-40" />
                    )}
                </div>
            )
        },
    },

    {
        id: "Correct questions",
        header: () => (
            <div className="text-sm scale-110">Correct questions</div>
        ),
        cell: ({ row }) => {
            return (
                <TooltipWrapper content="Correct questions" asChild>
                    <Badge
                        variant={"green"}
                        className="flex text-lg font-bold mx-auto w-fit"
                    >
                        {row.original?.quiz_submissions.correctAnswers}{" "}
                    </Badge>
                </TooltipWrapper>
            )
        },
    },
    {
        id: "Wrong questions",
        header: () => <div className="text-sm scale-110">Wrong questions</div>,
        cell: ({ row }) => {
            return (
                <TooltipWrapper content="Failed questions" asChild>
                    <Badge
                        variant={"red"}
                        className="flex text-lg font-bold mx-auto w-fit"
                    >
                        {row.original?.quiz_submissions.wrongAnswers}{" "}
                    </Badge>
                </TooltipWrapper>
            )
        },
    },
    {
        id: "Skipped questions",
        header: () => (
            <div className="text-sm scale-110">Skipped questions</div>
        ),
        cell: ({ row }) => {
            return (
                <TooltipWrapper content="Skipped questions" asChild>
                    <Badge
                        variant={"gray"}
                        className="flex text-lg font-bold mx-auto w-fit"
                    >
                        {row.original?.quiz_submissions.skippedAnswers}{" "}
                    </Badge>
                </TooltipWrapper>
            )
        },
    },

    {
        id: "Date",
        header: () => <div className="text-sm scale-110 ">Join date</div>,
        cell: ({ row }) => {
            return (
                <div className="flex items-center !text-base text-nowrap font-semibold justify-center">
                    {formatDate(row.original?.created_at, { format: "medium" })}
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
                        {row.original?.user_id ? (
                            <MoreButton
                                isBanned={row.original.is_banned}
                                userId={row.original?.user_id}
                            />
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            )
        },
    },
]
