import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/ui-utils"
import { BookOpen, FileQuestion, Users } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"
import { ItemType } from "../page"
import MoreButton from "./more-button"
import { useState } from "react"
import ShareQuizDialog from "./share-quiz-dialog"

interface Props {
    item: ItemType
    disableMoreBtn?: boolean
}

export default function Item({ item, disableMoreBtn }: Props) {
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
    const [isSharing, setIsSharing] = useState(false)
    const router = useRouter()
    const background = `linear-gradient(135deg, hsl(${
        item.id * 50
    }, 70%, 90%), hsl(${item.id * 50}, 70%, 75%))`

    const questionCount = item.quizzes_questions[0].count
    const submissionCount = item.quiz_submissions[0].count
    const handleClick = () => {
        if (!isUpdateDialogOpen && !isSharing) {
            router.push(`/quizzes/${item.id}`)
        }
    }
    return (
        <Card
            onClick={handleClick}
            className={
                "relative active:translate-y-1 active:shadow-[0px_2px_0px] transition-all hover:cursor-pointer hover:bg-neutral-100 hover:shadow-neutral-300 hover:border-neutral-300 h-[410px] 2xl:h-[360px] flex rounded-3xl  flex-col  "
            }
        >
            <div
                className={`xl:h-48 h-56 min-h-48 hover:cursor-pointer transition-all relative bg-gray-100  overflow-hidden`}
            >
                <div
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
                            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 object-center  object-cover "
                        />
                    ) : (
                        <BookOpen className="w-12 h-12 text-white/70" />
                    )}
                </div>
            </div>

            <div className="flex flex-col">
                <CardHeader className="-mt-3">
                    {!disableMoreBtn && (
                        <MoreButton
                            isSharing={isSharing}
                            setIsSharing={setIsSharing}
                            isUpdateDialogOpen={isUpdateDialogOpen}
                            setIsUpdateDialogOpen={setIsUpdateDialogOpen}
                            authorId={item.author_id}
                            status={item.publishing_status}
                            itemId={item.id}
                            className="scale-90 absolute right-3"
                        />
                    )}
                    <div className="flex  justify-between items-start">
                        <div className=" max-w-[90%]">
                            <h2 className="text-2xl truncate pb-2   first-letter:uppercase font-bold">
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

                <CardContent className="pb-4">
                    <div className="flex flex-col 2xl:flex-row gap-4 2xl:items-center">
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
            </div>
            <ShareQuizDialog
                id={item.id}
                isOpen={isSharing}
                onOpenChange={setIsSharing}
                status={item.publishing_status}
            />
        </Card>
    )
}
