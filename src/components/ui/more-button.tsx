import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/ui-utils"
import { wait } from "@/utils/wait"
import { MoreVerticalIcon } from "lucide-react"
import { ReactNode, useState } from "react"

type Props = {
    children?: ReactNode
    items: {
        isDanger?: boolean
        icon: ReactNode
        label: string
        onClick?: () => void
        className?: string
    }[]
}
export default function MoreButton(props: Props) {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <Command>
            <Popover onOpenChange={setIsOpen} open={isOpen}>
                <PopoverTrigger asChild>
                    {props.children || (
                        <button
                            role="button"
                            className="h-8 hover:border-2 hover:bg-neutral-50 flex items-center justify-center rounded-lg  w-8 p-0  hover:cursor-pointer active:scale-95"
                        >
                            <MoreVerticalIcon className="!h-6 text-neutral-600 !w-6" />
                        </button>
                    )}
                </PopoverTrigger>
                <PopoverContent
                    className="min-w-[200px] -translate-x-4 rounded-xl overflow-hidden border !w-(--radix-popover-trigger-width) p-0"
                    align="center"
                >
                    <CommandList className="p-0">
                        <CommandGroup className="p-0">
                            {props.items.map((item, i) => (
                                <CommandItem
                                    onSelect={() => {
                                        item.onClick?.()
                                        setIsOpen(false)
                                    }}
                                    key={i}
                                    className={cn(
                                        "h-10 shadow-[0px_1px_0px] opacity-70 font-bold flex items-center shadow-neutral-200  rounded-none pl-4 text-sm active:scale-95 hover:cursor-pointer",
                                        {
                                            "data-[selected=true]:bg-red-200/70 !text-red-600":
                                                item.isDanger,
                                        }
                                    )}
                                >
                                    <span className="scale-90">
                                        {item.icon}
                                    </span>
                                    {item.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </PopoverContent>
            </Popover>
        </Command>
    )
}
