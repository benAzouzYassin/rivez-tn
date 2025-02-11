import { Checkbox } from "@/components/ui/checkbox"
import ImageWithPreview from "@/components/ui/img-with-preview"
import { cn } from "@/lib/ui-utils"
import { formatDate } from "@/utils/date"
import { ColumnDef } from "@tanstack/react-table"
import CategoryButton from "./_components/category"
import MoreButton from "./_components/more-button"
import StatusButton from "./_components/status-button"
import { Item } from "./page"

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
        id: "name ",
        header: () => <div className="text-center -translate-x-10">Name</div>,
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-4">
                    <div
                        className={cn(
                            "min-h-14  h-14 ml-4 relative w-14 min-w-14 rounded-xl",
                            { " bg-zinc-200/70": !row.original.image }
                        )}
                    >
                        {!!row.original.image && (
                            <div className=" overflow-hidden  rounded-xl  h-full w-full ">
                                <ImageWithPreview
                                    alt=""
                                    src={row.original.image}
                                    className="object-cover object-center"
                                />
                            </div>
                        )}
                    </div>
                    <p className="text-center text-base font-semibold">
                        {row.original.name}
                    </p>
                </div>
            )
        },
    },
    {
        header: "Category",
        cell: ({ row }) => (
            <div className="flex items-center !text-base font-semibold justify-center">
                <div className="translate-y-2">
                    <CategoryButton
                        itemId={row.original.id}
                        categoryId={row.original.category?.id || null}
                    />
                </div>
            </div>
        ),
    },
    {
        header: "Questions",
        cell: ({ row }) => {
            return (
                <div className="flex items-center !text-base font-semibold justify-center">
                    {row.original.quizzes_questions?.[0]?.count}
                </div>
            )
        },
    },
    {
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.publishing_status as string
            return (
                <div className="flex items-center !text-base font-semibold justify-center ">
                    <StatusButton itemId={row.original.id} status={status} />
                </div>
            )
        },
    },
    {
        header: "Created At",
        cell: ({ row }) => {
            return (
                <div className="flex items-center !text-base font-semibold justify-center">
                    {formatDate(row.original.created_at)}
                </div>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return <MoreButton itemId={row.original.id} />
        },
    },
]
