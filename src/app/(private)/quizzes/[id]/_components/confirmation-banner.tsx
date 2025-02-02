import { Button } from "@/components/ui/button"
import { cn } from "@/lib/ui-utils"
type Props = {
    isOpen: boolean
    onNextClick: () => void
}
export default function ConfirmationBanner(props: Props) {
    return (
        <div
            className={cn(
                " border-2 overflow-hidden opacity-0  h-0 ease-in  flex py-5 px-20  transition-all border-neutral-200/80 bg-white fixed w-full  bottom-0",
                { "h-[120px] opacity-100": props.isOpen }
            )}
        >
            {" "}
            <div className="flex items-center">
                <div></div>
            </div>
            <Button
                onClick={props.onNextClick}
                disabled={!props.isOpen}
                className="ml-auto h-12  px-7 text-neutral-500 !font-extrabold   my-auto "
                variant={"secondary"}
            >
                Skip question
            </Button>
        </div>
    )
}
