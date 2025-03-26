import PopoverList from "@/components/ui/popover-list"
import { softDeleteQuizById } from "@/data-access/quizzes/delete"
import { PublishingStatusType } from "@/data-access/types"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useIsAdmin } from "@/hooks/use-is-admin"
import {
    dismissToasts,
    toastError,
    toastLoading,
    toastSuccess,
} from "@/lib/toasts"
import { cn } from "@/lib/ui-utils"
import { useQueryClient } from "@tanstack/react-query"
import { Info, MoreVerticalIcon, Trash2 } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"

interface Props {
    itemId: number
    className?: string
    authorId?: string | null
    status: PublishingStatusType
}
export default function MoreButton(props: Props) {
    const { data: userData } = useCurrentUser()
    const isOwner = userData?.id === props.authorId
    const isAdmin = useIsAdmin()
    const queryClient = useQueryClient()
    const router = useRouter()
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
    if (isOwner || isAdmin)
        return (
            <>
                <PopoverList
                    contentClassName="-translate-x-4 "
                    items={[
                        {
                            icon: <Info className="w-5 h-5" />,
                            label: "Details",
                            onClick: () =>
                                router.push(
                                    `/admin/quizzes/details/${props.itemId}`
                                ),
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
                        onClick={(e) => e.stopPropagation()}
                        className={cn(
                            "h-8 border-2 bg-white   hover:bg-neutral-100 flex items-center justify-center rounded-lg w-8 p-0 hover:cursor-pointer active:scale-95",
                            props.className
                        )}
                    >
                        <MoreVerticalIcon className="!h-6 text-neutral-600 !w-6" />
                    </button>
                </PopoverList>
            </>
        )
}
