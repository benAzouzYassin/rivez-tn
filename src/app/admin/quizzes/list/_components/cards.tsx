import { Card } from "@/components/ui/card"
import ImageWithPreview from "@/components/ui/img-with-preview"
import { Item } from "../page"
import Category from "./category"
import MoreButton from "./more-button"
import StatusButton from "./status-button"

interface Props {
    data: Item[]
    isLoading: boolean
}

export default function Cards(props: Props) {
    return (
        <div className="grid grid-cols-4 gap-x-5 gap-y-10">
            {props.data.map((item) => {
                return (
                    <Card
                        key={item.id}
                        className="h-[350px] max-w-[350px] flex flex-col relative group"
                    >
                        <div className="absolute top-2 right-2 z-10">
                            <MoreButton itemId={item.id} />
                        </div>

                        <div className="h-[150px] w-full relative">
                            {item.image ? (
                                <ImageWithPreview
                                    alt=""
                                    className="h-full w-full object-contain object-center"
                                    src={item.image}
                                />
                            ) : (
                                <div className="h-full w-full bg-zinc-200/70" />
                            )}
                        </div>

                        <div className="p-3 flex flex-col flex-1">
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="font-extrabold pt-1 first-letter:capitalize text-xl line-clamp-1">
                                    {item.name}
                                </h3>
                            </div>

                            <div className="flex text-base font-semibold truncate line-clamp-2 items-center gap-2 mb-2 -mt-1">
                                <p className="!w-[80px] font-bold">
                                    Category :
                                </p>

                                <div className="pr-2 overflow-hidden">
                                    <Category
                                        className="h-10 translate-y-2 w-[200px] "
                                        categoryId={item.category?.id || null}
                                        itemId={item.id}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-4 mb-2">
                                <span className="text-base font-bold">
                                    Questions:{" "}
                                    <span className="text-base pt-1 ml-2">
                                        {item.quizzes_questions?.[0]?.count}
                                    </span>
                                </span>
                            </div>

                            <div className="flex items-center gap-4 mb-2">
                                <span className="text-base font-bold">
                                    status:{" "}
                                </span>
                                <div className=" w-fit">
                                    <StatusButton
                                        itemId={item.id}
                                        status={item.publishing_status}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                )
            })}
        </div>
    )
}
