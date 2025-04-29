import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover"
import { wait } from "@/utils/wait"
import { useEffect, useRef, useState, useMemo } from "react"
import { Button } from "./button"
import { Input } from "./input"
import { Badge } from "./badge"
import { getLanguage } from "@/utils/get-language"

export default function SearchSelect<OptionData>(props: Props<OptionData>) {
    const lang = props.lang || getLanguage?.() || "en"
    const t = useMemo(
        () => ({
            en: {
                search: "Search",
                loading: "Loading...",
                add: "Add",
                noItems: "No items found",
            },
            fr: {
                search: "Rechercher",
                loading: "Chargement...",
                add: "Ajouter",
                noItems: "Aucun élément trouvé",
            },
            ar: {
                search: "بحث",
                loading: "جار التحميل...",
                add: "إضافة",
                noItems: "لم يتم العثور على عناصر",
            },
        }),
        []
    )[lang]

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
                className="h-fit overflow-hidden dark:!bg-transparent"
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
                            placeholder={props.placeholder || t.search}
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
                    <PopoverContent className="min-w-[250px] h-[200px] rounded-xl overflow-hidden border !w-(--radix-popover-trigger-width) p-0 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 shadow-md dark:shadow-neutral-700">
                        <CommandList>
                            {props.isLoading ? (
                                <CommandEmpty className="h-full flex items-center justify-center">
                                    <p className="font-medium text-neutral-600 dark:text-neutral-200">
                                        {t.loading}
                                    </p>
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
                                                {t.add}{" "}
                                                <span className="font-bold underline underline-offset-2">
                                                    {inputValue}
                                                </span>
                                            </Button>
                                        ) : (
                                            <p className="font-medium absolute top-[40%] -translate-y-1/5 text-neutral-500 dark:text-neutral-400">
                                                {t.noItems}
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
                                                className={`h-10 shadow-[0px_1px_0px] shadow-neutral-200 dark:shadow-neutral-700 font-medium rounded-none pl-4 text-base active:scale-95 hover:cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200`}
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
                                                {/* makes sure every CommandItem content is unique */}
                                                <span className="w-0 opacity-0 overflow-hidden">
                                                    {item.id}
                                                </span>{" "}
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
    onSelect?: (oldAndNewIds: string[]) => void
    onUnselect?: (unselectedId?: string) => void
    onAddButtonClick?: (inputValue: string) => void
    enableAddButton?: boolean
    isLoading?: boolean
    errorMessage?: string
    inputClassName?: string
    allowMultiple?: boolean
    lang?: "en" | "fr" | "ar"
}
