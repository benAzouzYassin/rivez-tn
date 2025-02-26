import { Button } from "@/components/ui/button"
import { useRouter } from "nextjs-toploader/app"
import { ReactNode } from "react"

type Props = {
    icon: ReactNode
    text: string
    description: string
    value: string
}

export default function QuizType({ icon, text, description, value }: Props) {
    const router = useRouter()
    return (
        <Button
            onClick={() => router.push(`/admin/quizzes/add/generate/${value}`)}
            variant={"secondary"}
            className="!p-3 h-full flex items-center justify-start  w-full max-h-fit text-start rounded-xl hover:border-blue-300 hover:bg-blue-100/70 hover:shadow-blue-300 transition-all  "
        >
            <div className="flex items-start gap-4">
                <div className=" min-h-16 min-w-16 flex items-center justify-center p-2 border-2 border-blue-200 rounded-lg">
                    {icon}
                </div>
                <div className="">
                    <h3 className="text-xl text-neutral-600 mt-1 font-extrabold">
                        {text}
                    </h3>
                    <p className="text-sm mt-[2px] text-medium  text-wrap text-neutral-500">
                        {description}
                    </p>
                </div>
            </div>
        </Button>
    )
}
