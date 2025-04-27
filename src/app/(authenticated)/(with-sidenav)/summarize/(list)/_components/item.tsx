"use client"

import { Card, CardHeader } from "@/components/ui/card"
import { useIsAdmin } from "@/hooks/use-is-admin"
import { cn } from "@/lib/ui-utils"
import { formatDate } from "@/utils/date"
import { getLanguage } from "@/utils/get-language"
import { FileTextIcon, ImageIcon, User2, VideoIcon } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"
import { useMemo } from "react"
import { ItemType } from "../page"
import MoreButton from "./more-button"

interface Props {
    item: ItemType
}

export default function Item({ item }: Props) {
    const router = useRouter()
    const isUserAdmin = useIsAdmin()

    const translation = useMemo(
        () => ({
            en: {
                "Created the": "Created the",
            },
            fr: {
                "Created the": "Créé le",
            },
            ar: {
                "Created the": "تم الإنشاء في",
            },
        }),
        []
    )

    const lang = getLanguage()
    const t = translation[lang]
    const isRtl = lang === "ar"

    return (
        <Card
            onClick={(e) => {
                router.push(`/summarize/${item.id}`)
            }}
            className={
                "relative grow cursor-pointer hover:bg-neutral-100 hover:scale-101 active:scale-100 transition-all items-start justify-center h-[300px] flex rounded-3xl flex-col"
            }
        >
            <div
                className={cn(
                    `h-48 min-h-48 w-full hover:cursor-pointer transition-all relative bg-gray-100 overflow-hidden`
                )}
            >
                {item.source === "pdf" && (
                    <FileTextIcon className="w-12 absolute top-20 -translate-x-1/2 left-1/2 h-12 text-blue-300" />
                )}
                {item.source === "image" && (
                    <ImageIcon className="w-12 absolute top-20 -translate-x-1/2 left-1/2 h-12 text-blue-300" />
                )}

                {item.source === "youtube" && (
                    <VideoIcon className="w-12 absolute top-20 -translate-x-1/2 left-1/2 h-12 text-blue-300" />
                )}
            </div>

            <div className="flex flex-col border-t-2 w-full">
                <CardHeader className="-mt-3">
                    <MoreButton
                        authorId={item.user_id}
                        itemId={item.id}
                        className={cn(
                            "scale-90 absolute",
                            isRtl ? "left-3" : "right-3"
                        )}
                    />
                    <div
                        className={cn("flex justify-between items-start", {
                            "pb-4": isUserAdmin,
                        })}
                    >
                        <div className={cn("", { "text-right": isRtl })}>
                            <div className="text-sm font-medium">
                                <h2
                                    className={cn(
                                        "text-2xl max-w-[95%]  pb-1 line-clamp-1 first-letter:uppercase text-neutral-600 font-extrabold",
                                        {
                                            "rtl:text-right": isRtl,
                                        }
                                    )}
                                >
                                    {item.name}
                                </h2>
                                {isUserAdmin && (
                                    <div
                                        className={cn(
                                            "flex items-center gap-2 font-semibold",
                                            {
                                                "-ml-2": !isRtl,
                                                "-mr-2": isRtl,
                                                "flex-row-reverse": isRtl,
                                            }
                                        )}
                                    >
                                        <div className="w-9 h-9 border relative border-neutral-200 flex items-center justify-center rounded-full bg-neutral-100">
                                            {item?.user_id?.avatar_url ? (
                                                <img
                                                    className="absolute w-full h-full object-cover object-center rounded-full"
                                                    alt=""
                                                    src={
                                                        item?.user_id
                                                            ?.avatar_url
                                                    }
                                                />
                                            ) : (
                                                <User2 className="w-5 h-5 text-gray-500" />
                                            )}
                                        </div>
                                        <p className="max-w-[200px] text-base truncate">
                                            {" "}
                                            {item?.user_id?.username}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div
                                className={cn("text-sm mt-2 font-medium", {
                                    "text-right": isRtl,
                                })}
                            >
                                {t["Created the"]}:{" "}
                                {formatDate(item.created_at)}
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </div>
        </Card>
    )
}
