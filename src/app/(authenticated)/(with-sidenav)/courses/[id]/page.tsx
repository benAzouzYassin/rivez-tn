"use client"

import LearningPath from "./_components/learning-path"

export default function Page() {
    const lastCourseName = "React.js course"
    return (
        <div className="relative isolate">
            <LearningPath courseId={1} courseName={lastCourseName} />
        </div>
    )
}
