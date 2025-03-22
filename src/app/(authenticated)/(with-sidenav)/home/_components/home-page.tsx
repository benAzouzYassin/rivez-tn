import { Button } from "@/components/ui/button"
import Courses from "../_icons/courses"
import FlashCards from "../_icons/flash-cards"
import GenerateQuiz from "../_icons/generate-quiz"
import LatestCoursesCarousel from "./latest-courses-carousel"
import FloatingSection from "@/components/shared/floating-section"
import Link from "next/link"

export default function HomePage() {
    return (
        <section className="pb-20">
            <div className="container relative  pt-10 z-10 mx-auto px-4 grid grid-cols-13 py-8">
                <section className="min-h-[400px] pl-8 flex flex-col gap-5 col-span-9">
                    <div className="grid min-h-52  mt-4 gap-4  grid-cols-2">
                        <Link href={"/courses/list"} className="col-span-2">
                            <Button
                                variant={"secondary"}
                                className="p-4 col-span-2  items-start justify-start flex-col h-48"
                            >
                                <div className="flex items-center gap-2">
                                    <Courses className="!w-10 !h-10" />
                                    <p className="text-2xl font-extrabold text-blue-700/70">
                                        Our courses
                                    </p>
                                </div>
                                <p className="mt-2 pl-2 pr-4 text-lg text-neutral-500 font-semibold text-wrap text-left">
                                    Explore our comprehensive software
                                    development courses designed to help you
                                    master modern programming languages,
                                    frameworks, and industry best practices.
                                </p>
                            </Button>
                        </Link>
                        <Link href={"/quizzes/list"}>
                            <Button
                                variant={"secondary"}
                                className="p-4 px-4 py-6  items-start justify-start flex-col h-48"
                            >
                                <div className="flex items-center gap-2">
                                    <GenerateQuiz className="!w-10 !h-10" />
                                    <p className="text-2xl font-extrabold text-blue-700/70">
                                        Quizzes
                                    </p>
                                </div>
                                <p className="mt-2 pl-2 pr-4 text-lg text-neutral-500 font-semibold text-wrap text-left">
                                    Take quizzes on various programming topics,
                                    or generate custom quizzes with AI.
                                </p>
                            </Button>
                        </Link>
                        <Link href={"/flash-cards/list"}>
                            <Button
                                variant={"secondary"}
                                className="p-4 px-4 py-6  items-start justify-start flex-col h-48"
                            >
                                <div className="flex items-center gap-2">
                                    <FlashCards className="!w-10 !h-10" />
                                    <p className="text-2xl font-extrabold text-blue-700/70">
                                        Flash Cards
                                    </p>
                                </div>
                                <p className="mt-2 pl-2 pr-4 text-lg text-neutral-500 font-semibold text-wrap text-left">
                                    Create your own study flashcards or browse
                                    our collection of popular decks.
                                </p>
                            </Button>
                        </Link>
                    </div>
                </section>
                <FloatingSection />
            </div>
            <LatestCoursesCarousel />
        </section>
    )
}
