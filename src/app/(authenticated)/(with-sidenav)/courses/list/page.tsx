"use client"
import { cn } from "@/lib/ui-utils"
import { useSidenav } from "@/providers/sidenav-provider"
import { motion } from "framer-motion"
import { BookOpen, ZapIcon } from "lucide-react"
import { useState } from "react"
import ListItem from "./_components/list-item"
import EmptyDisplay from "@/components/shared/empty-display"

function Page() {
    const [activeTab, setActiveTab] = useState("popular")

    const tabs = [
        {
            id: "popular",
            label: "All Courses ",
            icon: <ZapIcon size={18} />,
            description: "Cards that need your attention",
            count: 3,
        },
        {
            id: "personal",
            label: "My Courses",
            icon: <BookOpen size={18} />,
            description: "View all your flashcard decks",
            count: courses.length,
        },
    ]
    const handleTabChange = (tabId: any) => {
        setActiveTab(tabId)
    }

    return (
        <div className="container mx-auto p-6 pb-20 min-h-screen isolate">
            <div className="flex flex-col gap-6">
                <div className="w-full border-2 rounded-2xl p-5 relative">
                    <h1 className="text-4xl text-neutral-600 absolute  top-7 font-extrabold">
                        Courses
                    </h1>
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
                        {activeTab === "personal" && (
                            <EmptyDisplay
                                buttonText="View popular"
                                title="You have no courses yet"
                                icon={
                                    <BookOpen
                                        size={50}
                                        className="text-indigo-500"
                                    />
                                }
                                description=""
                                onClick={() => setActiveTab("popular")}
                            />
                        )}

                        {activeTab === "popular" && (
                            <div className={cn(" flex flex-col gap-y-8")}>
                                {courses.map((item) => {
                                    return (
                                        <ListItem item={item} key={item.id} />
                                    )
                                })}
                                {!courses.length && (
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
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page

const courses = [
    {
        id: 1,
        title: "JavaScript Basics",
        description:
            "Master the fundamentals of JavaScript programming including variables, functions, arrays, and objects. Perfect for beginners looking to start their web development journey.",
        lastReviewed: "over 1 year ago",
        sections: 25,
        progress: 68,
        tags: ["Frontend", "Beginner"],
        createdAt: "2023-05-15",
        studyStreak: 5,
    },
    {
        id: 2,
        title: "React Hooks",
        description:
            "Dive deep into React Hooks and transform your functional components. Learn useState, useEffect, useContext and more to build powerful, state-driven applications.",
        lastReviewed: "over 1 year ago",
        sections: 18,
        isFavorite: true,
        progress: 92,
        tags: ["Frontend", "React", "Advanced"],
        createdAt: "2023-06-20",
        studyStreak: 12,
    },
    {
        id: 3,
        title: "CSS Grid & Flexbox",
        description:
            "Master modern CSS layout techniques with Grid and Flexbox. Learn how to create responsive, complex layouts with clean, maintainable code.",
        lastReviewed: "over 1 year ago",
        sections: 15,
        progress: 45,
        tags: ["Frontend", "CSS", "Layout"],
        createdAt: "2023-04-10",
        studyStreak: 3,
    },
    {
        id: 4,
        title: "TypeScript Fundamentals",
        description:
            "Take your JavaScript to the next level with TypeScript. Learn static typing, interfaces, generics, and how to build more robust applications with fewer bugs.",
        lastReviewed: "over 1 year ago",
        sections: 30,
        progress: 32,
        tags: ["Frontend", "TypeScript", "Intermediate"],
        createdAt: "2023-07-05",
        studyStreak: 0,
    },
    {
        id: 5,
        title: "Node.js Essentials",
        description:
            "Build scalable server-side applications with Node.js. Cover core concepts like the event loop, file system, streams, and creating RESTful APIs.",
        lastReviewed: "over 1 year ago",
        sections: 22,
        progress: 78,
        tags: ["Backend", "Node.js", "Server"],
        createdAt: "2023-05-30",
        studyStreak: 8,
    },
    {
        id: 6,
        title: "Data Structures",
        description:
            "Understand essential computer science concepts with a focus on data structures. Learn arrays, linked lists, trees, graphs, and algorithm complexity.",
        lastReviewed: "over 1 year ago",
        sections: 40,
        progress: 25,
        tags: ["Computer Science", "Algorithms"],
        createdAt: "2023-03-15",
        studyStreak: 2,
    },
]

export type ItemType = (typeof courses)[number]
