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
import {
    Edit,
    Edit2,
    Info,
    MoreVerticalIcon,
    Share2Icon,
    Trash2,
} from "lucide-react"
import { useRouter } from "nextjs-toploader/app"
import UpdateQuizDialog from "./update-quiz-dialog"
import { getLanguage } from "@/utils/get-language"

import { translation } from "../translation"

interface Props {
    itemId: number
    className?: string
    authorId?: string | null
    status: PublishingStatusType
    isUpdateDialogOpen: boolean
    setIsUpdateDialogOpen: (value: boolean) => void
    isSharing: boolean
    setIsSharing: (value: boolean) => void
}

export default function MoreButton(props: Props) {
    const lang = getLanguage()
    const t = translation[lang]
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
    const handleShare = () => {
        props.setIsSharing(true)
    }
    if (isOwner || isAdmin)
        return (
            <>
                <PopoverList
                    contentClassName="-translate-x-4  "
                    items={[
                        {
                            icon: <Edit className="w-5 h-5" />,
                            label: t["Update questions"],
                            onClick: () =>
                                router.push(`/quizzes/update/${props.itemId}`),
                        },
                        {
                            icon: <Edit2 className="w-5 h-5" />,
                            label: t["Update information"],
                            onClick: () => props.setIsUpdateDialogOpen(true),
                        },
                        {
                            icon: <Info className="w-5 h-5" />,
                            label: t["Details"],
                            onClick: () =>
                                router.push(`/quizzes/details/${props.itemId}`),
                        },

                        {
                            icon: <Share2Icon className="w-5 h-5" />,
                            label: t["Share"],
                            className: "focus:bg-red-200",
                            onClick: handleShare,
                        },
                        {
                            icon: <Trash2 className="w-5 h-5" />,
                            label: t["Delete"],
                            className: "focus:bg-red-200",
                            isDanger: true,
                            onClick: handleDelete,
                        },
                    ]}
                >
                    <button
                        role="button"
                        className={cn(
                            "h-8 border-2 bg-white hover:bg-neutral-50 flex items-center justify-center rounded-lg w-8 p-0 hover:cursor-pointer active:scale-95",
                            props.className
                        )}
                    >
                        <MoreVerticalIcon className="!h-6 text-neutral-600 !w-6" />
                    </button>
                </PopoverList>
                <UpdateQuizDialog
                    status={props.status}
                    isOpen={props.isUpdateDialogOpen}
                    onOpenChange={props.setIsUpdateDialogOpen}
                    quizId={props.itemId}
                />
            </>
        )
}
