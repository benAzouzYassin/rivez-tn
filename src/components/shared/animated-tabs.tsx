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
                "flex flex-col border p-2 isolate w-full rounded-2xl sm:w-fit space-y-4 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-800 transition-colors",
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
                                "relative bg-white dark:bg-neutral-700/20 border-2 border-neutral-200 dark:border-neutral-700 transition-all hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center px-10 py-3 rounded-lg ",
                                {
                                    "border-transparent": activeTab === tab.id,
                                }
                            )}
                        >
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="background"
                                    className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40 rounded-lg z-10 border-blue-300 dark:border-blue-700 border-2 absolute top-0 left-0 w-full h-full transition-colors"
                                ></motion.div>
                            )}
                            <div className="flex z-20 items-center">
                                <span
                                    className={`mr-2 transition-all duration-0 ${
                                        activeTab === tab.id
                                            ? "text-blue-400 dark:text-blue-300"
                                            : "text-blue-500 dark:text-blue-200"
                                    }`}
                                >
                                    {tab.icon}
                                </span>
                                <span className="font-semibold rtl:-translate-x-2 text-nowrap transition-all duration-0 text-neutral-800 dark:text-neutral-100">
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
