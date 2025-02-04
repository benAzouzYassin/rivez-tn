import { Button } from "@/components/ui/button"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
} from "@/components/ui/carousel"
import { CategoryType } from "../page"
import Link from "next/link"

type Props = {
    category: CategoryType
}
export function Category(props: Props) {
    return (
        <div className="min-h-[200px] w-full ">
            <div className="flex items-center gap-4 ">
                {!!props.category.image && (
                    <img className="w-14" alt="" src={props.category.image} />
                )}
                <div className="">
                    <p className="text-2xl font-bold text-neutral-700 ">
                        {props.category.name}
                    </p>
                    <p className="font-medium text-neutral-700">
                        {props.category.description ||
                            "Master problem solving essentials in math"}
                    </p>
                </div>
            </div>
            <div className="bg-neutral-100 p-4 mt-5 rounded-2xl overflow-hidden">
                <Carousel
                    opts={{
                        align: "start",
                    }}
                    className="w-full"
                >
                    <CarouselContent className="relative">
                        {props.category.quizzes.map((quiz) => (
                            <CarouselItem key={quiz.id} className="basis-72 ">
                                <div className="p-1">
                                    <Link href={`/quizzes/${quiz.id}`}>
                                        <Button
                                            variant={"secondary"}
                                            className="flex w-full hover:cursor-pointer bg-white hover:shadow-sky-300 hover:border-sky-300 hover:bg-sky-100 flex-col h-56  items-center justify-center p-6"
                                        >
                                            {!!quiz.image && (
                                                <img
                                                    className="h-[88px] "
                                                    alt=""
                                                    src={quiz.image}
                                                />
                                            )}
                                            <p className="mt-7 font-semibold text-lg">
                                                {quiz.name}
                                            </p>
                                        </Button>
                                    </Link>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselNext
                        iconClassName="w-6! h-6!"
                        className="right-0 bg-black hover:bg-white hover:border-neutral-300 text-white border-black w-12 h-12"
                    />
                </Carousel>
            </div>
        </div>
    )
}
