import CreditIcon from "@/components/icons/credit-icon"
import InsufficientCreditsDialog from "@/components/shared/insufficient-credits-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCurrentUser } from "@/hooks/use-current-user"
import { getLanguage } from "@/utils/get-language"
import { useRouter } from "nextjs-toploader/app"
import { ReactNode, useMemo, useState } from "react"

type Props = {
    icon: ReactNode
    text: string
    description: string
    route?: string
    disabled: boolean
    onClick?: () => void
    isPerPage?: boolean
    price: string | number
}

export default function Item({
    icon,
    text,
    description,
    route,
    disabled,
    onClick,
    price,
    isPerPage,
}: Props) {
    const translation = useMemo(
        () => ({
            en: { "per page": "per page" },
            fr: { "per page": "par page" },
            ar: { "per page": "لكل صفحة" },
        }),
        []
    )
    const lang = getLanguage()
    const t = translation[lang]
    const router = useRouter()
    const [isInsufficientCredits, setIsInsufficientCredits] = useState(false)
    const { data: user } = useCurrentUser()
    const creditBalance = user?.credit_balance?.toFixed(1)
    return (
        <>
            <Button
                disabled={disabled}
                onClick={() => {
                    if (!isPerPage && Number(creditBalance) < Number(price)) {
                        return setIsInsufficientCredits(true)
                    }
                    if (route) {
                        router.push(route)
                    } else if (onClick) {
                        onClick()
                    }
                }}
                variant={"secondary"}
                className="!p-3 h-64 dark:hover:bg-neutral-700/50 min-h-64 flex   disabled:opacity-80 disabled:bg-neutral-200/70 w-full  text-start  hover:border-blue-300 hover:bg-blue-100/70 hover:shadow-blue-300 transition-all rounded-3xl  "
            >
                <div className=" items-start gap-4 flex justify-center flex-col">
                    <div className=" min-h-10 min-w-10 w-fit flex items-center dark:border-neutral-600 mx-auto justify-center p-2 border-2  rounded-xl">
                        {icon}
                    </div>
                    <div className="flex flex-col justify-center items-center   mx-auto ">
                        <div className="text-xl  text-neutral-600  dark:text-neutral-200 font-extrabold">
                            <h3 className="text-center"> {text}</h3>{" "}
                            <div className="flex rtl:flex-row-reverse flex-row items-center justify-center">
                                <Badge
                                    variant={"blue"}
                                    className=" mx-auto  items-center justify-center !min-w-20 py-0 scale-80 px-2 font-bold inline-flex gap-[3px]  !text-lg"
                                >
                                    {price} <CreditIcon className="!w-5 !h-5" />{" "}
                                    {isPerPage && t["per page"]}
                                </Badge>
                            </div>
                            {disabled && (
                                <span className="text-base italic text-neutral-600">
                                    (soon..)
                                </span>
                            )}
                        </div>
                        <p className=" text-center px-7 pt-2 text-medium text-base rtl:font-normal  text-wrap dark:text-neutral-300 text-neutral-500">
                            {description}
                        </p>
                    </div>
                </div>
            </Button>

            <InsufficientCreditsDialog
                isOpen={isInsufficientCredits}
                onOpenChange={setIsInsufficientCredits}
            />
        </>
    )
}
