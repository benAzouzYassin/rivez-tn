import XpIcon from "../icons/xp"
import TooltipWrapper from "../ui/tooltip"
import { LanguageSelector } from "./language-selector"
export default function UserHeader() {
    return (
        <header className="w-full  h-24 pl-[256px] flex  items-center">
            <div className="flex border-b-2 pb-3 w-full items-center px-20 ">
                <div className="ml-auto flex items-center gap-8">
                    <LanguageSelector />
                    <TooltipWrapper content="XP points">
                        <div className="flex hover:bg-blue-200/40 px-3 py-1 rounded-md  text-[#ff852d] text-base items-center font-bold justify-center">
                            <XpIcon className="h-6  w-6" />
                            10
                        </div>
                    </TooltipWrapper>
                    <button className="bg-neutral-300/50 border h-14 scale-110 active:scale-105 cursor-pointer w-14 rounded-full transition-transform "></button>
                </div>
            </div>
        </header>
    )
}
