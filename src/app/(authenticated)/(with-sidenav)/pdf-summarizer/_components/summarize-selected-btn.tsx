import InsufficientCreditsDialog from "@/components/shared/insufficient-credits-dialog"
import { Button } from "@/components/ui/button"
import { lowPrice } from "@/constants/prices"
import { useCurrentUser } from "@/hooks/use-current-user"
import { Sparkles } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"
import { useState } from "react"

interface Props {
    disabled: boolean
    selectedPagesCount: number
}
export default function SummarizeSelectedBtn(props: Props) {
    const pagePrice = lowPrice / 5
    const totalPrice = props.selectedPagesCount * pagePrice
    const [isInsufficientCredits, setIsInsufficientCredits] = useState(false)
    const { data: user } = useCurrentUser()
    const creditBalance = user?.credit_balance?.toFixed(1)
    const router = useRouter()
    const handleConfirm = () => {
        if (Number(creditBalance) < totalPrice) {
            return setIsInsufficientCredits(true)
        }
        router.push("pdf-summarizer/multiple-pages")
    }

    return (
        <>
            <Button
                disabled={props.disabled}
                variant={"blue"}
                className="text-lg font-bold"
                onClick={handleConfirm}
            >
                Summarize <Sparkles className="min-w-5 min-h-5" />
            </Button>

            <InsufficientCreditsDialog
                isOpen={isInsufficientCredits}
                onOpenChange={setIsInsufficientCredits}
            />
        </>
    )
}
