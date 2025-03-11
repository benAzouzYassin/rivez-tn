"use client"
import SearchInput from "@/components/shared/search-input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/ui-utils"
import { motion } from "framer-motion"
import { BookMarked, BookOpen, Plus, Star, ZapIcon } from "lucide-react"
import { useState } from "react"
import ListItem from "./_components/list-item"
import { useSidenav } from "@/providers/sidenav-provider"
import EmptyDisplay from "./_components/empty-display"

function Page() {
    const [activeTab, setActiveTab] = useState("all")

    const flashcardSets = [
        {
            id: 1,
            title: "JavaScript Basics",
            lastReviewed: "over 1 year ago",
            questions: 25,
            isFavorite: false,
            progress: 68,
            dueDate: "3 days",
            tags: ["Frontend", "Beginner"],
            createdAt: "2023-05-15",
            studyStreak: 5,
        },
        {
            id: 2,
            title: "React Hooks",
            lastReviewed: "over 1 year ago",
            questions: 18,
            isFavorite: true,
            progress: 92,
            dueDate: "Today",
            tags: ["Frontend", "React", "Advanced"],
            createdAt: "2023-06-20",
            studyStreak: 12,
        },
        {
            id: 3,
            title: "CSS Grid & Flexbox",
            lastReviewed: "over 1 year ago",
            questions: 15,
            isFavorite: false,
            progress: 45,
            dueDate: "Tomorrow",
            tags: ["Frontend", "CSS", "Layout"],
            createdAt: "2023-04-10",
            studyStreak: 3,
        },
        {
            id: 4,
            title: "TypeScript Fundamentals",
            lastReviewed: "over 1 year ago",
            questions: 30,
            isFavorite: false,
            progress: 32,
            dueDate: "5 days",
            tags: ["Frontend", "TypeScript", "Intermediate"],
            createdAt: "2023-07-05",
            studyStreak: 0,
        },
        {
            id: 5,
            title: "Node.js Essentials",
            lastReviewed: "over 1 year ago",
            questions: 22,
            isFavorite: true,
            progress: 78,
            dueDate: "2 days",
            tags: ["Backend", "Node.js", "Server"],
            createdAt: "2023-05-30",
            studyStreak: 8,
        },
        {
            id: 6,
            title: "Data Structures",
            lastReviewed: "over 1 year ago",
            questions: 40,
            isFavorite: false,
            progress: 25,
            dueDate: "1 week",
            tags: ["Computer Science", "Algorithms"],
            createdAt: "2023-03-15",
            studyStreak: 2,
        },
    ]

    // Custom tab data with icons and descriptions
    const tabs = [
        {
            id: "all",
            label: "My flashcards",
            icon: <BookOpen size={18} />,
            description: "View all your flashcard decks",
            count: flashcardSets.length,
        },
        {
            id: "popular",
            label: "Popular Flashcards ",
            icon: <ZapIcon size={18} />,
            description: "Cards that need your attention",
            count: 3,
        },

        {
            id: "recent",
            label: "Recently Studied",
            icon: <BookMarked size={18} />,
            description: "Continue where you left off",
            count: 2,
        },
    ]
    const { isSidenavOpen } = useSidenav()
    const handleTabChange = (tabId: any) => {
        setActiveTab(tabId)
    }

    return (
        <div className="container mx-auto p-6 pb-20 min-h-screen isolate">
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-4xl text-neutral-600 -mt-5 font-extrabold">
                        My Flashcards
                    </h1>
                    <div className="flex items-center gap-2">
                        <div className="mt-5 ">
                            <SearchInput
                                iconClassName="top-4"
                                className="h-[3.2rem] !w-20"
                                onSearchChange={() => {}}
                                searchValue=""
                            />
                        </div>

                        <Button className="text-base h-[3.2rem]">
                            <Plus className="-mr-1 !w-5 stroke-2 !h-5" /> Create
                            New
                        </Button>
                    </div>
                </div>

                <div className="w-full border-2 rounded-2xl p-5">
                    <div className="mb-4 ">
                        <div className="flex border-2 rounded-2xl ml-auto px-2 py-2 w-fit flex-wrap gap-2 mb-2">
                            {tabs.map((tab) => (
                                <div
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`relative  group cursor-pointer `}
                                >
                                    <div
                                        className={cn(
                                            ` relative  bg-white  border-2  transition-all  hover:bg-neutral-100  flex items-center px-10 py-3 rounded-lg`,
                                            {
                                                "border-transparent":
                                                    activeTab === tab.id,
                                            }
                                        )}
                                    >
                                        {activeTab === tab.id && (
                                            <motion.div
                                                layoutId="background"
                                                className="bg-gradient-to-r rounded-lg z-10 bg-blue-50 border-blue-300 border-2 text-white absolute top-0 left-0 w-full h-full"
                                            ></motion.div>
                                        )}
                                        <div className="flex  z-20 items-center">
                                            <span
                                                className={`mr-2  transition-all duration-0  ${
                                                    activeTab === tab.id
                                                        ? "text-blue-400"
                                                        : "text-blue-500"
                                                }`}
                                            >
                                                {tab.icon}
                                            </span>
                                            <span
                                                className={cn(
                                                    "font-semibold transition-all duration-0 "
                                                )}
                                            >
                                                {tab.label}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tab content */}
                    <div className="relative min-h-[70vh] ">
                        {activeTab === "all" && (
                            <div
                                className={cn(
                                    "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8",
                                    {
                                        " lg:grid-cols-4 ": !isSidenavOpen,
                                    }
                                )}
                            >
                                {flashcardSets.map((item) => {
                                    return (
                                        <ListItem item={item} key={item.id} />
                                    )
                                })}
                                {!flashcardSets.length && (
                                    <EmptyDisplay
                                        title="You have no flashcards yet"
                                        icon={
                                            <BookOpen
                                                size={50}
                                                className="text-indigo-500"
                                            />
                                        }
                                        description="Cards will appear here when you create or mark them as favorite."
                                    />
                                )}
                            </div>
                        )}
                        {activeTab === "popular" && (
                            <EmptyDisplay
                                title="No popular flashcards yet"
                                icon={
                                    <ZapIcon
                                        size={50}
                                        className="text-indigo-500"
                                    />
                                }
                                description=""
                                onClick={() => setActiveTab("all")}
                            />
                        )}
                        {activeTab === "recent" && (
                            <EmptyDisplay
                                title="No Recent studied flashcards yet."
                                icon={
                                    <BookMarked
                                        size={50}
                                        className="text-indigo-500"
                                    />
                                }
                                description=" Cards will appear here when you finish them."
                                onClick={() => setActiveTab("all")}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page
