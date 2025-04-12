import { Button } from "@/components/ui/button"
import { useSidenav } from "@/providers/sidenav-provider"
import { useRouter } from "nextjs-toploader/app"
import { ReactNode } from "react"

type Props = {
    icon: ReactNode
    text: string
    description: string
    route?: string
    disabled: boolean
    onClick?: () => void
}

export default function Item({
    icon,
    text,
    description,
    route,
    disabled,
    onClick,
}: Props) {
    const router = useRouter()

    return (
        <Button
            disabled={disabled}
            onClick={() => {
                if (route) {
                    router.push(route)
                } else if (onClick) {
                    onClick()
                }
            }}
            variant={"secondary"}
            className="!p-3 h-56 min-h-56 flex   disabled:opacity-80 disabled:bg-neutral-200/70 w-full  text-start  hover:border-blue-300 hover:bg-blue-100/70 hover:shadow-blue-300 transition-all rounded-3xl  "
        >
            <div className=" items-start gap-4 flex justify-center flex-col">
                <div className=" min-h-10 min-w-10 w-fit flex items-center mx-auto justify-center p-2 border-2  rounded-xl">
                    {icon}
                </div>
                <div className="flex flex-col justify-center items-center   mx-auto ">
                    <h3 className="text-xl  text-neutral-600  font-extrabold">
                        {text}{" "}
                        {disabled && (
                            <span className="text-base italic text-neutral-600">
                                (soon..)
                            </span>
                        )}
                    </h3>
                    <p className=" text-center px-7 text-medium text-base  text-wrap text-neutral-500">
                        {description}
                    </p>
                </div>
            </div>
        </Button>
    )
}
