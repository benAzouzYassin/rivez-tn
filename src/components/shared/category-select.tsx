import { readCategories } from "@/data-access/categories/read"
import { useQuery } from "@tanstack/react-query"
import { ComponentProps, useState } from "react"
import SearchSelect from "../ui/search-select"
import AddCategoryDialog from "./add-category-dialog"

type Props = Omit<ComponentProps<typeof SearchSelect>, "items">

export default function CategorySelect({
    isLoading: isLoadingProp,
    onAddButtonClick,
    ...props
}: Props) {
    const [nameToAdd, setNameToAdd] = useState("")
    const [isAdding, setIsAdding] = useState(false)
    const { data: response, isLoading } = useQuery({
        queryKey: ["quizzes_categories"],
        queryFn: () => readCategories(),
    })

    return (
        <>
            <SearchSelect
                {...props}
                onAddButtonClick={(val) => {
                    setNameToAdd(val)
                    setIsAdding((prev) => !prev)
                    onAddButtonClick?.(val)
                }}
                isLoading={isLoading || isLoadingProp}
                items={
                    response?.data?.map((category) => {
                        return {
                            id: category.id.toString(),
                            label: category.name || "",
                            data: category,
                        }
                    }) || []
                }
            />
            {props.enableAddButton && (
                <AddCategoryDialog
                    isOpen={isAdding}
                    onOpenChange={setIsAdding}
                />
            )}
        </>
    )
}
