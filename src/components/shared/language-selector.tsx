"use client"

import { cn } from "@/lib/ui-utils"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"

const languages = [
    { label: "العربية", value: "ar", flag: "/flags/palestine.svg" },
    { label: "English", value: "en", flag: "/flags/usa.svg" },
    { label: "Français", value: "fr", flag: "/flags/france.svg" },
]

type Props = {
    className?: string
    defaultLang: string
}

export function LanguageSelector(props: Props) {
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [language, setLanguage] = useState<
        (typeof languages)[number] | undefined
    >(languages.find((item) => item.value === props.defaultLang) || undefined)

    useEffect(() => {
        const selected = Cookies.get("selected-language")
        const lang = languages.find((l) => l.value === selected)
        if (lang) {
            setLanguage(lang)
        }
    }, [])

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    isLoading={isLoading}
                    variant="secondary"
                    className={cn(
                        "px-3 font-bold rounded-2xl md:rounded-xl z-50 text-stone-500/80 dark:text-neutral-400 h-9.5 md:h-10 text-sm",
                        props.className
                    )}
                >
                    {language?.label ? (
                        <img
                            alt=""
                            className="rounded-sm h-4 md:h-5"
                            src={language.flag}
                        />
                    ) : (
                        <div className="w-7 h-5 bg-neutral-200 dark:bg-neutral-700" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 rtl:-translate-x-2 mt-0 rounded-none border-none overflow-visible shadow-none !bg-transparent p-0!">
                <div className="rounded-2xl mt-1 overflow-hidden border-2 dark:border-neutral-700 bg-white dark:bg-neutral-800">
                    <div className="">
                        {languages.map((lang) => (
                            <button
                                key={lang.value}
                                className={cn(
                                    "flex items-center active:scale-95 transition-all h-12 border-t dark:border-neutral-600 px-6 w-full cursor-pointer hover:bg-blue-100/70 dark:hover:bg-neutral-700"
                                )}
                                onClick={() => {
                                    if (lang !== language) {
                                        setIsLoading(true)
                                        setLanguage(lang)
                                        setIsOpen(false)
                                        Cookies.set(
                                            "selected-language",
                                            lang.value
                                        )
                                        window.location.reload()
                                    }
                                }}
                            >
                                <img
                                    alt={lang.label}
                                    className="rounded-sm h-5 w-5 rtl:ml-2 mr-2"
                                    src={lang.flag}
                                />
                                <span
                                    className={cn(
                                        "text-sm font-bold text-neutral-600 dark:text-neutral-100 ml-1"
                                    )}
                                >
                                    {lang.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
