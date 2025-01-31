"use client"
import UserLayout from "@/components/layouts/user-layout/user-layout"
import AnimatedLoader from "@/components/ui/animated-loader"
import { Button } from "@/components/ui/button"
import { readQuizzesWithQuestions } from "@/data-access/quizzes/read"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"

export default function Page() {
    const { data, isLoading } = useQuery({
        queryKey: ["quizzes", "quizzes_questions"],
        queryFn: readQuizzesWithQuestions,
    })

    return (
        <UserLayout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-center">
                    Available Quizzes
                </h1>
                {isLoading ? (
                    <div className="flex h-[50vh] items-center justify-center">
                        <AnimatedLoader />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 px-20 gap-6">
                        {data?.map((quiz) => (
                            <div key={quiz.id}>
                                <div className="bg-white  min-h-44 p-6 hover:bg-neutral-100  shadow-[0px_4px_0px_0px] shadow-[#E5E5E5]  rounded-2xl text-black border-2   transition-all">
                                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                                        {quiz.name}
                                    </h2>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-gray-500"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <span className="text-gray-600">
                                                {quiz.quizzes_questions.length}{" "}
                                                Questions
                                            </span>
                                        </div>
                                    </div>
                                    <Link
                                        className="mt-8 block w-full"
                                        href={`/quizzes/${quiz.id}`}
                                    >
                                        <Button
                                            variant={"blue"}
                                            className="w-full"
                                        >
                                            Start Quiz
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {data?.length === 0 && (
                    <div className="text-center text-gray-500 mt-8">
                        No quizzes available at the moment.
                    </div>
                )}
            </div>
        </UserLayout>
    )
}
