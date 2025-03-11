"use client"

import { Button } from "@/components/ui/button"
import LearningPath from "./_components/learning-path"
import { ChevronLeft } from "lucide-react"
import { useState } from "react"

export default function Page() {
    const lastCourseName = "React.js course"
    return (
        <div className="relative isolate">
            <LearningPath courseId={1} courseName={lastCourseName} />
        </div>
    )
}
