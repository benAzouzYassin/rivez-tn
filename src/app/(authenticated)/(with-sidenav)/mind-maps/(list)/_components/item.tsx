import { Card, CardHeader } from "@/components/ui/card"
import { formatDate } from "@/utils/date"
import { MapIcon } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"
import { ItemType } from "../page"
import MoreButton from "./more-button"

interface Props {
    item: ItemType
}

export default function Item({ item }: Props) {
    const router = useRouter()
    return (
        <Card
            onClick={() => {
                router.push(`/mind-maps/${item.id}`)
            }}
            className={
                "relative  grow cursor-pointer hover:bg-neutral-50  active:scale-104 hover:scale-105     transition-all items-start justify-center h-[300px]  flex rounded-3xl  flex-col"
            }
        >
            <div
                className={`h-48 min-h-48 hover:cursor-pointer  transition-all relative bg-gray-100  overflow-hidden`}
            >
                {item.image ? (
                    <img
                        src={item.image}
                        alt={""}
                        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 object-center w-[90%] object-contain h-[90%]"
                    />
                ) : (
                    <MapIcon className="w-12  absolute top-20 -translate-x-1/2 left-1/2 h-12 text-neutral-300" />
                )}
            </div>

            <div className="flex flex-col  border-t-2 w-full">
                <CardHeader className="-mt-3">
                    <MoreButton
                        authorId={item.author_id}
                        status={item.publishing_status}
                        itemId={item.id}
                        className="scale-90 absolute right-3"
                    />
                    <div className="flex  justify-between items-start">
                        <div className="">
                            <h2 className="text-2xl pb-1 line-clamp-1 first-letter:uppercase text-neutral-600 font-extrabold">
                                {item.name}
                            </h2>
                            <p className="text-sm font-medium">
                                Created the : {formatDate(item.created_at)}
                            </p>
                        </div>
                    </div>
                </CardHeader>
            </div>
        </Card>
    )
}
