import { readCategories } from "@/data-access/categories/read"
import { useQuery } from "@tanstack/react-query"
import SearchSelect from "../ui/search-select"
import { ComponentProps } from "react"

type Props = Omit<ComponentProps<typeof SearchSelect>, "items">

export default function CategorySelect({
    isLoading: isLoadingProp,
    ...props
}: Props) {
    const { data, isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: readCategories,
    })

    return (
        <SearchSelect
            {...props}
            isLoading={isLoading || isLoadingProp}
            items={
                data?.map((category) => {
                    return {
                        id: category.id.toString(),
                        label: category.name || "",
                        data: category,
                    }
                }) || []
            }
        />
    )
}
