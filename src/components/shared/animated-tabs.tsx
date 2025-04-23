import { motion } from "framer-motion"
import { cn } from "@/lib/ui-utils"

interface Tab {
    id: string
    label: string
    icon: React.ReactNode
    count: number
}

interface AnimatedTabsProps {
    className?: string
    tabs: Tab[]
    activeTab: string
    onTabChange: (tabId: string) => void
}

export default function AnimatedTabs({
    tabs,
    activeTab,
    onTabChange,
    className,
}: AnimatedTabsProps) {
    const handleTabChange = (tabId: string): void => {
        if (onTabChange) {
            onTabChange(tabId)
        }
    }

    return (
        <div
            className={cn(
                "flex flex-col border p-2 isolate w-full rounded-2xl sm:w-fit space-y-4",
                className
            )}
        >
            <div className="flex sm:flex-row rtl:sm:flex-row-reverse flex-col-reverse w-full sm:w-fit gap-2">
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className="relative group cursor-pointer"
                    >
                        <div
                            className={cn(
                                "relative bg-white border-2 transition-all hover:bg-neutral-100 flex items-center px-10 py-3 rounded-lg",
                                {
                                    "border-transparent": activeTab === tab.id,
                                }
                            )}
                        >
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="background"
                                    className="bg-gradient-to-r rounded-lg z-10 bg-blue-50 border-blue-300 border-2 text-white absolute top-0 left-0 w-full h-full"
                                ></motion.div>
                            )}
                            <div className="flex z-20   items-center">
                                <span
                                    className={`mr-2 transition-all duration-0 ${
                                        activeTab === tab.id
                                            ? "text-blue-400"
                                            : "text-blue-500"
                                    }`}
                                >
                                    {tab.icon}
                                </span>
                                <span className="font-semibold rtl:-translate-x-2 text-nowrap transition-all duration-0">
                                    {tab.label}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
