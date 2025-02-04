"use client"

import { cn } from "@/lib/ui-utils"
import { JSX } from "react"

export default function UserMenu({
    items,
    userName,
}: {
    items: MenuItem[]
    userName: string
}) {
    return (
        <div>
            <div className="px-4 py-3">
                <p className="font-bold text-base  ml-1 first-letter:uppercase text-neutral-500">
                    {userName}
                </p>
            </div>
            <div className=" ">
                {items.map((item, index) => (
                    <button
                        key={index}
                        onClick={item.onClick}
                        className={cn(
                            "flex w-full items-center gap-3 px-4 py-3 text-sm font-bold",
                            "transition-colors hover:bg-neutral-100 last:border-b active:bg-neutral-100",
                            item.className
                        )}
                    >
                        {item.icon}
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    )
}
export type MenuItem = {
    icon: JSX.Element
    label: string
    onClick: () => void
    className: string
}
