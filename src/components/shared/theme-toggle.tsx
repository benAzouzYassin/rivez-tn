"use client"

import { cn } from "@/lib/ui-utils"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useEffect, useState } from "react"
import { Moon, Monitor, SunMedium } from "lucide-react"
import { useTheme } from "next-themes"
import Cookies from "js-cookie"

const themes = [
    { label: "Light", value: "light", icon: SunMedium },
    { label: "Dark", value: "dark", icon: Moon },
    { label: "System", value: "system", icon: Monitor },
]

type Props = {
    className?: string
    defaultTheme?: string
}

export function ThemeToggle(props: Props) {
    const { setTheme } = useTheme()
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [theme, setThemeState] = useState<
        (typeof themes)[number] | undefined
    >(themes.find((item) => item.value === props.defaultTheme) || themes[2])

    useEffect(() => {
        const selected = Cookies.get("selected-theme")
        const savedTheme = themes.find((t) => t.value === selected)
        if (savedTheme) {
            setThemeState(savedTheme)
        }
    }, [])

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    isLoading={isLoading}
                    variant="secondary"
                    className={cn(
                        "px-3 font-bold rounded-2xl md:rounded-xl z-50 dark:text-neutral-300/80 text-stone-500/80 h-9.5 md:h-10 text-sm",
                        props.className
                    )}
                >
                    {theme ? (
                        <theme.icon className="w-5 scale-115 min-w-5 stroke-[2.4] min-h-5 h-5" />
                    ) : (
                        <div className="w-7 h-7 bg-neutral-200" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 !bg-transparent rtl:-translate-x-2 mt-0 rounded-none border-none overflow-visible shadow-none  p-0!">
                <div className="rounded-2xl mt-1 overflow-hidden border-2 dark:border-neutral-700 bg-white dark:bg-neutral-800">
                    <div className="">
                        {themes.map((themeOption) => {
                            const Icon = themeOption.icon
                            return (
                                <button
                                    key={themeOption.value}
                                    className={cn(
                                        "flex items-center active:scale-95 transition-all h-12 dark:border-neutral-600 border-t px-4 w-full cursor-pointer hover:bg-blue-100/70 dark:hover:bg-neutral-700"
                                    )}
                                    onClick={() => {
                                        if (themeOption !== theme) {
                                            setIsLoading(true)
                                            setThemeState(themeOption)
                                            setIsOpen(false)
                                            Cookies.set(
                                                "selected-theme",
                                                themeOption.value
                                            )
                                            setTheme(themeOption.value)
                                            setTimeout(() => {
                                                setIsLoading(false)
                                            }, 300)
                                        }
                                    }}
                                >
                                    <Icon className="!h-6 !w-6 rtl:ml-2 stroke-[2.3] text-neutral-500/80 dark:text-neutral-300 mr-2" />
                                    <span
                                        className={cn(
                                            "text-sm font-bold text-neutral-600 dark:text-neutral-200 ml-1"
                                        )}
                                    >
                                        {themeOption.label}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
