import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton"
import { readLastNMindmaps } from "@/data-access/mindmaps/read"
import { readLastNQuizzes } from "@/data-access/quizzes/read"
import { useCurrentUser } from "@/hooks/use-current-user"
import { formatDate } from "@/utils/date"
import { useQueries } from "@tanstack/react-query"
import { useRouter } from "nextjs-toploader/app"

export default function LatestQuizzesMindmaps() {
    const { data: currentUser } = useCurrentUser()
    const [quizzesQuery, mindMapsQuery] = useQueries({
        queries: [
            {
                enabled: !!currentUser?.id,
                queryKey: ["quizzes", currentUser?.id],
                queryFn: () => readLastNQuizzes(3, currentUser?.id as string),
            },
            {
                enabled: !!currentUser?.id,

                queryKey: ["mindmaps", currentUser?.id],
                queryFn: () => readLastNMindmaps(3, currentUser?.id as string),
            },
        ],
    })
    const isLoading = quizzesQuery.isLoading || mindMapsQuery.isLoading
    const items = [
        ...(quizzesQuery.data?.map((item) => {
            return {
                createdAt: item.created_at,
                title: item.name,
                image: item.image,
                id: item.id,
                description:
                    item.description ||
                    "Created the " + formatDate(item.created_at),
                tag: "Quizzes",
            }
        }) || []),
        ...(mindMapsQuery.data?.map((item) => {
            return {
                createdAt: item.created_at,
                title: item.name,
                image: item.image,
                id: item.id,
                description: "Created the " + formatDate(item.created_at),
                tag: "Mindmaps",
            }
        }) || []),
    ].toSorted(
        (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    const router = useRouter()
    if (!isLoading && items.length < 1) {
        return null
    }
    if (isLoading) {
        return <LatestQuizzesMindmapsSekelton />
    }
    return (
        <div className=" mb-10 mx-auto px-10 -mt-2 max-w-[1500px]">
            <h2 className="text-3xl font-extrabold text-blue-700/70 mb-4">
                Last quizzes and mindmaps :{" "}
            </h2>

            <Carousel
                opts={{
                    dragFree: true,
                }}
            >
                <CarouselContent className="pb-2">
                    {items.map((item) => (
                        <CarouselItem key={item.id} className="basis-1/2">
                            <div className="p-1">
                                <Card
                                    onClick={() => {
                                        if (item.tag === "quizzes") {
                                            router.push(`/quizzes/${item.id}`)
                                        } else {
                                            router.push(`/mind-maps/${item.id}`)
                                        }
                                    }}
                                    className="h-48 hover:bg-blue-50 transition-all active:translate-y-1 active:shadow-transparent cursor-pointer hover:border-blue-300 hover:shadow-blue-300 "
                                >
                                    <div className="p-6 flex ">
                                        {item.image ? (
                                            <img
                                                alt=""
                                                src={item.image}
                                                className="w-44 object-center object-cover bg-neutral-200 rounded-2xl h-32 mr-6"
                                            />
                                        ) : (
                                            <div className="w-44 bg-neutral-200 rounded-2xl h-32 mr-6"></div>
                                        )}
                                        <div>
                                            <h3 className="text-[1.4rem] text-neutral-700 font-extrabold">
                                                {item.title}
                                            </h3>
                                            <p className="text-gray-500 font-medium mt-2">
                                                {item.description}
                                            </p>

                                            <div className="flex gap-4 mt-4">
                                                <Badge
                                                    variant={"blue"}
                                                    className="  opacity-90 px-3 py-1 rounded-full text-sm"
                                                >
                                                    {item.tag}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious
                    iconClassName="!w-6   stroke-3  !text-blue-400 !h-6"
                    className="-left-6 w-10  h-10  !border-blue-200 !bg-white"
                />
                <CarouselNext
                    iconClassName="!w-6   stroke-3  !text-blue-400 !h-6"
                    className="-right-6 w-10  h-10 !border-blue-200  !bg-white"
                />
            </Carousel>
        </div>
    )
}

export function LatestQuizzesMindmapsSekelton() {
    return (
        <div className=" mb-10 mx-auto px-10 -mt-2  max-w-[1500px]">
            <h2 className="text-3xl font-extrabold text-blue-700/70 mb-4">
                Last quizzes and mindmaps :{" "}
            </h2>

            <Carousel>
                <CarouselContent className="flex gap-4 pb-2 ">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <CarouselItem
                            key={index}
                            className="basis-1/2 active:cursor-grabbing cursor-grab"
                        >
                            <Card className="h-48 ">
                                <CardContent className="p-6 flex space-x-6">
                                    <Skeleton className="w-44 h-32 rounded-md" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-6 w-[80%]" />
                                        <Skeleton className="h-4 mt-2 w-[60%]" />
                                        <div className="flex gap-2 mt-6">
                                            <Skeleton className="h-6 w-16 rounded-full" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious
                    iconClassName="!w-6   stroke-3  !text-blue-400 !h-6"
                    className="-left-6 w-10  h-10  !border-blue-200 !bg-white"
                />
                <CarouselNext
                    iconClassName="!w-6   stroke-3  !text-blue-400 !h-6"
                    className="-right-6 w-10  h-10 !border-blue-200  !bg-white"
                />
            </Carousel>
        </div>
    )
}
