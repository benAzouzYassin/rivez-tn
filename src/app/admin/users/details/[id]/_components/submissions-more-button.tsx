import PopoverList from "@/components/ui/popover-list"
import WarningDialog from "@/components/ui/warning-dialog"
import { deleteQuizSubmissionById } from "@/data-access/quiz_submissions/delete"
import {
    dismissToasts,
    toastError,
    toastLoading,
    toastSuccess,
} from "@/lib/toasts"
import { useQueryClient } from "@tanstack/react-query"
import { Info, MoreVerticalIcon, Trash2 } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"
import { useState } from "react"

interface Props {
    itemId: number
}
export default function MoreButton(props: Props) {
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()
    const queryClient = useQueryClient()
    const handleDelete = async () => {
        try {
            toastLoading("Deleting...")
            await deleteQuizSubmissionById(props.itemId)
            queryClient.refetchQueries({
                predicate: (query) =>
                    query.queryKey.includes("quiz_submissions"),
            })
            dismissToasts("loading")
            toastSuccess("Deleted successfully.")
        } catch (error) {
            console.error(error)
            dismissToasts("loading")
            toastError("Something went wrong.")
        }
    }
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
                                `/quizzes/submission-details/${props.itemId}`
                            ),
                    },
                    {
                        icon: <Trash2 className="w-5 h-5" />,
                        label: "Delete",
                        className: "focus:bg-red-200",
                        isDanger: true,
                        onClick: () => setIsDeleting(true),
                    },
                ]}
            >
                <button
                    role="button"
                    className="h-8 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:border-neutral-700 border-2 bg-white hover:bg-neutral-50 flex items-center justify-center rounded-lg w-8 p-0 hover:cursor-pointer active:scale-95"
                >
                    <MoreVerticalIcon className="!h-6 !w-6 text-neutral-600 dark:text-neutral-100" />
                </button>
            </PopoverList>
            <WarningDialog
                onOpenChange={setIsDeleting}
                isOpen={isDeleting}
                onConfirm={async () => {
                    await handleDelete()
                }}
            />
        </>
    )
}
