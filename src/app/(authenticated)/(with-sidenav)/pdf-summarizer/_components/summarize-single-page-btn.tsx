import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import Link from "next/link"

export default function SummarizeSinglePageBtn() {
    return (
        <Link href={`/pdf-summarizer/single-page`}>
            <Button variant={"blue"} className="text-base">
                Summarize <Sparkles className="!w-5 !h-5" />
            </Button>
        </Link>
    )
}
