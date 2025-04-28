"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/ui-utils"
import { Skeleton } from "@/components/ui/skeleton"
import { useMemo } from "react"
import { getLanguage } from "@/utils/get-language"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    isLoading?: boolean
}

export function DataTable<TData, TValue>({
    columns,
    data,
    isLoading: loading = false,
}: DataTableProps<TData, TValue>) {
    const translation = useMemo(
        () => ({
            en: {
                NoResults: "No results.",
            },
            fr: {
                NoResults: "Aucun résultat.",
            },
            ar: {
                NoResults: "لا توجد نتائج.",
            },
        }),
        []
    )
    const lang = getLanguage()
    const t = translation[lang]
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const LoadingSkeleton = () => (
        <TableBody>
            {Array.from({ length: 10 }).map((_, index) => (
                <TableRow key={index}>
                    {columns.map((_, cellIndex) => (
                        <TableCell key={cellIndex} className="p-4">
                            <Skeleton className="h-6 w-full" />
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </TableBody>
    )

    return (
        <div
            className={cn(
                "rounded-2xl overflow-hidden border border-neutral-200 bg-white transition-colors",
                "dark:bg-neutral-900 dark:border-neutral-700"
            )}
        >
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    className={cn(
                                        "bg-blue-50 h-16 text-center text-lg text-neutral-800 font-bold  transition-colors",
                                        "dark:bg-neutral-800  dark:text-blue-200"
                                    )}
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext()
                                          )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                {loading ? (
                    <LoadingSkeleton />
                ) : (
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                    className={cn(
                                        "hover:bg-blue-50/50 transition-colors",
                                        "dark:hover:bg-neutral-800/80",
                                        {
                                            "!bg-white dark:!bg-neutral-900":
                                                row.getIsSelected(),
                                        }
                                    )}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className={cn(
                                                "transition-colors",
                                                "text-neutral-800 dark:text-neutral-200"
                                            )}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className={cn(
                                        "h-24 text-center text-neutral-500 font-semibold transition-colors",
                                        "dark:text-neutral-400"
                                    )}
                                >
                                    {t["NoResults"]}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                )}
            </Table>
        </div>
    )
}
