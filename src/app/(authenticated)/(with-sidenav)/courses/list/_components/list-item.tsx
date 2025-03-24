import ProgressBar from "@/components/shared/progress-bar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { shuffleArray } from "@/utils/array"
import { BookOpen, StarIcon } from "lucide-react"
import Link from "next/link"
import { ItemType } from "../page"
import MoreButton from "./more-button"
import { useRouter } from "nextjs-toploader/app"

interface Props {
    item: ItemType
}
export default function ListItem({ item }: Props) {
    const background = `linear-gradient(135deg, hsl(${
        item.id * 50
    }, 70%, 90%), hsl(${item.id * 50}, 70%, 75%))`
    const possibleTagColors = ["blue", "green", "orange", "purple", "gray"]
    const router = useRouter()
    const handleCardClick = () => {
        router.push("/courses/1")
    }
    return (
        <Card
            onClick={handleCardClick}
            key={item.id}
            className={
                "relative shadow-none   hover:bg-stone-100 cursor-pointer active:scale-99 transition-all rounded-2xl flex flex-row h-48"
            }
        >
            {/* Left side - Image section */}
            <div
                className={`w-56 hover:cursor-pointer transition-all relative bg-gray-100 rounded-l-lg overflow-hidden`}
            >
                <div
                    className="absolute inset-0 flex active:scale-140 hover:scale-150 transition-all items-center justify-center"
                    style={{
                        background: background,
                    }}
                >
                    <BookOpen className="w-12 h-12 text-white/70" />
                </div>
            </div>

            {/* Right side - Content section */}
            <div className={`flex flex-col flex-grow`}>
                <CardHeader className="pb-2">
                    <MoreButton
                        itemId={item.id}
                        className="scale-90 absolute right-5"
                    />
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl -mt-2 font-bold">
                                {item.title}
                            </h2>
                            <div className="flex flex-wrap gap-y-2 items-center gap-1 mt-1">
                                {item.tags.map((tag, index) => (
                                    <Badge
                                        variant={
                                            shuffleArray(possibleTagColors)[
                                                index % 4
                                            ] as any
                                        }
                                        key={index}
                                        className="text-xs h-7"
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pb-2 ">
                    <div className="flex justify-between items-center text-gray-500 mb-1 text-sm">
                        <div className="flex items-center gap-1 font-bold">
                            <StarIcon size={14} />
                            <span>Your progress: </span>
                        </div>

                        <div className="flex font-semibold justify-end mt-7 items-center text-xs text-gray-500">
                            <span>
                                {Math.floor(
                                    (item.progress * item.sections) / 100
                                )}
                                /{item.sections} section
                            </span>
                        </div>
                    </div>
                    <ProgressBar
                        filledClassName="h-3  [&>div]:top-[2px] [&>div]:h-[6px]"
                        percentage={50}
                        className="h-3"
                    />
                </CardContent>
            </div>
        </Card>
    )
}
