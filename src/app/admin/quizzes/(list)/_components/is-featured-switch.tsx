import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
    dismissToasts,
    toastError,
    toastLoading,
    toastSuccess,
} from "@/lib/toasts"
import { updateQuiz } from "@/data-access/quizzes/update"
import { useQueryClient } from "@tanstack/react-query"

interface Props {
    itemId: number
    initialIsFeatured: boolean
}
export default function IsFeaturedSwitch({
    itemId,
    initialIsFeatured = false,
}: Props) {
    const queryClient = useQueryClient()
    const [isFeatured, setIsFeatured] = useState(initialIsFeatured)
    const [isLoading, setIsLoading] = useState(false)
    const handleToggleFeature = async (checked: boolean) => {
        toastLoading("Updating...")
        try {
            setIsLoading(true)

            await updateQuiz(itemId, {
                is_featured: checked,
            })
            dismissToasts("loading")
            setIsFeatured(checked)
            toastSuccess("Updated successfully.")
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey.includes?.("quizzes"),
            })
        } catch (error) {
            dismissToasts("loading")
            console.error("Error updating featured status:", error)
            toastError("Something went wrong.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center space-x-2">
            <Switch
                checked={isFeatured}
                onCheckedChange={handleToggleFeature}
                disabled={isLoading}
                className="data-[state=checked]:bg-green-500 cursor-pointer scale-150 "
            />
        </div>
    )
}
