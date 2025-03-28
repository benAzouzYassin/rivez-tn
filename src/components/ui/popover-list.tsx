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
import { ReactNode, useState } from "react"

type Props = {
    children?: ReactNode
    contentClassName?: string
    items: {
        isDanger?: boolean
        icon?: ReactNode
        label: string
        onClick?: () => void
        className?: string
    }[]
}
export default function PopoverList(props: Props) {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <Command
            onClick={(e) => e.stopPropagation()}
            className="bg-transparent"
        >
            <Popover onOpenChange={setIsOpen} open={isOpen}>
                <PopoverTrigger onClick={(e) => e.stopPropagation()} asChild>
                    {props.children}
                </PopoverTrigger>
                <PopoverContent
                    onClick={(e) => e.stopPropagation()}
                    className={cn(
                        "min-w-[200px]  rounded-xl overflow-hidden border !w-(--radix-popover-trigger-width) p-0",
                        props.contentClassName
                    )}
                    align="center"
                >
                    <CommandList
                        onClick={(e) => e.stopPropagation()}
                        className="p-0"
                    >
                        <CommandGroup
                            onClick={(e) => e.stopPropagation()}
                            className="p-0"
                        >
                            {props.items.map((item, i) => (
                                <CommandItem
                                    onSelect={(e) => {
                                        item.onClick?.()
                                        setIsOpen(false)
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    key={i}
                                    className={cn(
                                        "h-10 shadow-[0px_1px_0px] opacity-70 font-bold flex items-center shadow-neutral-200  rounded-none pl-4 text-sm active:scale-95 hover:cursor-pointer",
                                        {
                                            "data-[selected=true]:bg-red-200/70 !text-red-600":
                                                item.isDanger,
                                        },
                                        item.className
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
