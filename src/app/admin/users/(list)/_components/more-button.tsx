import PopoverList from "@/components/ui/popover-list"
import WarningDialog from "@/components/ui/warning-dialog"
import { deleteUser } from "@/data-access/users/delete"
import { banUser, unBanUser } from "@/data-access/users/update"
import {
    dismissToasts,
    toastError,
    toastLoading,
    toastSuccess,
} from "@/lib/toasts"
import { useQueryClient } from "@tanstack/react-query"
import { Ban, Info, LucideUnlock, MoreVerticalIcon, Trash2 } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"
import { useState } from "react"

interface Props {
    userId: string
    isBanned: boolean
}
export default function MoreButton(props: Props) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [isBanning, setIsBanning] = useState(false)
    const router = useRouter()
    const queryClient = useQueryClient()
    const handleDelete = async () => {
        try {
            toastLoading("Deleting...")
            await deleteUser(props.userId)
            queryClient.refetchQueries({
                predicate: (query) => query.queryKey.includes("user_profiles"),
            })
            dismissToasts("loading")
            toastSuccess("Deleted successfully.")
        } catch (error) {
            dismissToasts("loading")
            toastError("Something went wrong.")
        }
    }
    const handleBan = async () => {
        try {
            toastLoading("Banning...")
            await banUser(props.userId)
            queryClient.refetchQueries({
                predicate: (query) => query.queryKey.includes("user_profiles"),
            })
            dismissToasts("loading")
            toastSuccess("Banned user successfully.")
        } catch (error) {
            dismissToasts("loading")
            toastError("Something went wrong.")
        }
    }
    const handleUnBan = async () => {
        try {
            toastLoading("Removing user ban...")
            await unBanUser(props.userId)
            queryClient.refetchQueries({
                predicate: (query) => query.queryKey.includes("user_profiles"),
            })
            dismissToasts("loading")
            toastSuccess("Removed user ban successfully.")
        } catch (error) {
            dismissToasts("loading")
            toastError("Something went wrong.")
        }
    }
    const conditionalItems = props.isBanned
        ? [
              {
                  icon: <LucideUnlock className="w-5 h-5" />,
                  label: "Remove Ban",
                  onClick: handleUnBan,
              },
          ]
        : [
              {
                  icon: <Ban className="w-5 h-5" />,
                  label: "Ban",
                  className: "focus:bg-red-200",
                  isDanger: true,
                  onClick: () => setIsBanning(true),
              },
              {
                  icon: <Trash2 className="w-5 h-5" />,
                  label: "Delete data",
                  className: "focus:bg-red-200",
                  isDanger: true,
                  onClick: () => setIsDeleting(true),
              },
          ]
    return (
        <>
            <PopoverList
                contentClassName="-translate-x-4 "
                items={[
                    {
                        icon: <Info className="w-5 h-5" />,
                        label: "Details",
                        onClick: () =>
                            router.push(`/admin/users/details/${props.userId}`),
                    },
                    ...conditionalItems,
                ]}
            >
                <button
                    role="button"
                    className="h-8 border-2 bg-white hover:bg-neutral-50 flex items-center justify-center rounded-lg w-8 p-0 hover:cursor-pointer active:scale-95"
                >
                    <MoreVerticalIcon className="!h-6 text-neutral-600 !w-6" />
                </button>
            </PopoverList>
            <WarningDialog
                description={
                    "This action cannot be undone. This will permanently delete the user data from our servers."
                }
                onOpenChange={setIsDeleting}
                isOpen={isDeleting}
                onConfirm={async () => {
                    await handleDelete()
                }}
            />
            <WarningDialog
                description={
                    "This action will prevent the user from accessing the platform. are you sure ?"
                }
                confirmText="Ban user"
                onOpenChange={setIsBanning}
                isOpen={isBanning}
                onConfirm={async () => {
                    await handleBan()
                }}
            />
        </>
    )
}
