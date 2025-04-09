import PopoverList from "@/components/ui/popover-list"
import { deleteQuizSubmissionById } from "@/data-access/quiz_submissions/delete"
import { useIsAdmin } from "@/hooks/use-is-admin"
import {
    dismissToasts,
    toastError,
    toastLoading,
    toastSuccess,
} from "@/lib/toasts"
import { useQueryClient } from "@tanstack/react-query"
import { Info, MoreVerticalIcon, Trash2 } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"

interface Props {
    itemId: number
}
export default function SubmissionsMoreButton(props: Props) {
    const isAdmin = useIsAdmin()
    const router = useRouter()
    const queryClient = useQueryClient()
    const handleDelete = () => {
        toastLoading("Deleting...")
        deleteQuizSubmissionById(props.itemId)
            .then((res) => {
                queryClient.refetchQueries()
                dismissToasts("loading")
                toastSuccess("Deleted successfully.")
            })
            .catch(() => {
                dismissToasts("loading")
                toastError("Something went wrong.")
            })
    }
    const adminItems = isAdmin
        ? [
              {
                  icon: <Trash2 className="w-5 h-5" />,
                  label: "Delete",
                  className: "focus:bg-red-200",
                  isDanger: true,
                  onClick: handleDelete,
              },
          ]
        : []
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
                    ...adminItems,
                ]}
            >
                <button
                    role="button"
                    className="h-8 border-2 bg-white hover:bg-neutral-50 flex items-center justify-center rounded-lg w-8 p-0 hover:cursor-pointer active:scale-95"
                >
                    <MoreVerticalIcon className="!h-6 text-neutral-600 !w-6" />
                </button>
            </PopoverList>
        </>
    )
}
