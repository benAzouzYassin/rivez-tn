import { ComponentProps } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/ui-utils"

type Props = ComponentProps<"img">

export default function ImageWithPreview({
    alt,
    className,
    src,
    ...props
}: Props) {
    if (!src) {
        return (
            <div
                {...props}
                className={cn(
                    `active:scale-100  w-full h-full cursor-pointer hover:scale-105 transition-all bg-zinc-100 hover:opacity-90`,
                    className
                )}
            />
        )
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <img
                    alt={alt}
                    src={src}
                    {...props}
                    className={cn(
                        `active:scale-100 cursor-pointer hover:scale-105 transition-all hover:opacity-90`,
                        className
                    )}
                />
            </DialogTrigger>
            <DialogContent className="max-w-screen-lg w-full">
                <DialogTitle></DialogTitle>
                <DialogDescription></DialogDescription>
                <div className="relative w-full h-full flex items-center justify-center">
                    <img
                        src={src}
                        alt={alt}
                        {...props}
                        className="w-full max-h-[70vh] max-w-[70vh] h-auto object-contain"
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
