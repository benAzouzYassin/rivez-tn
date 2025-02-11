import PopoverList from "@/components/ui/popover-list"
import { softDeleteQuizById } from "@/data-access/quizzes/delete"
import { dismissToasts, toastLoading, toastSuccess } from "@/lib/toasts"
import { useQueryClient } from "@tanstack/react-query"
import { Edit, Info, MoreVerticalIcon, Trash2 } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"

interface Props {
    itemId: number
}
export default function MoreButton(props: Props) {
    const queryClient = useQueryClient()
    const router = useRouter()
    const handleDelete = () => {
        toastLoading("Deleting...")
        softDeleteQuizById(props.itemId)
            .then(() => {
                queryClient.refetchQueries({
                    queryKey: ["quizzes"],
                })
                dismissToasts("loading")
                toastSuccess("Deleted successfully.")
            })
            .catch(() => {
                dismissToasts("loading")
                toastSuccess("Something went wrong.")
            })
    }
    return (
        <PopoverList
            contentClassName="-translate-x-4 "
            items={[
                {
                    icon: <Info className="w-5 h-5" />,
                    label: "Details",
                    onClick: () =>
                        router.push(`/admin/quizzes/details/${props.itemId}`),
                },
                {
                    icon: <Edit className="w-5 h-5" />,
                    label: "Update",
                    onClick: () =>
                        router.push(`/admin/quizzes/update/${props.itemId}`),
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
    )
}
