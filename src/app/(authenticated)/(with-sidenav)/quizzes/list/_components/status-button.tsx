import { Badge } from "@/components/ui/badge"
import PopoverList from "@/components/ui/popover-list"
import { updateQuiz } from "@/data-access/quizzes/update"
import { toastError } from "@/lib/toasts"
import { cn } from "@/lib/ui-utils"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
interface Props {
    itemId: number
    status: string
    className?: string
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

        updateQuiz(props.itemId, { publishing_status: status })
            .then(() => {
                setSelected(status)
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
            <button
                className={cn(
                    "mx-auto  bg-transparent cursor-pointer w-fit ",
                    props.className
                )}
            >
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
