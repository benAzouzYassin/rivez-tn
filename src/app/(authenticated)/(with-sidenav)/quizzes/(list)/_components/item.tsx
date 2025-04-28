import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/ui-utils"
import { getLanguage } from "@/utils/get-language"
import { BookOpen, FileQuestion, Users } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"
import { useState } from "react"
import { ItemType } from "../page"
import MoreButton from "./more-button"
import ShareQuizDialog from "./share-quiz-dialog"
import { translation } from "../translation"

interface Props {
    item: ItemType
    disableMoreBtn?: boolean
}

export default function Item({ item, disableMoreBtn }: Props) {
    const lang = getLanguage()
    const t = translation[lang]
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
    const [isSharing, setIsSharing] = useState(false)
    const router = useRouter()
    const background = `linear-gradient(135deg, hsl(${
        item.id * 50
    }, 70%, 90%), hsl(${item.id * 50}, 70%, 75%))`

    const darkBackground = `linear-gradient(135deg, hsl(${
        item.id * 50
    }, 30%, 40%), hsl(${item.id * 50}, 30%, 30%))`

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
            className={cn(
                "relative active:translate-y-1 active:shadow-[0px_2px_0px] transition-all hover:cursor-pointer",
                "hover:bg-neutral-100 hover:shadow-neutral-300 hover:border-neutral-300",

                "dark:bg-neutral-800 dark:border-neutral-700 dark:hover:bg-neutral-700 dark:hover:shadow-neutral-800 dark:hover:border-neutral-600",
                "h-[410px] 2xl:h-[360px] flex rounded-3xl flex-col"
            )}
        >
            <div
                className={cn(
                    "xl:h-48 h-56 min-h-48 hover:cursor-pointer transition-all relative bg-gray-100 overflow-hidden",
                    "dark:bg-neutral-700"
                )}
            >
                <div
                    className={cn(
                        "absolute inset-0 flex active:scale-140 hover:scale-150 transition-all items-center justify-center",
                        {
                            "active:scale-100 hover:scale-105": !!item.image,
                        }
                    )}
                    style={{
                        background: item.image
                            ? undefined
                            : typeof window !== "undefined" &&
                              document.documentElement.classList.contains(
                                  "dark"
                              )
                            ? darkBackground
                            : background,
                    }}
                >
                    {item.image ? (
                        <img
                            src={item.image}
                            alt={item.name}
                            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 object-center object-cover"
                        />
                    ) : (
                        // LIGHTER icon color in dark mode
                        <BookOpen className="w-12 h-12 text-white/70 dark:text-white/70" />
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
                    <div className="flex justify-between items-start">
                        <div className="ltr:max-w-[90%] w-full">
                            <div className="w-full">
                                <h2
                                    className={cn(
                                        "text-2xl ltr:max-w-[90%] truncate pb-2 pr-6 rtl:pl-0 rtl:pr-6 first-letter:uppercase text-left font-bold",
                                        // LIGHTER dark text
                                        "text-neutral-900 dark:text-neutral-50"
                                    )}
                                >
                                    {item.name}
                                </h2>
                            </div>
                            {!!item.category?.name && (
                                <div className="text-base font-bold text-neutral-700 dark:text-neutral-200">
                                    Category :{" "}
                                    <Badge
                                        variant={"purple"}
                                        className="rounded-full hover:bg-purple-100 dark:hover:bg-purple-800 ml-2 bg-purple-50 dark:bg-purple-900 px-2 py-1"
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
                            className="text-sm text-nowrap grow rounded-full !font-bold bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200"
                        >
                            <FileQuestion className="w-4 h-4 text-blue-500 dark:text-blue-200 rtl:ml-1 mr-1" />
                            {questionCount} {t["Questions"]}
                        </Badge>
                        <Badge
                            variant={"green"}
                            className="text-sm text-nowrap grow rounded-full !font-bold bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-green-200"
                        >
                            <Users className="w-4 h-4 text-green-500 dark:text-green-200 rtl:ml-1 mr-1" />
                            {submissionCount} {t["Submissions"]}
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
