"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useRouter } from "nextjs-toploader/app"
import { useState, useMemo } from "react"
import { getLanguage } from "@/utils/get-language"

interface Props {
    isOpen: boolean
    setIsOpen: (value: boolean) => void
}

export default function YoutubeLinkDialog(props: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [youtubeUrl, setYoutubeUrl] = useState("")
    const router = useRouter()

    const lang = getLanguage()

    const translation = useMemo(
        () => ({
            en: {
                "YouTube Video URL": "YouTube Video URL",
                "Enter the URL of the YouTube video you want to summarize.":
                    "Enter the URL of the YouTube video you want to summarize.",
                "YouTube URL": "YouTube URL",
                "https://www.youtube.com/watch?v=something":
                    "https://www.youtube.com/watch?v=something",
                Confirm: "Confirm",
            },
            fr: {
                "YouTube Video URL": "URL de la vidéo YouTube",
                "Enter the URL of the YouTube video you want to summarize.":
                    "Entrez l'URL de la vidéo YouTube que vous souhaitez résumer.",
                "YouTube URL": "URL YouTube",
                "https://www.youtube.com/watch?v=something":
                    "https://www.youtube.com/watch?v=something",
                Confirm: "Confirmer",
            },
            ar: {
                "YouTube Video URL": "رابط فيديو يوتيوب",
                "Enter the URL of the YouTube video you want to summarize.":
                    "أدخل رابط فيديو يوتيوب الذي تريد تلخيصه.",
                "YouTube URL": "رابط يوتيوب",
                "https://www.youtube.com/watch?v=something":
                    "https://www.youtube.com/watch?v=something",
                Confirm: "تأكيد",
            },
        }),
        []
    )

    const t = translation[lang]

    const handleSubmit = (e: any) => {
        e?.preventDefault?.()
        setIsSubmitting(true)
        router.push(
            `/youtube-video-summarizer?youtubeLink=${encodeURIComponent(
                youtubeUrl
            )}&language=${lang}`
        )
    }

    return (
        <Dialog open={props.isOpen} onOpenChange={props.setIsOpen}>
            <DialogContent>
                <DialogTitle className="text-center font-bold text-neutral-600 text-xl">
                    {t["YouTube Video URL"]}
                </DialogTitle>

                <form onSubmit={handleSubmit} className="mt-5 pb-0">
                    <div>
                        <label
                            htmlFor="youtubeUrl"
                            className="font-medium text-neutral-600"
                        >
                            {t["YouTube URL"]}
                            <span className="text-red-400 text-xl font-semibold">
                                *
                            </span>
                        </label>
                        <Input
                            errorMessage=""
                            className="w-full"
                            id="youtubeUrl"
                            value={youtubeUrl}
                            onChange={(e) => setYoutubeUrl(e.target.value)}
                            placeholder={
                                t["https://www.youtube.com/watch?v=something"]
                            }
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        className="text-lg h-[52px] w-full"
                        isLoading={isSubmitting}
                        disabled={!youtubeUrl}
                    >
                        {t.Confirm}
                    </Button>
                </form>
                <DialogDescription></DialogDescription>
            </DialogContent>
        </Dialog>
    )
}
