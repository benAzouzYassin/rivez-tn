import { ComponentProps } from "react"
import { Button } from "../ui/button"
import XIcon from "../icons/xIcon"
import { cn } from "@/lib/ui-utils"
import { useRouter } from "nextjs-toploader/app"

type Props = ComponentProps<typeof Button>
export default function BackButton({ className, onClick, ...props }: Props) {
    const router = useRouter()
    return (
        <Button
            {...props}
            onClick={(e) => {
                router.back()
                onClick?.(e)
            }}
            className={cn(" dark:hover:bg-neutral-800 h-10 w-10 ", className)}
            variant={"ghost"}
        >
            <XIcon />
        </Button>
    )
}
