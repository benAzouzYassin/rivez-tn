import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2, Trash2, TriangleAlert } from "lucide-react"
import { ReactNode, useState } from "react"

type Props = {
    onConfirm: () => Promise<void>
    title?: string
    description?: string
    children?: ReactNode
    confirmText?: string
    cancelText?: string
    icon?: ReactNode
}
const DestructiveAction = ({
    onConfirm,
    title = "Are you absolutely sure?",
    description = "This action cannot be undone. This will permanently delete this item from our servers.",
    children,
    confirmText = "Delete",
    cancelText = "Cancel",
    icon = <Trash2 className="h-4 w-4" />,
}: Props) => {
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const handleConfirm = async () => {
        try {
            setIsLoading(true)
            await onConfirm()
            setIsOpen(false)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button
                        variant="destructive"
                        size="icon"
                        className="hover:scale-105 active:scale-100 transition-all duration-200"
                        onClick={() => setIsOpen(true)}
                    >
                        {icon}
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="sm:max-w-[35vw] !rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-start gap-2 text-[#FF5353] text-2xl font-extrabold">
                        <TriangleAlert className="h-6 w-6 mt-[3px] stroke-3" />
                        {title}
                    </DialogTitle>
                    <DialogDescription className="text-gray-500 mt-1 font-sans text-sm ">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="gap-2">
                    <DialogClose
                        asChild
                        disabled={isLoading}
                        onClick={() => !isLoading && setIsOpen(false)}
                    >
                        <Button
                            className="font-extrabold px-8 text-neutral-700 !text-lg"
                            variant={"secondary"}
                        >
                            {cancelText}
                        </Button>
                    </DialogClose>

                    <Button
                        variant={"red"}
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="font-extrabold bg-red-500 shadow-red-600/80 !text-lg px-8"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            </div>
                        ) : (
                            confirmText
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DestructiveAction
