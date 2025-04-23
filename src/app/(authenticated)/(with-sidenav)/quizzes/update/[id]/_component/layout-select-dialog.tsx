import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/ui-utils"
import { ReactNode, useState } from "react"
import FillInTheBlank from "./layouts-icons/fill-in-the-blank"
import MatchingPairs from "./layouts-icons/matching-pairs"
import MultipleChoiceHorizontal from "./layouts-icons/multiple-choice-horizontal"
import MultipleChoiceVertical from "./layouts-icons/multiple-choice-vertical"
import { getLanguage } from "@/utils/get-language"

type Props = {
    contentClassName?: string
    trigger: ReactNode
    onSelect: (layoutType: LayoutOptions) => void
}

export default function LayoutSelectDialog(props: Props) {
    const [isOpen, setIsOpen] = useState(false)
    const lang = getLanguage()
    const t = translation[lang]

    return (
        <Dialog onOpenChange={setIsOpen} open={isOpen}>
            <DialogTrigger asChild>{props.trigger}</DialogTrigger>
            <DialogContent
                className={cn(
                    " rounded-xl pb-6 px-2 !min-w-[900px] overflow-x-hidden border w-[900px]  max-w-[900px] ",
                    props.contentClassName
                )}
            >
                <div className="p-4 bg-muted">
                    <DialogTitle className="text-center  pb-3 text-neutral-500 font-extrabold text-3xl">
                        {t["Select a question layout"]}
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </div>
                <div className="p-0 min-w-[900px] ">
                    <div className="p-0 grid gap-y-8 gap-x-0 grid-cols-2">
                        <div className="fle flex-col items-center justify-center">
                            <h3 className="text-base font-bold text-neutral-500 text-center ">
                                {t["Image on left, options on right"]}
                            </h3>
                            <div
                                onClick={() => {
                                    setIsOpen(false)
                                    props.onSelect("horizontal-multiple-choice")
                                }}
                                className="ml-auto mt-1 flex items-center justify-center"
                            >
                                <MultipleChoiceHorizontal
                                    imageClassName="h-[140px] w-[130px] ml-2 mt-6"
                                    itemClassName="h-7 mt-1 first:mt-5 w-[110px]"
                                    className="!w-[290px] h-[210px]"
                                />
                            </div>
                        </div>
                        <div
                            className="flex flex-col items-center justify-center"
                            onClick={() => {
                                setIsOpen(false)
                                props.onSelect("vertical-multiple-choice")
                            }}
                        >
                            <h3 className="text-base font-bold text-neutral-500 text-center ">
                                {t["Image on the top, options on bottom"]}
                            </h3>

                            <MultipleChoiceVertical
                                textClassName="hidden"
                                imageClassName="h-20 w-[90%] mx-auto mt-4"
                                itemClassName="h-7 mt-1 w-[85%] odd:ml-4 even:ml-1"
                                className="!w-[310px] h-[210px]"
                            />
                        </div>
                        <div
                            className="flex flex-col items-center justify-center"
                            onClick={() => {
                                setIsOpen(false)
                                props.onSelect("matching-pairs")
                            }}
                        >
                            <h3 className="text-base font-bold text-neutral-500 text-center ">
                                {t["Terms on left, definitions on right"]}
                            </h3>

                            <MatchingPairs
                                itemClassName="h-6 mt-1"
                                className="!w-[290px] pt-4 px-5 h-[210px]"
                            />
                        </div>
                        <div
                            className="flex flex-col items-center justify-center"
                            onClick={() => {
                                setIsOpen(false)
                                props.onSelect("multiple-choice-without-image")
                            }}
                        >
                            <h3 className="text-base font-bold text-neutral-500 text-center ">
                                {t["Options without an image."]}
                            </h3>

                            <MultipleChoiceVertical
                                textClassName="mb-7 mt-8"
                                imageClassName="hidden"
                                itemClassName="h-8  mt-1 w-[85%] odd:ml-4 even:ml-1"
                                className="!w-[310px] h-[210px]"
                            />
                        </div>
                        {/* <div
                            className="flex flex-col items-center justify-center"
                            onClick={() => {
                                setIsOpen(false)
                                props.onSelect("fill-in-the-blank")
                            }}
                        >
                            <h3 className="text-base font-bold text-neutral-500 text-center ">
                                {t["Fill in the blank."]}
                            </h3>

                            <FillInTheBlank
                                isMinimized={false}
                                questionTextClassName="mb-7 mt-8"
                                className="!w-[310px] h-[210px]"
                            />
                        </div> */}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
type LayoutOptions =
    | "vertical-multiple-choice"
    | "horizontal-multiple-choice"
    | "matching-pairs"
    | "multiple-choice-without-image"
    | "fill-in-the-blank"

const translation = {
    en: {
        "Select a question layout": "Select a question layout",
        "Image on left, options on right": "Image on left, options on right",
        "Image on the top, options on bottom":
            "Image on the top, options on bottom",
        "Terms on left, definitions on right":
            "Terms on left, definitions on right",
        "Options without an image.": "Options without an image.",
        "Fill in the blank.": "Fill in the blank.",
    },
    ar: {
        "Select a question layout": "اختر تصميم السؤال",
        "Image on left, options on right":
            "الصورة على اليسار، الخيارات على اليمين",
        "Image on the top, options on bottom":
            "الصورة في الأعلى، الخيارات في الأسفل",
        "Terms on left, definitions on right":
            "المصطلحات على اليسار، التعاريف على اليمين",
        "Options without an image.": "خيارات بدون صورة.",
        "Fill in the blank.": "املأ الفراغ.",
    },
    fr: {
        "Select a question layout": "Sélectionner une mise en page de question",
        "Image on left, options on right": "Image à gauche, options à droite",
        "Image on the top, options on bottom": "Image en haut, options en bas",
        "Terms on left, definitions on right":
            "Termes à gauche, définitions à droite",
        "Options without an image.": "Options sans image.",
        "Fill in the blank.": "Remplir le blanc.",
    },
}
