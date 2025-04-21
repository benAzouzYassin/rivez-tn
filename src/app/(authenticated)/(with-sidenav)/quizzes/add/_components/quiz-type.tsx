import CreditIcon from "@/components/icons/credit-icon"
import InsufficientCreditsDialog from "@/components/shared/insufficient-credits-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useSidenav } from "@/providers/sidenav-provider"
import { useRouter } from "nextjs-toploader/app"
import { ReactNode, useState } from "react"

type Props = {
    icon: ReactNode
    text: string
    description: string
    value: string
    disabled: boolean
    price: number
}

export default function QuizType({
    icon,
    text,
    description,
    value,
    disabled,
    price,
}: Props) {
    const [isInsufficientCredits, setIsInsufficientCredits] = useState(false)
    const { data: user } = useCurrentUser()
    const creditBalance = user?.credit_balance?.toFixed(1)
    const router = useRouter()
    const sideNav = useSidenav()

    return (
        <>
            <Button
                disabled={disabled}
                onClick={() => {
                    if (Number(creditBalance) < price) {
                        return setIsInsufficientCredits(true)
                    }
                    if (sideNav.isSidenavOpen) {
                        sideNav.toggleSidenav()
                    }
                    router.push(`/quizzes/add/${value}`)
                }}
                variant={"secondary"}
                className="!p-3 h-56 md:last:col-span-2  flex  last:justify-center justify-center    disabled:opacity-80 disabled:bg-neutral-200/70 w-full max-h-fit text-start rounded-3xl  hover:border-blue-300 hover:bg-blue-100/70 hover:shadow-blue-300 transition-all  "
            >
                <div className=" items-start gap-4">
                    <div className="flex flex-col  pb-4 items-center gap-2  ">
                        <div className=" min-h-10 min-w-10 flex items-center justify-center p-2 border-2  rounded-xl">
                            {icon}
                        </div>
                        <div className="text-xl  text-neutral-600  font-extrabold">
                            {text}{" "}
                            <Badge
                                variant={"blue"}
                                className=" py-0 px-2 font-bold inline-flex gap-[3px] ml-1 !text-lg"
                            >
                                {price} <CreditIcon className="!w-5 !h-5" />
                            </Badge>
                            {disabled && (
                                <span className="text-base italic text-neutral-600">
                                    (soon..)
                                </span>
                            )}
                        </div>
                    </div>
                    <p className="    text-medium text-base md:px-8  text-center  text-wrap text-neutral-500">
                        {description}
                    </p>
                </div>
            </Button>
            <InsufficientCreditsDialog
                isOpen={isInsufficientCredits}
                onOpenChange={setIsInsufficientCredits}
            />
        </>
    )
}
