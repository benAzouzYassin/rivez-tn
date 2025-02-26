import PopoverList from "@/components/ui/popover-list"
import { softDeleteCategoryById } from "@/data-access/categories/delete"
import {
    dismissToasts,
    toastError,
    toastLoading,
    toastSuccess,
} from "@/lib/toasts"
import { useQueryClient } from "@tanstack/react-query"
import { Edit, MoreVerticalIcon, Trash2 } from "lucide-react"
import { useState } from "react"
import EditCategoryDialog from "./edit-category-dialog"

interface Props {
    itemId: number
}
export default function MoreButton(props: Props) {
    const [isUpdating, setIsUpdating] = useState(false)
    const queryClient = useQueryClient()
    const handleDelete = () => {
        toastLoading("Deleting...")
        softDeleteCategoryById(props.itemId)
            .then((res) => {
                queryClient.refetchQueries({
                    queryKey: ["quizzes_categories"],
                })
                dismissToasts("loading")
                toastSuccess("Deleted successfully.")
            })
            .catch(() => {
                dismissToasts("loading")
                toastError("Something went wrong.")
            })
    }
    return (
        <>
            <PopoverList
                contentClassName="-translate-x-4 "
                items={[
                    {
                        icon: <Edit className="w-5 h-5" />,
                        label: "Update",
                        onClick: () => setIsUpdating(true),
                    },
                    {
                        icon: <Trash2 className="w-5 h-5" />,
                        label: "Delete",
                        className: "focus:bg-red-200",
                        isDanger: true,
                        onClick: handleDelete,
                    },
                ]}
            >
                <button
                    role="button"
                    className="h-8 border-2 bg-white hover:bg-neutral-50 flex items-center justify-center rounded-lg w-8 p-0 hover:cursor-pointer active:scale-95"
                >
                    <MoreVerticalIcon className="!h-6 text-neutral-600 !w-6" />
                </button>
            </PopoverList>
            <EditCategoryDialog
                isOpen={isUpdating}
                onOpenChange={setIsUpdating}
                categoryId={props.itemId}
            />
        </>
    )
}
