import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"

interface Props {
    disabled: boolean
}
export default function SummarizeSelectedBtn(props: Props) {
    const router = useRouter()
    const handleConfirm = () => {
        router.push("pdf-summarizer/multiple-pages")
    }

    return (
        <Button
            disabled={props.disabled}
            variant={"blue"}
            className="text-lg font-bold"
            onClick={handleConfirm}
        >
            Summarize <Sparkles className="min-w-5 min-h-5" />
        </Button>
    )
}
