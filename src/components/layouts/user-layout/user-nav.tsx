"use client"
import { Button } from "@/components/ui/button"
/* eslint-disable @next/next/no-img-element */
import { useState } from "react"

export default function UserNav() {
    const [selected, setSelected] = useState("Learn")

    const handleSelect = (name: string) => {
        setSelected(name)
    }

    return (
        <nav className="h-full z-10 border-r-2 px-4 fixed top-0 left-0 w-[256px]">
            <div className="flex items-center justify-center mt-6">
                <img
                    alt=""
                    className="opacity-80"
                    width={100}
                    height={100}
                    src={"/logo.svg"}
                />
            </div>

            {/* Buttons */}
            <Button
                variant={"secondary"}
                onClick={() => handleSelect("Learn")}
                className={`py-7  mt-14 text-lg  font-extrabold rounded-xl w-full justify-start ${
                    selected === "Learn"
                        ? "bg-[#D3EEFA]/50 shadow-[0px_0px_0px_0px] text-[#27b3ef] hover:bg-[#cdeffd]/80 border-[#8cd9f9]/70 border-2 shadow-[#8cd9f9]/70"
                        : "bg-white shadow-[0px_0px_0px_0px] text-[#545454] hover:bg-neutral-100 border-white shadow-neutral-200"
                }`}
            >
                <img alt="" src="/icons/house.svg" className="h-8 w-8" />
                <span className="ml-3">Learn</span>
            </Button>

            <Button
                variant={"secondary"}
                onClick={() => handleSelect("Ranking")}
                className={`mt-1 py-7 text-lg  font-extrabold rounded-xl w-full justify-start ${
                    selected === "Ranking"
                        ? "bg-[#D3EEFA]/50 shadow-[0px_0px_0px_0px] text-[#27b3ef] hover:bg-[#cdeffd]/80 border-[#8cd9f9]/70 border-2 shadow-[#8cd9f9]/70"
                        : "bg-white shadow-[0px_0px_0px_0px] text-[#545454] hover:bg-neutral-100 border-white shadow-neutral-200"
                }`}
            >
                <img alt="" src="/icons/shield.svg" className="h-8 w-8" />
                <span className="ml-3">Ranking</span>
            </Button>

            <Button
                variant={"secondary"}
                onClick={() => handleSelect("Quests")}
                className={`mt-1 py-7 text-lg  font-extrabold rounded-xl w-full justify-start ${
                    selected === "Quests"
                        ? "bg-[#D3EEFA]/50 shadow-[0px_0px_0px_0px] text-[#27b3ef] hover:bg-[#cdeffd]/80 border-[#8cd9f9]/70 border-2 shadow-[#8cd9f9]/70"
                        : "bg-white shadow-[0px_0px_0px_0px] text-[#545454] hover:bg-neutral-100 border-white shadow-neutral-200"
                }`}
            >
                <img alt="" src="/icons/box.svg" className="h-8 w-8" />
                <span className="ml-3">Quests</span>
            </Button>

            <Button
                variant={"secondary"}
                onClick={() => handleSelect("Shop")}
                className={`mt-1 py-7 text-lg  font-extrabold rounded-xl w-full justify-start ${
                    selected === "Shop"
                        ? "bg-[#D3EEFA]/50 shadow-[0px_0px_0px_0px] text-[#27b3ef] hover:bg-[#cdeffd]/80 border-[#8cd9f9]/70 border-2 shadow-[#8cd9f9]/70"
                        : "bg-white shadow-[0px_0px_0px_0px] text-[#545454] hover:bg-neutral-100 border-white shadow-neutral-200"
                }`}
            >
                <img alt="" src="/icons/loot.svg" className="h-8 w-8" />
                <span className="ml-3">Shop</span>
            </Button>

            {/* Settings Button */}
            <div className="absolute bottom-5 px-3 left-0 w-full">
                <Button
                    variant={"secondary"}
                    onClick={() => handleSelect("Settings")}
                    className={`mt-1 py-7 text-lg  font-extrabold rounded-xl w-full justify-start ${
                        selected === "Settings"
                            ? "bg-[#D3EEFA]/50 shadow-[0px_0px_0px_0px] text-[#27b3ef] hover:bg-[#cdeffd]/80 border-[#8cd9f9]/70 border-2 shadow-[#8cd9f9]/70"
                            : "bg-white shadow-[0px_0px_0px_0px] text-[#545454] hover:bg-neutral-100 border-white shadow-neutral-200"
                    }`}
                >
                    <img
                        alt=""
                        src="/icons/settings.svg"
                        className="h-8 scale-95 w-8"
                    />
                    <span className="ml-3">Settings</span>
                </Button>
            </div>
        </nav>
    )
}
