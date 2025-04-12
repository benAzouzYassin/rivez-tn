import FloatingSection from "@/components/shared/floating-section"
import { Button } from "@/components/ui/button"
import { Cable, ReceiptText, WandSparkles } from "lucide-react"
import Link from "next/link"
import GenerateQuiz from "../_icons/generate-quiz"
import Mindmap from "../_icons/mindmap"
import SummarizeDocument from "../_icons/summarize-document"
import LatestQuizzesMindmaps from "./latest-quizzes-mindmaps"

export default function HomePage() {
    return (
        <section className="pb-20">
            <div className="container relative  pt-10 z-10 mx-auto px-4 grid grid-cols-13 py-8">
                <section className="min-h-[400px] pl-8 flex flex-col gap-5 col-span-9">
                    <div className="grid min-h-52  mt-4 gap-4  grid-cols-2">
                        <Link href={"/quizzes"} className="col-span-2">
                            <Button
                                variant={"secondary"}
                                className="p-4 col-span-2  items-start justify-start flex-col h-48"
                            >
                                <div className="flex items-center gap-2">
                                    <GenerateQuiz className="!w-10 !h-10" />
                                    <p className="text-2xl font-extrabold text-blue-700/70">
                                        Quizzes
                                    </p>
                                </div>
                                <p className="mt-2 pl-2 pr-4 text-lg text-neutral-500 font-semibold text-wrap text-left">
                                    Create and take interactive quizzes to test
                                    your knowledge. Perfect for exam prep and
                                    reinforcing key concepts through active
                                    recall. Quizzes can be generated from text,
                                    documents, images and videos.
                                </p>
                            </Button>
                        </Link>
                        <Link href={"/mind-maps"}>
                            <Button
                                variant={"secondary"}
                                className="p-4 px-4 py-6  items-start justify-start flex-col h-48"
                            >
                                <div className="flex items-center gap-2">
                                    <Mindmap className="!w-10 scale-320 -translate-y-2  !h-10" />
                                    <p className="text-2xl font-extrabold text-blue-700/70">
                                        Mindmap
                                    </p>
                                </div>
                                <p className="mt-2 pl-2 pr-4 text-lg text-neutral-500 font-semibold text-wrap text-left">
                                    Visualize complex topics and their
                                    connections. by generating structured
                                    mindmaps to simplify any topic.
                                </p>
                            </Button>
                        </Link>
                        <Link href={"/summarize"}>
                            <Button
                                variant={"secondary"}
                                className="p-4 px-4 py-6  items-start justify-start flex-col h-48"
                            >
                                <div className="flex items-center gap-2">
                                    <SummarizeDocument className="!w-10 !h-10" />
                                    <p className="text-2xl font-extrabold text-blue-700/70">
                                        Summarize
                                    </p>
                                </div>
                                <p className="mt-2 pl-2 pr-4 text-lg text-neutral-500 font-semibold text-wrap text-left">
                                    Extract key points from documents and
                                    lectures. Get concise summaries that
                                    highlight essential information.
                                </p>
                            </Button>
                        </Link>
                    </div>
                </section>
                <FloatingSection />
            </div>
            <LatestQuizzesMindmaps />
            <div className="h-56 px-10 max-w-[1520px] mx-auto  gap-7 grid grid-cols-3">
                <Link href={"/quizzes/add"} className="">
                    <Button
                        variant={"secondary"}
                        className="p-4   items-start justify-start flex-col h-48"
                    >
                        <div className="flex items-center gap-2">
                            <WandSparkles className="!w-9 !h-9 text-purple-500 p-1 border-purple-300 rounded-lg border-2" />
                            <p className="text-2xl font-extrabold text-purple-700/70">
                                Quizzes
                            </p>
                        </div>
                        <p className="mt-2 pl-2 pr-4 text-lg text-neutral-500 font-semibold text-wrap text-left">
                            Save time and use AI to automatically create quizzes
                            that helps you practice.
                        </p>
                    </Button>
                </Link>
                <Link href={"/mind-maps"} className="">
                    <Button
                        variant={"secondary"}
                        className="p-4   items-start justify-start flex-col h-48"
                    >
                        <div className="flex items-center gap-2">
                            <Cable className="!w-9 !h-9 text-purple-500 p-1 border-purple-300 rounded-lg border-2" />
                            <p className="text-2xl font-extrabold text-purple-700/70">
                                Mindmaps
                            </p>
                        </div>
                        <p className="mt-2 pl-2 pr-4 text-lg text-neutral-500 font-semibold text-wrap text-left">
                            Simplify complex topics by generating mindmaps that
                            visualize any topic .
                        </p>
                    </Button>
                </Link>
                <Link href={"/summarize"} className="">
                    <Button
                        variant={"secondary"}
                        className="p-4 col-span-2  items-start justify-start flex-col h-48"
                    >
                        <div className="flex items-center gap-2">
                            <ReceiptText className="!w-9 !h-9 text-purple-500 p-1 border-purple-300 rounded-lg border-2" />
                            <p className="text-2xl font-extrabold text-purple-700/70">
                                Summarize
                            </p>
                        </div>
                        <p className="mt-2 pl-2 pr-4 text-lg text-neutral-500 font-semibold text-wrap text-left">
                            Transform any content into concise and clear
                            summaries.
                        </p>
                    </Button>
                </Link>
            </div>
        </section>
    )
}
