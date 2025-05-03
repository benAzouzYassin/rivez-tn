"use client"

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
import { useState, useMemo } from "react"
import { getLanguage } from "@/utils/get-language"

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

    const translation = useMemo(
        () => ({
            en: {
                Details: "Details",
                "Share link": "Share link",
                Delete: "Delete",
                "Deleting...": "Deleting...",
                "Deleted successfully.": "Deleted successfully.",
                "Something went wrong.": "Something went wrong.",
            },
            fr: {
                Details: "Détails",
                "Share link": "Partager le lien",
                Delete: "Supprimer",
                "Deleting...": "Suppression...",
                "Deleted successfully.": "Supprimé avec succès.",
                "Something went wrong.": "Une erreur s'est produite.",
            },
            ar: {
                Details: "التفاصيل",
                "Share link": "مشاركة الرابط",
                Delete: "حذف",
                "Deleting...": "جار الحذف...",
                "Deleted successfully.": "تم الحذف بنجاح.",
                "Something went wrong.": "حدث خطأ ما.",
            },
        }),
        []
    )

    const lang = getLanguage()
    const t = translation[lang]

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
                    contentClassName="-translate-x-4"
                    items={[
                        {
                            icon: (
                                <Info className="w-5 h-5 text-neutral-600 dark:text-neutral-100" />
                            ),
                            label: t["Details"],
                            onClick: () =>
                                router.push(`/mind-maps/${props.itemId}`),
                        },
                        {
                            icon: (
                                <Share2 className="w-5 h-5 text-neutral-600 dark:text-neutral-100" />
                            ),
                            label: t["Share link"],
                            onClick: handleShare,
                        },
                        {
                            icon: (
                                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                            ),
                            label: t["Delete"],
                            className:
                                "focus:bg-red-200 dark:focus:bg-red-900/40",
                            isDanger: true,
                            onClick: handleDelete,
                        },
                    ]}
                >
                    <button
                        role="button"
                        onClick={(e) => e.stopPropagation()}
                        className={cn(
                            "h-8 border-2 bg-white hover:bg-neutral-100 flex items-center justify-center rounded-lg w-8 p-0 hover:cursor-pointer active:scale-95",
                            "dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:border-neutral-700",
                            props.className
                        )}
                    >
                        <MoreVerticalIcon className="!h-6 !w-6 text-neutral-600 dark:text-neutral-100" />
                    </button>
                </PopoverList>
                <WarningDialog
                    isOpen={isDeleting}
                    onConfirm={async () => {
                        toastLoading(t["Deleting..."])
                        deleteMindmapById(props.itemId)
                            .then((res) => {
                                queryClient.refetchQueries({
                                    predicate: (q) =>
                                        q.queryKey.includes("mindmaps"),
                                })
                                dismissToasts("loading")
                                toastSuccess(t["Deleted successfully."])
                            })
                            .catch(() => {
                                dismissToasts("loading")
                                toastError(t["Something went wrong."])
                            })
                    }}
                    onOpenChange={setIsDeleting}
                />
            </>
        )
}
