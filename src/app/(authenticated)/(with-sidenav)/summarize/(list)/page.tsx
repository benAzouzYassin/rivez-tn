"use client"

import { ErrorDisplay } from "@/components/shared/error-display"
import { Button } from "@/components/ui/button"
import DashboardPagination from "@/components/ui/dashboard-pagination"
import { readSummaries } from "@/data-access/summarize/read"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useIsAdmin } from "@/hooks/use-is-admin"
import { cn } from "@/lib/ui-utils"
import { useSidenav } from "@/providers/sidenav-provider"
import { useQuery } from "@tanstack/react-query"
import { PlusCircle } from "lucide-react"
import {
    parseAsBoolean,
    parseAsInteger,
    parseAsString,
    useQueryState,
} from "nuqs"
import { useEffect, useState } from "react"
import Item from "./_components/item"
import ItemSkeleton from "./_components/item-skeleton"
import Search from "./_components/search"
import Add from "../_components/add"

export default function Page() {
    const [isList, setIsList] = useQueryState(
        "list",
        parseAsBoolean.withDefault(false)
    )
    const [isAdding, setIsAdding] = useState(false)
    const { isSidenavOpen } = useSidenav()
    const isAdmin = useIsAdmin()
    const { data: userData } = useCurrentUser()
    const [searchValue, setSearchValue] = useQueryState(
        "search-value",
        parseAsString.withDefault("")
    )
    const [itemsPerPage, setItemsPerPage] = useQueryState(
        "items-per-page",
        parseAsInteger.withDefault(9)
    )
    const [currentPage, setCurrentPage] = useQueryState(
        "page",
        parseAsInteger.withDefault(1)
    )

    const {
        data: response,
        isError,
        isFetching,
    } = useQuery({
        enabled: isAdmin !== null,
        queryKey: [
            "summarizations",
            itemsPerPage,
            currentPage,
            searchValue,
            isAdmin,
            userData,
        ],
        queryFn: () => {
            return readSummaries({
                isAdmin: !!isAdmin,
                userId: userData?.id || "",
                filters: {
                    name: searchValue || undefined,
                },
                pagination: {
                    itemsPerPage,
                    currentPage,
                },
            })
        },
    })
    const data = response?.data

    useEffect(() => {
        if (isList) {
            setIsList(false)
            setIsAdding(false)
        }
    }, [isList , setIsList])
    if (isAdding) {
        return (
            <Add
                onBack={() => {
                    setIsAdding(false)
                }}
            />
        )
    }
    if (isError) {
        return <ErrorDisplay />
    }
    if (!isFetching && !data?.length && !isError) {
        return (
            <Add
                hideBack
                onBack={() => {
                    setIsAdding(false)
                }}
            />
        )
    }
    return (
        <section className="flex isolate flex-col min-h-[50vh] md:px-10 px-3 py-10">
            <div
                className={cn(
                    "flex w-full fixed pb-4 md:pb-2 z-40  bg-white border-t top-[10vh] pt-4  justify-between items-center lg:max-w-screen sm:max-w-screen md:max-w-[90vw]",
                    {
                        "ltr:lg:left-[300px] rtl:md:right-[300px]  lg:w-[calc(100vw-306px)] lg:px-8  ":
                            isSidenavOpen,
                        "ltr:lg:left-[100px] rtl:lg:right-[100px] lg:w-[calc(100vw-106px)] lg:px-8  ":
                            !isSidenavOpen,
                    }
                )}
            >
                <h1 className="md:text-4xl text-3xl text-neutral-600  font-extrabold">
                    Summaries
                </h1>
                <div className="flex md:flex-col-reverse sm:flex-row lg:flex-row  items-center gap-2">
                    <div className="mt-5 md:block hidden ">
                        <Search
                            searchValue={searchValue}
                            onSearchChange={setSearchValue}
                        />
                    </div>

                    <div className="md:scale-100 flex md:self-end sm:self-auto lg:self-auto md:pr-0 pr-4 scale-90 ">
                        <Button onClick={() => setIsAdding(true)}>
                            {" "}
                            <PlusCircle /> {"Add"}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="w-full  min-h-screen md:mt-28 lg:mt-18 mt-8  ">
                <div
                    className={cn(
                        "grid  rounded-2xl md:grid-cols-2 grid-cols-1  xl:grid-cols-3  min-[1700px]:grid-cols-4 ml-auto px-2 py-2   gap-8 mb-2"
                    )}
                >
                    {isFetching &&
                        Array.from({ length: 8 }).map((_, i) => (
                            <ItemSkeleton key={i} />
                        ))}
                </div>

                <div className="mb-4 ">
                    <div
                        className={cn(
                            "grid md:grid-cols-2 grid-cols-1   lg:grid-cols-3 min-[1700px]:grid-cols-4 rounded-2xl ml-auto px-2 py-4 md:py-2   gap-8 mb-2"
                        )}
                    >
                        {!data?.length && !isFetching && (
                            <div className="flex w-full items-center justify-center gap-4 h-80 col-span-3 flex-col">
                                <p className="text-5xl font-bold text-neutral-400">
                                    {"no items..."}
                                </p>
                                <Button onClick={() => setIsAdding(true)}>
                                    <PlusCircle /> {"Add"}
                                </Button>
                            </div>
                        )}
                        {data?.map((item) => {
                            return (
                                <div key={item.id}>
                                    <Item item={item} />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <DashboardPagination
                currentPage={currentPage}
                itemsCount={response?.count || 0}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={setItemsPerPage}
            />
        </section>
    )
}

export type ItemType = Awaited<ReturnType<typeof readSummaries>>["data"][number]
