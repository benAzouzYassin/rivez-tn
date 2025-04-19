import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useRouter } from "nextjs-toploader/app"
import { useState } from "react"
interface Props {
    isOpen: boolean
    setIsOpen: (value: boolean) => void
}
export default function YoutubeLinkDialog(props: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [youtubeUrl, setYoutubeUrl] = useState("")
    const router = useRouter()
    const handleSubmit = (e: any) => {
        e?.preventDefault?.()
        setIsSubmitting(true)
        router.push(
            `/youtube-video-summarizer?youtubeLink=${youtubeUrl}&language=`
        )
    }
    return (
        <Dialog open={props.isOpen} onOpenChange={props.setIsOpen}>
            <DialogContent>
                <DialogTitle></DialogTitle>
                <DialogDescription></DialogDescription>

                <form onSubmit={handleSubmit} className="mt-5 pb-0">
                    <div>
                        <label
                            htmlFor="text"
                            className="font-medium text-neutral-600"
                        >
                            Youtube url
                            <span className="text-red-400 text-xl font-semibold">
                                *
                            </span>
                        </label>
                        <Input
                            errorMessage=""
                            className="w-full"
                            id="text"
                            value={youtubeUrl}
                            onChange={(e) => setYoutubeUrl(e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=something"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        className="text-lg h-[52px] w-full"
                        isLoading={isSubmitting}
                        disabled={!youtubeUrl}
                    >
                        Confirm
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
