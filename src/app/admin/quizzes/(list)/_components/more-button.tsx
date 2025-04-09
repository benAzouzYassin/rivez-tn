import PopoverList from "@/components/ui/popover-list"
import { softDeleteQuizById } from "@/data-access/quizzes/delete"
import {
    dismissToasts,
    toastError,
    toastLoading,
    toastSuccess,
} from "@/lib/toasts"
import { useQueryClient } from "@tanstack/react-query"
import { Edit, Edit2, Eye, Info, MoreVerticalIcon, Trash2 } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"
import { useState } from "react"
import UpdateQuizDialog from "./update-quiz-dialog"
import { PublishingStatusType } from "@/data-access/types"

interface Props {
    itemId: number
    status: PublishingStatusType
}
export default function MoreButton(props: Props) {
    const queryClient = useQueryClient()
    const router = useRouter()
    const [isUpdating, setIsUpdating] = useState(false)
    const handleDelete = () => {
        toastLoading("Deleting...")
        softDeleteQuizById(props.itemId)
            .then((res) => {
                queryClient.refetchQueries({
                    queryKey: ["quizzes"],
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
                        label: "Update questions",
                        onClick: () =>
                            router.push(`/quizzes/update/${props.itemId}`),
                    },
                    {
                        icon: <Edit2 className="w-5 h-5" />,
                        label: "Update information",
                        onClick: () => setIsUpdating(true),
                    },
                    {
                        icon: <Info className="w-5 h-5" />,
                        label: "Details",
                        onClick: () =>
                            router.push(`/quizzes/details/${props.itemId}`),
                    },

                    {
                        icon: <Eye className="w-5 h-5" />,
                        label: "View as user",
                        onClick: () => router.push(`/quizzes/${props.itemId}`),
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
            <UpdateQuizDialog
                isOpen={isUpdating}
                onOpenChange={setIsUpdating}
                quizId={props.itemId}
                status={props.status}
            />
        </>
    )
}
