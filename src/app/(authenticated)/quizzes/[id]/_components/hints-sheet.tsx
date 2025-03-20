import GeneralLoadingScreen from "@/components/shared/general-loading-screen"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { readQuizQuestionHints } from "@/data-access/quizzes/read"
import { cn } from "@/lib/ui-utils"
import { useQuery } from "@tanstack/react-query"
import { ChevronLeft, Lightbulb } from "lucide-react"
import dynamic from "next/dynamic"
import { useMemo, useState } from "react"
const RichTextEditor = dynamic(
    () => import("@/components/shared/rich-text-editor"),
    {
        ssr: false,
    }
)
interface Props {
    questionId: number
}
export default function HintsSheet(props: Props) {
    const [selectedId, setSelectedId] = useState<number | null>(null)
    const [isOpen, setIsOpen] = useState(false)
    const { isFetching, data } = useQuery({
        enabled: isOpen,
        queryKey: ["questions_hints", "quizzes_questions", props.questionId],
        queryFn: () => readQuizQuestionHints({ questionId: props.questionId }),
    })
    const selectedHint = useMemo(
        () => data?.find((item) => item.id === selectedId),
        [selectedId, data]
    )
    return (
        <Sheet
            open={isOpen}
            onOpenChange={(val) => {
                setIsOpen(val)
                if (!val) {
                    setSelectedId(null)
                }
            }}
        >
            <SheetTrigger asChild>
                <button className="h-10 text-center hover:bg-blue-50 cursor-pointer active:scale-95 transition-all  text-blue-600/80 font-bold text-lg flex items-center justify-center fixed rounded-l-xl border-blue-500/70 top-44 border-r-0 right-0 w-20 gap-px border-2">
                    <Lightbulb className="w-6 h-6" />
                    Hint
                </button>
            </SheetTrigger>
            <SheetContent
                className={cn("transition-all p-5", {
                    "w-96 min-w-[70vw]": selectedId,
                })}
            >
                <SheetTitle></SheetTitle>
                <SheetDescription></SheetDescription>
                {!!selectedId && (
                    <Button
                        onClick={() => setSelectedId(null)}
                        variant={"secondary"}
                        className="w-fit min-h-[44px] absolute top-2"
                    >
                        <ChevronLeft className="stroke-3" />
                        Back
                    </Button>
                )}
                {isFetching && <GeneralLoadingScreen text={null} />}
                {!selectedId && (
                    <>
                        <h1 className="text-4xl mb-10 text-neutral-600 font-extrabold">
                            Question Hints
                        </h1>
                        {data?.map((hint) => {
                            return (
                                <Card
                                    onClick={() => {
                                        setSelectedId(hint.id)
                                    }}
                                    key={hint.id}
                                    className={`relative min-h-16 active:scale-95 flex rounded-2xl hover:bg-blue-100/70 pl-1 hover:border-blue-300 hover:shadow-blue-300 hover:pl-2 transition-all cursor-pointer  overflow-hidden`}
                                >
                                    <CardContent className="px-2   rounded-xl h-fit my-auto pb-0 !flex justify-center items-center gap-3">
                                        <Lightbulb className="!w-7 stroke-3 !h-7 text-amber-400 mt-0.5 flex-shrink-0" />
                                        <p className="text-lg grow text-neutral-600 max-w-[90%] font-bold">
                                            {hint.name}
                                        </p>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </>
                )}
                {!!selectedHint && (
                    <ScrollArea className="bg-white mt-5 px-4 ">
                        <RichTextEditor
                            contentClassName="!min-h-full pb-10 pt-6 h-full"
                            containerClassName="h-full "
                            readonly
                            initialContent={selectedHint?.content || ""}
                        />
                    </ScrollArea>
                )}
            </SheetContent>
        </Sheet>
    )
}
