import { Badge } from "@/components/ui/badge"
import PopoverList from "@/components/ui/popover-list"
import { updateCategory } from "@/data-access/categories/update"
import { toastError } from "@/lib/toasts"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
interface Props {
    itemId: number
    status: string
}
export default function StatusButton(props: Props) {
    const [isLoading, setIsLoading] = useState(false)
    const [selected, setSelected] = useState(props.status)
    const queryClient = useQueryClient()
    useEffect(() => {
        setSelected(props.status)
    }, [props.status, setSelected])

    const handleChange = (status: "PUBLISHED" | "DRAFT") => {
        setIsLoading(true)

        updateCategory(props.itemId, { publishing_status: status })
            .then(() => {
                setSelected(status)
                queryClient.invalidateQueries({
                    queryKey: ["quizzes_categories"],
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
        <PopoverList
            items={[
                {
                    className: "font-bold",
                    label: "DRAFT",
                    onClick: () => handleChange("DRAFT"),
                },
                {
                    className: "font-bold",
                    label: "PUBLISHED",
                    onClick: () => handleChange("PUBLISHED"),
                },
            ]}
        >
            <button className="mx-auto  bg-transparent cursor-pointer w-fit ">
                <Badge
                    isLoading={isLoading}
                    variant={
                        (selected === "DRAFT" && "gray") ||
                        (selected === "PUBLISHED" && "blue") ||
                        "gray"
                    }
                    className="font-bold"
                >
                    {selected}
                </Badge>
            </button>
        </PopoverList>
    )
}
