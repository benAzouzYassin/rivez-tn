import CategorySelect from "@/components/shared/category-select"
import { updateQuiz } from "@/data-access/quizzes/update"
import { toastError } from "@/lib/toasts"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"

interface Props {
    categoryId: number | null
    itemId: number
    className?: string
}
export default function Category(props: Props) {
    const [isLoading, setIsLoading] = useState(false)
    const [selected, setSelected] = useState(props.categoryId)
    const queryClient = useQueryClient()

    useEffect(() => {
        setSelected(props.categoryId)
    }, [props.categoryId])

    const handleChange = (category: number) => {
        setIsLoading(true)

        updateQuiz(props.itemId, { category })
            .then(() => {
                setSelected(category)
                queryClient.invalidateQueries({
                    queryKey: ["quizzes"],
                })
            })
            .catch(() => {
                toastError("Something went wrong.")
            })
            .finally(() => {
                setIsLoading(false)
            })
    }
    return (
        <CategorySelect
            inputClassName={props.className}
            placeholder="Category"
            isLoading={isLoading}
            selectedId={String(selected) || null}
            onSelect={(data) => {
                const id = Number(data.id)
                if (!isNaN(id)) {
                    handleChange(id)
                }
            }}
        />
    )
}
