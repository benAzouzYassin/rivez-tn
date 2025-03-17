import { Card } from "@/components/ui/card"
import Courses from "../_icons/courses"
import FlashCards from "../_icons/flash-cards"
import SummarizeDocument from "../_icons/summarize-document"
import { Button } from "@/components/ui/button"
import GenerateQuiz from "../_icons/generate-quiz"
import LatestCoursesCarousel from "./latest-courses-carousel"
import FloatingSection from "./floating-section"

export default function HomePage() {
    return (
        <section className="pb-20">
            <div className="container relative  pt-20 z-10 mx-auto px-4 grid grid-cols-13 py-8">
                <section className="min-h-[400px] pl-8 flex flex-col gap-5 col-span-9">
                    <div className="grid min-h-52  mt-4 gap-4  grid-cols-2">
                        <Button
                            variant={"secondary"}
                            className="p-4  items-start justify-start flex-col h-44"
                        >
                            <div className="flex items-center gap-2">
                                <Courses className="!w-10 !h-10" />
                                <p className="text-2xl font-extrabold text-blue-700/70">
                                    Our courses
                                </p>
                            </div>
                            <p className="mt-2 pl-2 pr-4 text-base text-neutral-500 font-semibold text-wrap text-left">
                                Flash cards are common way to prepare for exams
                                and to assure that you memorize the terms
                            </p>
                        </Button>
                        <Button
                            variant={"secondary"}
                            className="p-4 px-4 py-6  items-start justify-start flex-col h-44"
                        >
                            <div className="flex items-center gap-2">
                                <FlashCards className="!w-10 !h-10" />
                                <p className="text-2xl font-extrabold text-blue-700/70">
                                    Flash Cards
                                </p>
                            </div>
                            <p className="mt-2 pl-2 pr-4 text-base text-neutral-500 font-semibold text-wrap text-left">
                                Flash cards are common way to prepare for exams
                                and to assure that you memorize the terms
                            </p>
                        </Button>
                        <Button
                            variant={"secondary"}
                            className="p-4 px-4 py-6  items-start justify-start flex-col h-44"
                        >
                            <div className="flex items-center gap-2">
                                <SummarizeDocument className="!w-10 !h-10" />
                                <p className="text-2xl font-extrabold text-blue-700/70">
                                    Summarize a PDF
                                </p>
                            </div>
                            <p className="mt-2 pl-2 pr-4 text-base text-neutral-500 font-semibold text-wrap text-left">
                                Flash cards are common way to prepare for exams
                                and to assure that you memorize the terms
                            </p>
                        </Button>
                        <Button
                            variant={"secondary"}
                            className="p-4 px-4 py-6  items-start justify-start flex-col h-44"
                        >
                            <div className="flex items-center gap-2">
                                <GenerateQuiz className="!w-10 !h-10" />
                                <p className="text-2xl font-extrabold text-blue-700/70">
                                    Generate a quiz
                                </p>
                            </div>
                            <p className="mt-2 pl-2 pr-4 text-base text-neutral-500 font-semibold text-wrap text-left">
                                Flash cards are common way to prepare for exams
                                and to assure that you memorize the terms
                            </p>
                        </Button>
                    </div>
                </section>
                <FloatingSection />
            </div>
            <LatestCoursesCarousel />
        </section>
    )
}
