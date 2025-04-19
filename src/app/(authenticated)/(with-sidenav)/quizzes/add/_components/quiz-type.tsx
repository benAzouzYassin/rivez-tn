import { Button } from "@/components/ui/button"
import { useSidenav } from "@/providers/sidenav-provider"
import { useRouter } from "nextjs-toploader/app"
import { ReactNode } from "react"

type Props = {
    icon: ReactNode
    text: string
    description: string
    value: string
    disabled: boolean
}

export default function QuizType({
    icon,
    text,
    description,
    value,
    disabled,
}: Props) {
    const router = useRouter()
    const sideNav = useSidenav()

    return (
        <Button
            disabled={disabled}
            onClick={() => {
                if (sideNav.isSidenavOpen) {
                    sideNav.toggleSidenav()
                }
                router.push(`/quizzes/add/${value}`)
            }}
            variant={"secondary"}
            className="!p-3 h-56  flex  justify-start    disabled:opacity-80 disabled:bg-neutral-200/70 w-full max-h-fit text-start rounded-3xl  hover:border-blue-300 hover:bg-blue-100/70 hover:shadow-blue-300 transition-all  "
        >
            <div className=" items-start gap-4">
                <div className="flex flex-col  pb-4 items-center gap-2  ">
                    <div className=" min-h-10 min-w-10 flex items-center justify-center p-2 border-2  rounded-xl">
                        {icon}
                    </div>
                    <h3 className="text-xl  text-neutral-600  font-extrabold">
                        {text}{" "}
                        {disabled && (
                            <span className="text-base italic text-neutral-600">
                                (soon..)
                            </span>
                        )}
                    </h3>
                </div>
                <p className="    text-medium text-base md:px-8  text-center  text-wrap text-neutral-500">
                    {description}
                </p>
            </div>
        </Button>
    )
}
