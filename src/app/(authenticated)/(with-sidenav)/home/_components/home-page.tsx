import FloatingSection from "@/components/shared/floating-section"
import { Button } from "@/components/ui/button"
import { Cable, ReceiptText, WandSparkles } from "lucide-react"
import Link from "next/link"
import GenerateQuiz from "../_icons/generate-quiz"
import Mindmap from "../_icons/mindmap"
import SummarizeDocument from "../_icons/summarize-document"
import LatestQuizzesMindmaps from "./latest-quizzes-mindmaps"
import { getLanguage } from "@/utils/get-language"

import { translation } from "../translation"

export default function HomePage() {
    const lang = getLanguage()
    const t = translation[lang]
    return (
        <section className="pb-20 max-w-[1520px] mx-auto">
            <div className=" ml-0  relative pt-10   mx-auto z-10   px-4 grid grid-cols-1 2xl:grid-cols-13 py-8">
                <section className="min-h-[400px] md:pl-8  flex flex-col gap-5  col-span-1 md:col-span-8 lg:col-span-9 mb-8 md:mb-0">
                    <div className="grid min-h-52 mt-4  gap-4 grid-cols-1 sm:grid-cols-2">
                        <Link
                            href={"/quizzes"}
                            className="col-span-1 sm:col-span-2"
                        >
                            <Button
                                variant={"secondary"}
                                className="p-4 w-full items-start justify-start flex-col h-auto md:h-48"
                            >
                                <div className="flex items-center gap-2">
                                    <GenerateQuiz className="!w-8 !h-8 md:!w-10 md:!h-10" />
                                    <p className="text-xl md:text-2xl font-extrabold text-blue-700/70">
                                        {t["Quizzes"]}
                                    </p>
                                </div>
                                <p className="mt-2 pl-2 pr-4 text-base md:text-lg text-neutral-500 font-semibold text-wrap rtl:text-right ltr:text-left">
                                    {
                                        t[
                                            "Create and take interactive quizzes to test your knowledge. Perfect for exam prep and reinforcing key concepts through active recall. Quizzes can be generated from text, documents, images and videos."
                                        ]
                                    }
                                </p>
                            </Button>
                        </Link>
                        <Link href={"/mind-maps"} className="w-full">
                            <Button
                                variant={"secondary"}
                                className="p-4 px-4 py-6 w-full items-start justify-start flex-col h-auto md:h-48"
                            >
                                <div className="flex items-center gap-2">
                                    <Mindmap className="!w-8 !h-8 md:!w-10 md:!h-10 scale-320 -translate-y-2" />
                                    <p className="text-xl md:text-2xl font-extrabold text-blue-700/70">
                                        {t["Mindmap"]}
                                    </p>
                                </div>
                                <p className="mt-2 pl-2 pr-4 text-base md:text-lg text-neutral-500 font-semibold text-wrap rtl:text-right text-left">
                                    {
                                        t[
                                            "Visualize complex topics and their connections. by generating structured mindmaps to simplify any topic."
                                        ]
                                    }
                                </p>
                            </Button>
                        </Link>
                        <Link href={"/summarize"} className="w-full">
                            <Button
                                variant={"secondary"}
                                className="p-4 px-4 py-6 w-full items-start justify-start flex-col h-auto md:h-48"
                            >
                                <div className="flex items-center gap-2">
                                    <SummarizeDocument className="!w-8 !h-8 md:!w-10 md:!h-10" />
                                    <p className="text-xl md:text-2xl font-extrabold text-blue-700/70">
                                        {t["Summarize"]}
                                    </p>
                                </div>
                                <p className="mt-2 pl-2 pr-4 text-base md:text-lg text-neutral-500 font-semibold text-wrap text-left rtl:text-right">
                                    {
                                        t[
                                            "Extract key points from documents and lectures. Get concise summaries that highlight essential information."
                                        ]
                                    }
                                </p>
                            </Button>
                        </Link>
                    </div>
                </section>
                <div className="col-span-1 md:col-span-4 lg:col-span-4">
                    <FloatingSection />
                </div>
            </div>
            <LatestQuizzesMindmaps />
            <div className="h-auto px-4 sm:px-10 max-w-[1520px] mx-auto gap-4 sm:gap-7 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 rtl:text-right">
                <Link href={"/quizzes"} className="w-full">
                    <Button
                        variant={"secondary"}
                        className="p-4 w-full items-start justify-start flex-col h-auto md:h-48"
                    >
                        <div className="flex items-center gap-2">
                            <WandSparkles className="!w-8 !h-8 md:!w-9 md:!h-9 text-purple-500 p-1 border-purple-300 rounded-lg border-2" />
                            <p className="text-xl md:text-2xl font-extrabold text-purple-700/70">
                                {t["Quizzes"]}
                            </p>
                        </div>
                        <p className="mt-2 pl-2 pr-4 text-base md:text-lg text-neutral-500 font-semibold text-wrap rtl:text-right text-left">
                            {
                                t[
                                    "Save time and use AI to automatically create quizzes that helps you practice."
                                ]
                            }
                        </p>
                    </Button>
                </Link>
                <Link href={"/mind-maps"} className="w-full">
                    <Button
                        variant={"secondary"}
                        className="p-4 w-full items-start justify-start flex-col h-auto md:h-48"
                    >
                        <div className="flex items-center gap-2">
                            <Cable className="!w-8 !h-8 md:!w-9 md:!h-9 text-purple-500 p-1 border-purple-300 rounded-lg border-2" />
                            <p className="text-xl md:text-2xl font-extrabold text-purple-700/70">
                                {t["Mindmap"]}
                            </p>
                        </div>
                        <p className="mt-2 pl-2 pr-4 text-base md:text-lg text-neutral-500 font-semibold text-wrap rtl:text-right text-left">
                            {
                                t[
                                    "Simplify complex topics by generating mindmaps that visualize any topic."
                                ]
                            }
                        </p>
                    </Button>
                </Link>
                <Link href={"/summarize"} className="w-full">
                    <Button
                        variant={"secondary"}
                        className="p-4 w-full items-start justify-start flex-col h-auto md:h-48"
                    >
                        <div className="flex items-center gap-2">
                            <ReceiptText className="!w-8 !h-8 md:!w-9 md:!h-9 text-purple-500 p-1 border-purple-300 rounded-lg border-2" />
                            <p className="text-xl md:text-2xl font-extrabold text-purple-700/70">
                                {t["Summarize"]}
                            </p>
                        </div>
                        <p className="mt-2 pl-2 pr-4  text-base md:text-lg text-neutral-500 font-semibold text-wrap rtl:text-right text-left">
                            {
                                t[
                                    "Transform any content into concise and clear summaries."
                                ]
                            }
                        </p>
                    </Button>
                </Link>
            </div>
        </section>
    )
}
