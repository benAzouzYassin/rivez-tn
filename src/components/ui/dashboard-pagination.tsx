import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/ui-utils"

type Props = {
    itemsCount: number
    currentPage: number
    onPageChange: (page: number) => void
    itemsPerPage?: number
    onItemsPerPageChange?: (itemsPerPage: number) => void
    className?: string
}

export default function DashboardPagination({
    itemsCount,
    currentPage,
    onPageChange,
    itemsPerPage = 10,
    onItemsPerPageChange,
    className,
}: Props) {
    const [currentItemsPerPage, setCurrentItemsPerPage] = useState(itemsPerPage)
    const totalPages = Math.ceil(itemsCount / currentItemsPerPage)

    const getPageNumbers = () => {
        const pageNumbers: (number | string)[] = []
        const showPages = 5 // Number of pages to show around current page
        const boundary = 1 // Number of pages to show at start and end

        for (let i = 1; i <= totalPages; i++) {
            // Always show first page(s)
            if (i <= boundary) {
                pageNumbers.push(i)
                continue
            }

            // Always show last page(s)
            if (i > totalPages - boundary) {
                pageNumbers.push(i)
                continue
            }

            // Show pages around current page
            if (
                i >= currentPage - Math.floor(showPages / 2) &&
                i <= currentPage + Math.floor(showPages / 2)
            ) {
                pageNumbers.push(i)
                continue
            }

            // Add ellipsis
            if (
                pageNumbers[pageNumbers.length - 1] !== "..." &&
                pageNumbers.length > 0
            ) {
                pageNumbers.push("...")
            }
        }

        return pageNumbers
    }

    const handleItemsPerPageChange = (value: string) => {
        const newItemsPerPage = Number(value)
        setCurrentItemsPerPage(newItemsPerPage)
        if (onItemsPerPageChange) {
            onItemsPerPageChange(newItemsPerPage)
        }
        onPageChange(1) // Reset to the first page when items per page changes
    }

    // Calculate the range of items being displayed
    const startItem = (currentPage - 1) * currentItemsPerPage + 1
    const endItem = Math.min(currentPage * currentItemsPerPage, itemsCount)

    return (
        <div
            className={cn(
                "flex flex-col sm:flex-row items-center gap-4 mt-4 transition-opacity duration-300",
                className
            )}
        >
            <div className="flex items-center gap-4">
                <div className="text-sm flex items-center text-neutral-600">
                    Showing
                    <Select
                        value={currentItemsPerPage.toString()}
                        onValueChange={handleItemsPerPageChange}
                    >
                        <SelectTrigger className=" h-8 rounded-lg  px-1 mx-2 !w-fit translate-y-2 text-xs">
                            <SelectValue placeholder="Items per page" />
                        </SelectTrigger>
                        <SelectContent>
                            {[5, 10, 20, 50, 100].map((option) => (
                                <SelectItem
                                    key={option}
                                    value={option.toString()}
                                >
                                    {option} items
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>{" "}
                    from {startItem} to {endItem} of {itemsCount}
                </div>
            </div>

            {/* Pagination Buttons */}
            {totalPages > 1 && (
                <div className="flex items-center sm:ml-auto space-x-2">
                    {getPageNumbers().map((page, index) => {
                        if (page === "...") {
                            return (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="px-2 text-neutral-500 transition-opacity duration-300"
                                >
                                    {page}
                                </span>
                            )
                        }

                        return (
                            <Button
                                key={page}
                                variant={
                                    page === currentPage
                                        ? "default"
                                        : "secondary"
                                }
                                className={cn(
                                    "min-w-12 p-0 transition-all duration-300 text-sm ease-in-out text-black",
                                    {
                                        "text-white h-[44px]  bg-neutral-700":
                                            page === currentPage,
                                    }
                                )}
                                onClick={() => onPageChange(Number(page))}
                            >
                                {page}
                            </Button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
