import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
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
import getUnicodeFlagIcon from "country-flag-icons/unicode"
import { Check, SearchIcon } from "lucide-react"
import {
    ChangeEvent,
    ComponentProps,
    forwardRef,
    useMemo,
    useState,
} from "react"
import {
    Country,
    getCountryCallingCode,
    isSupportedCountry,
} from "react-phone-number-input/mobile"
import en from "react-phone-number-input/locale/en.json"
import { Virtuoso } from "react-virtuoso"
import { Input } from "./input"

export const PhoneInput = forwardRef<HTMLInputElement, PhoneSelectProps>(
    (
        {
            className,
            containerClassName,
            defaultCountry,
            onPhoneChange,
            ...props
        },
        ref
    ) => {
        const [open, setOpen] = useState(false)
        const [selectedCountry, setSelectedCountry] = useState(
            phoneCountries.find(
                (item) =>
                    item.value.toUpperCase() === defaultCountry?.toUpperCase()
            ) || phoneCountries[0]
        )
        const [phoneNumber, setPhoneNumber] = useState("")
        const [searchQuery, setSearchQuery] = useState("")

        const filteredCountries = useMemo(() => {
            if (!searchQuery) return phoneCountries
            const query = searchQuery.toLowerCase()
            return phoneCountries.filter(
                (country) =>
                    country.label.toLowerCase().includes(query) ||
                    country.code.includes(query) ||
                    country.value.toLowerCase().includes(query)
            )
        }, [searchQuery])

        const handlePhoneNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value.replace(/[^\d]/g, "")
            setPhoneNumber(value)
            onPhoneChange?.(selectedCountry.code + value)
        }

        return (
            <div className={cn("flex gap-2 h-fit", containerClassName)}>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="secondary"
                            role="combobox"
                            aria-expanded={open}
                            className={cn(
                                "w-[60px] flex items-center justify-center"
                            )}
                        >
                            <span className="text-xl">
                                {getUnicodeFlagIcon(
                                    selectedCountry.value.toUpperCase()
                                )}
                            </span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-[350px] p-0">
                        <Command>
                            <div className="px-[6px] relative pt-3">
                                <SearchIcon className="absolute top-6 text-neutral-400  right-7" />
                                <Input
                                    placeholder="Search country..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="h-[44px] placeholder:font-normal rounded-lg focus:outline-neutral-300  w-full"
                                />
                            </div>
                            <CommandEmpty>No country found.</CommandEmpty>
                            <CommandGroup className="p-0 pl-1">
                                <CommandList className="p-0 overflow-hidden">
                                    <Virtuoso
                                        className="virtuoso-scroll"
                                        data={filteredCountries}
                                        totalCount={filteredCountries.length}
                                        style={{ height: "250px" }}
                                        itemContent={(index, country) => (
                                            <CommandItem
                                                className=" border-t   active:scale-95 transition-all rounded data-[selected=true]:bg-blue-100 data-[selected=true]:cursor-pointer"
                                                key={country.value}
                                                value={`${country.value} ${country.label} ${country.code}`}
                                                onSelect={() => {
                                                    setSelectedCountry(country)
                                                    setOpen(false)
                                                    onPhoneChange?.(
                                                        country.code +
                                                            phoneNumber
                                                    )
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        selectedCountry.value ===
                                                            country.value
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                                <span className="flex items-center gap-2">
                                                    <span className="text-xl">
                                                        {getUnicodeFlagIcon(
                                                            country.value.toUpperCase()
                                                        )}
                                                    </span>
                                                    <span>
                                                        {country.label} (
                                                        {country.code})
                                                    </span>
                                                </span>
                                            </CommandItem>
                                        )}
                                    />
                                </CommandList>
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                </Popover>
                <input
                    ref={ref}
                    placeholder="Phone number"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    type="tel"
                    className={cn(
                        "rounded-xl dark:focus:outline-blue-300/30 focus:outline-blue-300  dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 focus:outline-2 bg-[#F7F7F7]/50 font-medium border-2 p-3 placeholder:transition-all focus:placeholder:translate-x-1 h-12 border-[#E5E5E5] placeholder:font-medium placeholder:text-[#AFAFAF]",
                        className
                    )}
                    {...props}
                />
            </div>
        )
    }
)

PhoneInput.displayName = "PhoneInput"
interface PhoneSelectProps extends ComponentProps<typeof Input> {
    onPhoneChange?: (value: string) => void
    containerClassName?: string
    flagButtonClassName?: string
    defaultCountry?: Country
}

interface CountryData {
    value: string
    label: string
    code: string
}

const phoneCountries: CountryData[] = Object.entries(en)
    .filter(([key]) => key.length === 2)
    .map(([code, name]) => ({
        value: code.toLowerCase(),
        label: name as string,
        code: `+${isSupportedCountry(code) ? getCountryCallingCode(code) : ""}`,
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
