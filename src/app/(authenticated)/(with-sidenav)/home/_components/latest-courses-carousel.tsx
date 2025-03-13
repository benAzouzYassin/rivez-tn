import { Card } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { useRouter } from "nextjs-toploader/app"

export default function LatestCoursesCarousel() {
    // Sample course data
    const courses = [
        {
            id: 1,
            title: "Introduction to React",
            description:
                "Learn the fundamentals of React and build your first application",
            level: "Beginner",
        },
        {
            id: 2,
            title: "Advanced JavaScript Patterns",
            description:
                "Master advanced JavaScript concepts and design patterns",
            level: "Intermediate",
        },
        {
            id: 3,
            title: "Full Stack Web Development",
            description:
                "Build complete web applications with modern technologies",
            level: "Advanced",
        },
        {
            id: 4,
            title: "UI/UX Design Principles",
            description:
                "Learn essential design principles for creating great user experiences",
            level: "Beginner",
        },
    ]

    const router = useRouter()
    return (
        <div className=" mx-auto px-10 -mt-6 max-w-[1500px]">
            <h2 className="text-3xl font-extrabold text-blue-700/70 mb-4">
                Our latest courses:
            </h2>

            <Carousel
                opts={{
                    dragFree: true,
                }}
            >
                <CarouselContent className="">
                    {courses.map((course, index) => (
                        <CarouselItem key={course.id} className="basis-1/2">
                            <div className="p-1">
                                <Card
                                    onClick={() => {
                                        router.push(`/course/${1}`)
                                    }}
                                    className="h-48 hover:bg-blue-50 transition-all active:translate-y-1 active:shadow-transparent cursor-pointer hover:border-blue-300 hover:shadow-blue-300 "
                                >
                                    <div className="p-6 flex ">
                                        <div className="w-44 bg-neutral-200 rounded-2xl h-32 mr-6"></div>
                                        <div>
                                            <h3 className="text-xl font-bold">
                                                {course.title}
                                            </h3>
                                            <p className="text-gray-600 mt-2">
                                                {course.description}
                                            </p>

                                            <div className="flex gap-4 mt-4">
                                                <div className="bg-blue-100 px-3 py-1 rounded-full text-blue-800 text-sm">
                                                    {course.level}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious
                    iconClassName="!w-6   stroke-3  !text-blue-400 !h-6"
                    className="-left-6 w-10  h-10  !border-blue-200 !bg-white"
                />
                <CarouselNext
                    iconClassName="!w-6   stroke-3  !text-blue-400 !h-6"
                    className="-right-6 w-10  h-10 !border-blue-200  !bg-white"
                />
            </Carousel>
        </div>
    )
}
