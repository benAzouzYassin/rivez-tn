import React from "react"
import { TABS } from "./ai-quiz-dialog-content"
import { cn } from "@/lib/ui-utils"

type Props = {
    currentTab: (typeof TABS)[number]
    onTabChange: (tab: (typeof TABS)[number]) => void
}

export default function AiQuizDialogTabs(props: Props) {
    return (
        <div className="pt-6">
            <div className="flex border-b">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        className={cn(
                            "px-4 py-2 focus:outline-none cursor-pointer transition-all font-bold border-b-2",
                            {
                                "border-blue-500 text-blue-500":
                                    props.currentTab === tab,
                                "border-transparent text-gray-600":
                                    props.currentTab !== tab,
                            }
                        )}
                        onClick={() => props.onTabChange(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>
    )
}
