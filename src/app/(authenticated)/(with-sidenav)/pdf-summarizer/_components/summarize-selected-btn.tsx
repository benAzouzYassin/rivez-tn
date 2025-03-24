import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Sparkles } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"
import { useState } from "react"

export default function SummarizeSelectedBtn() {
    const router = useRouter()
    const [language, setLanguage] = useState("")
    const [customLanguage, setCustomLanguage] = useState("")
    const [useCustom, setUseCustom] = useState(false)

    const handleConfirm = () => {
        const selectedLang = useCustom ? customLanguage : language
        router.push(
            `/pdf-summarizer/multiple-pages${
                selectedLang ? `?lang=${selectedLang}` : ""
            }`
        )
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"blue"} className="text-lg font-bold">
                    Summarize <Sparkles className="min-w-5 min-h-5" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle className="text-2xl font-bold text-neutral-600">
                    Select Language (Optional)
                </DialogTitle>
                <DialogDescription></DialogDescription>

                {!useCustom ? (
                    <Select onValueChange={setLanguage}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="arabic">Arabic</SelectItem>
                            <SelectItem value="french">French</SelectItem>
                            <SelectItem value="spanish">Spanish</SelectItem>
                        </SelectContent>
                    </Select>
                ) : (
                    <Input
                        placeholder="Type your language"
                        className="w-full"
                        value={customLanguage}
                        onChange={(e) => setCustomLanguage(e.target.value)}
                    />
                )}
                <div className="flex items-center gap-2 -mt-6">
                    <span className="font-semibold text-neutral-600">
                        Use Custom Language
                    </span>
                    <Switch
                        className="scale-125 cursor-pointer"
                        checked={useCustom}
                        onCheckedChange={setUseCustom}
                    />
                </div>
                <Button onClick={handleConfirm} className="mt-4 text-lg w-full">
                    Confirm
                </Button>
            </DialogContent>
        </Dialog>
    )
}
