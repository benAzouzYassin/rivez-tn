import FloatingSection from "./floating-section"
import LearningPathSection from "./learning-path-section"

interface Props {
    courseName: string
    courseId: number
}
export default function LearningPath(props: Props) {
    return (
        <div className="container relative  pt-20 z-10 mx-auto px-4 grid grid-cols-12 py-8">
            <section className="min-h-[400px] pl-8 flex flex-col gap-5 col-span-8">
                <LearningPathSection
                    content="01. Basics"
                    title="React-js"
                    variant="emerald"
                />
                <LearningPathSection
                    content="01. Basics"
                    title="React-js"
                    variant="purple"
                />
                <LearningPathSection
                    content="01. Basics"
                    title="React-js"
                    variant="sky"
                />
            </section>
            <FloatingSection />
        </div>
    )
}
