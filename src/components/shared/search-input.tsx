"use client"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/ui-utils"
import { SearchIcon } from "lucide-react"
import { useEffect, useState } from "react"

interface Props {
    onSearchChange: (value: string) => void
    searchValue: string
    placeholder?: string
    className?: string
}
export default function SearchInput(props: Props) {
    const [inputValue, setInputValue] = useState("")
    useEffect(() => {
        if (props.searchValue) {
            setInputValue((prev) => {
                if (prev !== props.searchValue) {
                    return props.searchValue
                }
                return prev
            })
        }
    }, [props.searchValue])

    return (
        <form
            className="relative"
            onSubmit={(e) => {
                e.preventDefault()
                props.onSearchChange(inputValue)
            }}
        >
            <SearchIcon className="absolute text-neutral-300 top-3 left-3" />
            <Input
                onChange={(e) => {
                    if (!e.target.value) {
                        props.onSearchChange("")
                    }
                    setInputValue(e.target.value)
                }}
                value={inputValue}
                placeholder={props.placeholder || "Search"}
                type="text"
                className={cn(
                    "min-w-[350px] pl-10 text-base font-semibold",
                    props.className
                )}
            />
        </form>
    )
}
