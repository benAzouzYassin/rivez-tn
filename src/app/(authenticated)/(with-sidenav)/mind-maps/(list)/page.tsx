"use client"
import { ErrorDisplay } from "@/components/shared/error-display"
import { Button } from "@/components/ui/button"
import DashboardPagination from "@/components/ui/dashboard-pagination"
import { readMindmaps } from "@/data-access/mindmaps/read"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useIsAdmin } from "@/hooks/use-is-admin"
import { cn } from "@/lib/ui-utils"
import { useSidenav } from "@/providers/sidenav-provider"
import { useQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"
import { parseAsInteger, parseAsString, useQueryState } from "nuqs"
import Item from "./_components/item"
import ItemSkeleton from "./_components/item-skeleton"
import Search from "./_components/search"
import AddDialog from "./_components/add-dialog"

export default function Page() {
    const { isSidenavOpen } = useSidenav()
    const isAdmin = useIsAdmin()
    const { data: userData } = useCurrentUser()
    const router = useRouter()
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
            "mindmaps",
            itemsPerPage,
            currentPage,
            searchValue,
            isAdmin,
            userData,
        ],
        queryFn: () =>
            readMindmaps({
                isAdmin: !!isAdmin,
                userId: userData?.id || "",
                filters: {
                    name: searchValue || undefined,
                },
                pagination: {
                    itemsPerPage,
                    currentPage,
                },
            }),
    })
    const data = response?.data

    if (isError) {
        return <ErrorDisplay />
    }
    return (
        <section className="flex flex-col min-h-[50vh] px-10 py-10">
            <div
                className={cn(
                    "flex fixed  z-50   bg-white border-t top-[10vh] pt-4  justify-between items-center",
                    {
                        "left-[300px] w-[calc(100vw-306px)] px-8  ":
                            isSidenavOpen,
                        "left-[100px] w-[calc(100vw-106px)] px-8  ":
                            !isSidenavOpen,
                    }
                )}
            >
                {" "}
                <h1 className="text-4xl text-neutral-600  font-extrabold">
                    Mind maps
                </h1>
                <div className="flex items-center gap-2">
                    <div className="mt-5 ">
                        <Search
                            searchValue={searchValue}
                            onSearchChange={setSearchValue}
                        />
                    </div>

                    <AddDialog />
                </div>
            </div>

            <div className="w-full  min-h-screen mt-18  ">
                <div
                    className={cn(
                        "grid  rounded-2xl  grid-cols-3 ml-auto px-2 py-2   gap-8 mb-2"
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
                            "grid grid-cols-3 rounded-2xl ml-auto px-2 py-2   gap-8 mb-2"
                        )}
                    >
                        {data?.map((item) => {
                            return <Item item={item} key={item.id} />
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

export type ItemType = Awaited<ReturnType<typeof readMindmaps>>["data"][number]
