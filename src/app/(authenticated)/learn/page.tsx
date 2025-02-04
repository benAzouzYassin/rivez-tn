"use client"
import { ErrorDisplay } from "@/components/shared/error-display"
import AnimatedLoader from "@/components/ui/animated-loader"
import { readCategoriesWithQuizzes } from "@/data-access/categories/read"
import { useQuery } from "@tanstack/react-query"
import { Category } from "./_components/category"

export default function Page() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["categories", "quizzes", "quizzes_questions"],
        queryFn: () => readCategoriesWithQuizzes(),
    })
    if (isError) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <ErrorDisplay />
            </div>
        )
    }
    return (
        <>
            <div className="container mx-auto px-4 py-8">
                {isLoading ? (
                    <div className="flex h-[50vh] items-center justify-center">
                        <AnimatedLoader />
                    </div>
                ) : (
                    <div className="px-20">
                        <h1 className="text-3xl font-extrabold">
                            Our learning paths
                        </h1>
                        <p className="font-medium">
                            Step-by-step paths to mastery
                        </p>
                        <div className="flex flex-col mt-10 gap-16">
                            {data?.map((category) => {
                                return (
                                    <Category
                                        category={category}
                                        key={category.id}
                                    />
                                )
                            })}
                        </div>
                    </div>
                )}
                {data?.length === 0 && (
                    <div className="text-center text-gray-500 mt-8">
                        No quizzes available at the moment.
                    </div>
                )}
            </div>
        </>
    )
}

export type CategoryType = Awaited<
    ReturnType<typeof readCategoriesWithQuizzes>
>[number]
