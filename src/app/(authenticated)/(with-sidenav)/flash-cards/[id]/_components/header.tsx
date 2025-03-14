import ProgressBar from "@/components/shared/progress-bar"
import { Badge } from "@/components/ui/badge"
import {
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    SkipForwardIcon,
    Sparkles,
} from "lucide-react"
export default function Header() {
    return (
        <div className="  mt-8">
            <div className="border-2 p-4  min-h-32  rounded-3xl">
                <div className="flex relative mt-3 items-center ">
                    <div className="min-w-24 absolute -top-3 right-12 font-semibold text-base pl-1 flex items-center justify-center">
                        <span className="text-nowrap  font-bold text-neutral-600/80">
                            {" "}
                            100 / 500
                        </span>
                    </div>
                    <div className="grow flex items-center gap-3">
                        <button className="min-w-10 flex items-center justify-center h-10 rounded-full border-2 active:scale-95 transition-all hover:bg-neutral-100 hover:cursor-pointer">
                            <ChevronLeft className="!w-6 stroke-3 text-neutral-500 !h-6" />
                        </button>
                        <ProgressBar percentage={50} />
                        <button className="min-w-10 flex items-center justify-center h-10 rounded-full border-2 active:scale-95 transition-all hover:bg-neutral-100 hover:cursor-pointer">
                            <ChevronRight className="!w-6 stroke-3 text-neutral-500 !h-6" />
                        </button>
                    </div>
                </div>
                <div className="h-10 pl-12 flex items-center  gap-2 mt-1">
                    <div className="flex  items-center gap-1 ">
                        <Badge
                            className=" px-3  rounded-full py-[2px]   text-base !font-bold"
                            variant={"blue"}
                        >
                            0 Knew
                            <CheckCircle className="w-5 h-5  ml-2  text-blue-500" />
                        </Badge>
                    </div>
                    <div className="flex  items-center gap-1 ">
                        <Badge
                            className=" px-3 rounded-full py-[2px]  text-base !font-bold"
                            variant={"green"}
                        >
                            0 Learnt
                            <Sparkles className=" ml-2 w-5 h-5  text-green-500" />
                        </Badge>
                    </div>
                    <div className="flex  items-center gap-1 ">
                        <Badge
                            className=" px-3 rounded-full py-[2px]  text-base !font-bold text-red-400"
                            variant={"red"}
                        >
                            0 Skipped
                            <SkipForwardIcon className=" ml-2 -mt-px w-5 h-5 text-red-400" />
                        </Badge>
                    </div>
                </div>
            </div>
        </div>
    )
}
