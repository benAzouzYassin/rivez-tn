import { Button } from "@/components/ui/button"
import { cn } from "@/lib/ui-utils"
import { useRouter } from "nextjs-toploader/app"
import { memo, useState } from "react"

interface Props {
    className?: string
}
function Buttons(props: Props) {
    const reset = () => {}
    const router = useRouter()
    const [isSaving, setIsSaving] = useState(false)
    const handleSubmit = () => {}
    return (
        <div className={cn("flex items-center gap-2", props.className)}>
            <Button
                onClick={() => {
                    reset()
                    router.back()
                }}
                className="text-base font-extrabold"
                variant="red"
            >
                Cancel
            </Button>

            <Button
                onClick={handleSubmit}
                isLoading={isSaving}
                className="text-base font-extrabold"
                variant="blue"
            >
                Save changes
            </Button>
        </div>
    )
}

export default memo(Buttons)
