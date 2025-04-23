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
import { getLanguage } from "@/utils/get-language"
import { useMemo } from "react"

interface Props {
    itemId: number
}

export default function SubmissionsMoreButton(props: Props) {
    const translation = useMemo(
        () => ({
            en: {
                Delete: "Delete",
                Details: "Details",
                Deleting: "Deleting...",
                DeletedSuccessfully: "Deleted successfully.",
                SomethingWentWrong: "Something went wrong.",
            },
            fr: {
                Delete: "Supprimer",
                Details: "Détails",
                Deleting: "Suppression en cours...",
                DeletedSuccessfully: "Supprimé avec succès.",
                SomethingWentWrong: "Une erreur est survenue.",
            },
            ar: {
                Delete: "حذف",
                Details: "تفاصيل",
                Deleting: "جارٍ الحذف...",
                DeletedSuccessfully: "تم الحذف بنجاح.",
                SomethingWentWrong: "حدث خطأ ما.",
            },
        }),
        []
    )
    const isAdmin = useIsAdmin()
    const router = useRouter()
    const queryClient = useQueryClient()
    const lang = getLanguage()
    const t = translation[lang] || translation.en

    const handleDelete = () => {
        toastLoading(t.Deleting)
        deleteQuizSubmissionById(props.itemId)
            .then(() => {
                queryClient.refetchQueries()
                dismissToasts("loading")
                toastSuccess(t.DeletedSuccessfully)
            })
            .catch(() => {
                dismissToasts("loading")
                toastError(t.SomethingWentWrong)
            })
    }

    const adminItems = isAdmin
        ? [
              {
                  icon: <Trash2 className="w-5 h-5" />,
                  label: t.Delete,
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
                        label: t.Details,
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
