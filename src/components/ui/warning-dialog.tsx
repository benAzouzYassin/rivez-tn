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
import { cn } from "@/lib/ui-utils"
import { Loader2, TriangleAlert } from "lucide-react"
import { ReactNode, useState } from "react"

type Props = {
    onConfirm: () => Promise<void>
    titleClassName?: string
    title?: string
    description?: string
    children?: ReactNode
    confirmText?: string
    cancelText?: string
    isOpen: boolean
    onOpenChange: (value: boolean) => void
    confirmBtnClassName?: string
}
const WarningDialog = ({
    onConfirm,
    title = "Are you absolutely sure?",
    description = "This action cannot be undone. This will permanently delete this item from our servers.",
    children,
    confirmText = "Delete",
    cancelText = "Cancel",
    isOpen,
    onOpenChange,
    confirmBtnClassName,
    titleClassName,
}: Props) => {
    const [isLoading, setIsLoading] = useState(false)

    const handleConfirm = async () => {
        try {
            setIsLoading(true)
            await onConfirm()
            onOpenChange(false)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            {!!children && <DialogTrigger asChild>{children}</DialogTrigger>}

            <DialogContent className=" md:min-w-[600px] xl:max-w-[35vw] !rounded-2xl">
                <DialogHeader>
                    <DialogTitle
                        className={cn(
                            "flex items-start gap-2 text-[#FF5353] text-2xl font-extrabold",
                            titleClassName
                        )}
                    >
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
                        onClick={() => !isLoading && onOpenChange(false)}
                    >
                        <Button
                            onClick={(e) => e.stopPropagation()}
                            className={cn(
                                "font-extrabold px-8 text-neutral-700 !text-lg"
                            )}
                            variant={"secondary"}
                        >
                            {cancelText}
                        </Button>
                    </DialogClose>

                    <Button
                        variant={"red"}
                        onClick={(e) => {
                            e.stopPropagation()
                            handleConfirm()
                        }}
                        disabled={isLoading}
                        className={cn(
                            "font-extrabold bg-red-500 shadow-red-600/80 !text-lg px-8",
                            confirmBtnClassName
                        )}
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

export default WarningDialog
