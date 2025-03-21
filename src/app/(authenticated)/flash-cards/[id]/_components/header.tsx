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
        <div className="  mt-6">
            <div className="border-2 p-4  min-h-28  rounded-3xl">
                <div className="flex relative mt-3 items-center ">
                    <div className="min-w-24 absolute -top-3 right-1 font-semibold text-base pl-1 flex items-center justify-center">
                        <span className="text-nowrap  font-bold text-neutral-600/80">
                            {" "}
                            100 / 500
                        </span>
                    </div>
                    <div className="grow flex pt-3 items-center gap-3">
                        <ProgressBar percentage={50} />
                    </div>
                </div>
                <div className="h-8 pl-2 flex items-center  gap-2 mt-3">
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
