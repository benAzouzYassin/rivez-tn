"use client"

import { Button } from "@/components/ui/button"
import LearningPath from "./_components/learning-path"
import { ChevronLeft } from "lucide-react"
import { useState } from "react"
import HomePage from "./_components/home-page"

export default function Page() {
    const lastCourseName = "React.js course"
    const [displayLastCourse, setDisplayLastCourse] = useState(true)
    return (
        <div className="relative isolate">
            <div className="absolute py-4 z-20 pl-12 ">
                {" "}
                <Button
                    onClick={() => {
                        setDisplayLastCourse((prev) => !prev)
                    }}
                    variant={"secondary"}
                    className=" z-50 !px-3"
                >
                    <ChevronLeft className="!w-6 text-neutral-400 stroke-3 !h-6" />{" "}
                    <span className="-ml-1 text-base text-neutral-400 font-extrabold pr-3">
                        {displayLastCourse ? "Home" : lastCourseName}
                    </span>
                </Button>
            </div>
            {displayLastCourse ? (
                <LearningPath courseId={1} courseName={lastCourseName} />
            ) : (
                <HomePage />
            )}
        </div>
    )
}
