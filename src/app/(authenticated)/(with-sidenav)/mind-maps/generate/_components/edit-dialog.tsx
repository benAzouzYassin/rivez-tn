"use client"

import { Save } from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { TGeneratedMindmap } from "@/data-access/mindmaps/constants"
import { toastError, toastSuccess } from "@/lib/toasts"
import { FormEvent, useState } from "react"

interface Props {
    mindMap?: TGeneratedMindmap
    onSubmit: (newMindMap: TGeneratedMindmap) => void
    isOpen: boolean
    onOpenChange: (value: boolean) => void
}
export default function EditMindmapDialog(props: Props) {
    const [editInstructions, setEditInstructions] = useState("")
    const [language, setLanguage] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (!editInstructions.trim()) {
            toastError(
                "Please specify what changes you want to make to the mindmap."
            )

            return
        }

        setIsSubmitting(true)

        try {
            // TODO make the api call
            toastSuccess("Your changes have been applied successfully.")

            props.onOpenChange(false)
        } catch (error) {
            console.error("Error updating mindmap:", error)
            toastError("Something went wrong.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={props.isOpen} onOpenChange={props.onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-neutral-700">
                        Edit Your Mind Map
                    </DialogTitle>
                    <DialogDescription className="text-neutral-500">
                        Describe the changes you want to make to your existing
                        mindmap.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label
                            htmlFor="instructions"
                            className="font-medium text-neutral-600 block mb-1"
                        >
                            Describe Your Changes
                            <span className="text-red-400 text-xl font-semibold ml-1">
                                *
                            </span>
                        </label>
                        <Textarea
                            id="instructions"
                            value={editInstructions}
                            onChange={(e) =>
                                setEditInstructions(e.target.value)
                            }
                            placeholder="Example: Make the max depth equal to 4"
                            className="h-32"
                            required
                        />
                        <p className="text-xs text-neutral-500 -mt-5 ml-1">
                            Be specific about what you want to add, remove, or
                            modify.
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor="language"
                            className="font-medium text-neutral-600 block"
                        >
                            Language
                        </label>
                        <Select onValueChange={setLanguage} value={language}>
                            <SelectTrigger id="language" className="w-full">
                                <SelectValue placeholder="Same as original (recommended)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="english">English</SelectItem>
                                <SelectItem value="arabic">Arabic</SelectItem>
                                <SelectItem value="french">French</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-neutral-500 -mt-3 ml-1">
                            Choose a different language or keep the original.
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => props.onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="gap-1"
                            isLoading={isSubmitting}
                            disabled={isSubmitting || !editInstructions.trim()}
                        >
                            <Save size={16} />
                            Save Changes
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
