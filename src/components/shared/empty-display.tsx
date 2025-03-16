import { Button } from "@/components/ui/button"
import { ReactNode } from "react"

interface Props {
    icon: ReactNode
    title: string
    onClick?: () => void
    description: string
    buttonText?: string
}
export default function EmptyDisplay(props: Props) {
    return (
        <div className="flex flex-col pt-10 items-center justify-center  text-center">
            <div className="bg-indigo-50 rounded-full p-5 mb-6">
                {props.icon}
            </div>
            <h3 className="text-2xl font-bold text-neutral-700 mb-2">
                {props.title}
            </h3>
            <p className="text-neutral-500 max-w-md mb-8">
                {props.description}
            </p>
            {!!props.onClick && (
                <Button
                    variant="blue"
                    className="-mt-4"
                    onClick={props.onClick}
                >
                    {props.buttonText}
                </Button>
            )}
        </div>
    )
}
