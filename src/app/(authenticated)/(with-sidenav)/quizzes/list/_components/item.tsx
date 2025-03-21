import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/ui-utils"
import { BookOpen, FileQuestion, Users, Zap } from "lucide-react"
import Link from "next/link"
import { ItemType } from "../page"
import MoreButton from "./more-button"

interface Props {
    item: ItemType
}

export default function Item({ item }: Props) {
    const background = `linear-gradient(135deg, hsl(${
        item.id * 50
    }, 70%, 90%), hsl(${item.id * 50}, 70%, 75%))`

    const questionCount = item.quizzes_questions[0].count
    const submissionCount = item.quiz_submissions[0].count

    return (
        <Card
            className={
                "relative h-[420px] flex flex-col shadow-md hover:shadow-lg transition-shadow"
            }
        >
            <div
                className={`h-48 min-h-48 hover:cursor-pointer transition-all relative bg-gray-100 rounded-t-lg overflow-hidden`}
            >
                <Link
                    href={`/quizzes/${item.id}`}
                    className={cn(
                        "absolute inset-0  flex active:scale-140 hover:scale-150 transition-all items-center justify-center",
                        {
                            " active:scale-100 hover:scale-105": !!item.image,
                        }
                    )}
                    style={{
                        background: item.image ? undefined : background,
                    }}
                >
                    {item.image ? (
                        <img
                            src={item.image}
                            alt={item.name}
                            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 object-center w-[90%] object-contain h-[90%]"
                        />
                    ) : (
                        <BookOpen className="w-12 h-12 text-white/70" />
                    )}
                </Link>
            </div>

            <div className="flex flex-col">
                <CardHeader className="-mt-3">
                    <MoreButton
                        authorId={item.author_id}
                        status={item.publishing_status}
                        itemId={item.id}
                        className="scale-90 absolute right-3"
                    />
                    <div className="flex  justify-between items-start">
                        <div className="">
                            <h2 className="text-2xl pb-2 line-clamp-1 first-letter:uppercase font-bold">
                                {item.name}
                            </h2>
                            {!!item.category?.name && (
                                <div className="text-base font-bold">
                                    Category :{" "}
                                    <Badge
                                        variant={"purple"}
                                        className="rounded-full  hover:bg-purple-100  ml-2 bg-purple-50 px-2  py-1"
                                    >
                                        {item.category?.name}
                                    </Badge>
                                </div>
                            )}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pb-2">
                    <div className="flex gap-4 items-center">
                        <Badge
                            variant={"blue"}
                            className="text-sm text-nowrap rounded-full !font-bold "
                        >
                            <FileQuestion className="w-4 h-4 text-blue-500 mr-1" />
                            {questionCount}{" "}
                            {questionCount === 1 ? "Question" : "Questions"}
                        </Badge>
                        <Badge
                            variant={"green"}
                            className="text-sm text-nowrap rounded-full !font-bold "
                        >
                            <Users className="w-4 h-4 text-green-500 mr-1" />
                            {submissionCount}{" "}
                            {submissionCount === 1
                                ? "Submission"
                                : "Submissions"}
                        </Badge>
                    </div>
                </CardContent>

                <div className="block pt-4 mt-auto h-20 gap-1">
                    <Link
                        href={`/quizzes/${item.id}`}
                        className="w-full absolute px-4 bottom-6 flex"
                    >
                        <Button
                            className="grow text-lg font-bold group"
                            variant={"blue"}
                        >
                            Get started{" "}
                            <Zap className="w-5 h-5 ml-2 group-hover:animate-pulse" />
                        </Button>
                    </Link>
                </div>
            </div>
        </Card>
    )
}
