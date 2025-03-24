import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { usePdfSummarizerStore } from "../store"
import Link from "next/link"

export default function SummarizeSelectedBtn() {
    const files = usePdfSummarizerStore((s) => s.files)
    const selectedPagesIds = usePdfSummarizerStore(
        (s) => s.selectedPagesLocalIds
    )
    const handleClick = () => {
        const toSummarize = files
            .map((file) => {
                return {
                    fileName: file.name,
                    pages: file.pages
                        .filter((page) =>
                            selectedPagesIds.includes(page.localId)
                        )
                        .map((page) => page.content)
                        .filter((content) => content.length > 10),
                }
            })
            .filter((file) => file.pages.length > 0)
    }
    return (
        <Link href={"/pdf-summarizer/multiple-pages"}>
            <Button
                onClick={handleClick}
                variant={"blue"}
                className="text-lg font-bold"
            >
                Summarize <Sparkles className="min-w-5 min-h-5" />
            </Button>
        </Link>
    )
}
