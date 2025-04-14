import PopoverList from "@/components/ui/popover-list"
import WarningDialog from "@/components/ui/warning-dialog"
import { deleteMindmapById } from "@/data-access/mindmaps/delete"
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
import { Info, MoreVerticalIcon, Share2, Trash2 } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"
import { useState } from "react"

interface Props {
    itemId: number
    className?: string
    authorId?: string | null
    status: PublishingStatusType
    isSharing: boolean
    setIsSharing: (value: boolean) => void
}
export default function MoreButton(props: Props) {
    const { data: userData } = useCurrentUser()
    const isOwner = userData?.id === props.authorId
    const isAdmin = useIsAdmin()
    const queryClient = useQueryClient()
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)
    const handleDelete = () => {
        setIsDeleting(true)
    }
    const handleShare = () => {
        props.setIsSharing(true)
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
                                router.push(`/mind-maps/${props.itemId}`),
                        },
                        {
                            icon: <Share2 className="w-5 h-5" />,
                            label: "Share link",
                            onClick: handleShare,
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
                <WarningDialog
                    isOpen={isDeleting}
                    onConfirm={async () => {
                        toastLoading("Deleting...")
                        deleteMindmapById(props.itemId)
                            .then((res) => {
                                queryClient.refetchQueries({
                                    predicate: (q) =>
                                        q.queryKey.includes("mindmaps"),
                                })
                                dismissToasts("loading")
                                toastSuccess("Deleted successfully.")
                            })
                            .catch(() => {
                                dismissToasts("loading")
                                toastError("Something went wrong.")
                            })
                    }}
                    onOpenChange={setIsDeleting}
                />
            </>
        )
}
