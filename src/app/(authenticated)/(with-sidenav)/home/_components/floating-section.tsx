import Link from "next/link"
import ProgressBar from "@/components/shared/progress-bar"
import FreeCredits from "../_icons/free-credits"
import { Button } from "@/components/ui/button"
import XpIcon from "@/components/icons/xp"
import YellowStar from "@/components/icons/yellow-star"
import Star from "@/components/icons/star"
export default function FloatingSection() {
    return (
        <section className=" col-span-4  py-4 pr-4 pl-5 ">
            <div className="border-neutral-200 flex flex-col gap-4 border py-5 px-3 rounded-3xl">
                <Link
                    href={"#"}
                    className=" hover:bg-neutral-100 active:scale-95 transition-all flex gap-5 border-2 px-4 py-3 rounded-2xl justify-between "
                >
                    <div className="grow">
                        <p className="text-xl font-extrabold  text-neutral-500">
                            React course
                        </p>
                        <ProgressBar percentage={40} className="mt-2" />
                    </div>
                    <div className="bg-neutral-300 w-14  h-14   rounded-xl"></div>
                </Link>
                <div
                    onClick={() => {
                        // TODO open invite friend dialog
                    }}
                    className="  transition-all  gap-5 border-2 px-4 py-3 rounded-2xl justify-between "
                >
                    <div className="flex">
                        <div className="grow">
                            <p className="text-xl font-extrabold  text-neutral-500">
                                Get free credits
                            </p>
                            <p className="mt-1 font-semibold text-neutral-500">
                                Invite your friends and get{" "}
                                <span className="text-blue-500 font-extrabold">
                                    100 free credit !
                                </span>{" "}
                            </p>
                        </div>
                        <div className="  min-w-14 h-full  rounded-xl">
                            <FreeCredits />
                        </div>
                    </div>
                    <Button
                        onClick={() => {
                            // TODO open invite friend dialog
                        }}
                        variant={"blue"}
                        className="h-9 mt-3 mb-2 w-full font-extrabold rounded-xl px-3"
                    >
                        Invite friend
                    </Button>
                </div>
                <Link
                    href={"#"}
                    className=" hover:bg-neutral-100 active:scale-95 transition-all flex gap-5 border-2 px-4 items-center py-3 rounded-2xl justify-between "
                >
                    <div className="grow">
                        <p className="text-xl font-extrabold  text-neutral-500">
                            Stars earned :
                        </p>
                    </div>
                    <div className="flex items-center text-2xl font-extrabold text-[#F5CB37] gap-1">
                        10
                        <div className="w-8 h-8  -mt-px rounded-xl">
                            <Star className="w-7 h-7" />
                        </div>
                    </div>
                </Link>
            </div>
        </section>
    )
}
