import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover"
import { wait } from "@/utils/wait"
import { useEffect, useRef, useState } from "react"
import { Button } from "./button"
import { Input } from "./input"
import { Badge } from "./badge"

export default function SearchSelect<OptionData>(props: Props<OptionData>) {
    const [visibleItems, setVisibleItems] = useState(props.items)
    const [inputValue, setInputValue] = useState("")

    useEffect(() => {
        setVisibleItems(props.items)
    }, [props.items])

    const [isPopoverOpen, setIsPopoverOpen] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    return (
        <>
            <Command
                className="h-fit overflow-hidden"
                autoFocus={false}
                shouldFilter={false}
            >
                <Popover open={isPopoverOpen} modal={true}>
                    <PopoverAnchor autoFocus={false} asChild>
                        <Input
                            errorMessage={props.errorMessage}
                            className={props.inputClassName}
                            ref={inputRef}
                            value={inputValue}
                            autoFocus={false}
                            autoComplete="off"
                            placeholder={props.placeholder || "Search"}
                            onChange={(e) => {
                                const value = e.target.value || ""
                                setInputValue(value)

                                if (value) {
                                    setVisibleItems(
                                        props.items.filter((item) =>
                                            item.label
                                                .toLowerCase()
                                                .includes(value.toLowerCase())
                                        )
                                    )
                                } else {
                                    props.onUnselect?.()
                                    setVisibleItems(props.items)
                                }
                            }}
                            onFocus={() => {
                                setVisibleItems(props.items)
                                setIsPopoverOpen(true)
                            }}
                            onBlur={(e) => {
                                if (!e.target?.hasAttribute("cmdk-list")) {
                                    wait(100).then(() =>
                                        setIsPopoverOpen(false)
                                    )
                                }
                                setInputValue("")
                            }}
                        />
                    </PopoverAnchor>
                    <PopoverContent className="min-w-[250px] h-[200px] rounded-xl  overflow-hidden border !w-(--radix-popover-trigger-width) p-0">
                        <CommandList>
                            {props.isLoading ? (
                                <CommandEmpty className="h-full flex items-center justify-center">
                                    <p className="font-medium">Loading...</p>
                                </CommandEmpty>
                            ) : (
                                <>
                                    <CommandEmpty className="h-full flex items-center justify-center">
                                        {props.enableAddButton ? (
                                            <Button
                                                onClick={() =>
                                                    props.onAddButtonClick?.(
                                                        inputValue
                                                    )
                                                }
                                                variant={"secondary"}
                                                className="font-extrabold absolute top-1/2 active:-translate-y-[40%] -translate-y-1/2 min-w-1/2 mt-auto"
                                            >
                                                Add{" "}
                                                <span className="font-bold underline underline-offset-2">
                                                    {inputValue}
                                                </span>
                                            </Button>
                                        ) : (
                                            <p className="font-medium absolute top-[40%] -translate-y-1/5">
                                                No items found
                                            </p>
                                        )}
                                    </CommandEmpty>
                                    <CommandGroup className="p-0 max-h-[200px] overflow-visible">
                                        {visibleItems.map((item) => (
                                            <CommandItem
                                                key={item.id}
                                                onMouseDown={(e) =>
                                                    e.preventDefault()
                                                }
                                                className={`h-10 shadow-[0px_1px_0px] shadow-neutral-200 font-medium rounded-none pl-4 text-base active:scale-95 hover:cursor-pointer `}
                                                onSelect={() => {
                                                    setInputValue("")
                                                    if (
                                                        props.selectedIds.includes(
                                                            item.id
                                                        )
                                                    ) {
                                                        props.onUnselect?.(
                                                            item.id
                                                        )
                                                    } else {
                                                        props.onSelect?.([
                                                            ...props.selectedIds,
                                                            item.id,
                                                        ])
                                                    }
                                                    if (!props.allowMultiple) {
                                                        setIsPopoverOpen(false)
                                                        inputRef.current?.blur()
                                                    }
                                                }}
                                            >
                                                {item.label}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </>
                            )}
                        </CommandList>
                    </PopoverContent>
                </Popover>
            </Command>
            <div className="flex items-center gap-2 -mt-4 flex-wrap">
                {props.selectedIds
                    .map((id) => props.items.find((item) => item.id === id))
                    .map((item) => (
                        <Badge
                            onDelete={() => {
                                props.onUnselect?.(item?.id)
                            }}
                            variant={"blue"}
                            key={item?.id}
                        >
                            {item?.label}
                        </Badge>
                    ))}
            </div>
        </>
    )
}

interface Props<OptionData> {
    items: { id: string; label: string; data?: OptionData }[]
    selectedIds: string[]
    placeholder?: string
    onSelect?: (ids: string[]) => void
    onUnselect?: (unselectedId?: string) => void
    onAddButtonClick?: (inputValue: string) => void
    enableAddButton?: boolean
    isLoading?: boolean
    errorMessage?: string
    inputClassName?: string
    allowMultiple?: boolean
}
