import ProgressBar from "@/components/shared/progress-bar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/ui-utils"
import Link from "next/link"
import XpIcon from "../icons/xp"
import { useCurrentUser } from "@/hooks/use-current-user"
interface Props {
    fixed?: boolean
}
export default function FloatingSection(props: Props) {
    const { data: userData } = useCurrentUser()
    return (
        <section className="  col-span-4  py-4 pr-4 pl-5 ">
            <div className={cn({ " fixed top-30 pr-4": props.fixed })}>
                <div className="border-neutral-200 flex flex-col min-h-[25.5rem] gap-4  border py-5 px-3 rounded-3xl">
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
                                XP Points :
                            </p>
                        </div>
                        <div className="flex items-center text-2xl font-black text-[#f5b237] gap-1">
                            {userData?.xp_points || 0}
                            <div className="w-8 h-8  -mt-px rounded-xl">
                                <XpIcon className="w-7 h-7" />
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    )
}
interface Props {
    className?: string
}
function FreeCredits(props: Props) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
            <path
                d="m8 4v3"
                fill="none"
                stroke="#4c241d"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
            <path
                d="m8 11v3"
                fill="none"
                stroke="#4c241d"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
            <path
                d="m6 9h-3"
                fill="none"
                stroke="#4c241d"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
            <path
                d="m13 9h-3"
                fill="none"
                stroke="#4c241d"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
            <circle cx="40.5" cy="25.5" fill="#ffe5d2" r="21.5" />
            <circle
                cx="47.5"
                cy="4.5"
                fill="none"
                r="2.5"
                stroke="#4c241d"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
            <circle cx="56.5" cy="44.5" fill="#4c241d" r="1.132" />
            <circle cx="59.5" cy="54.5" fill="#4c241d" r="1.132" />
            <circle cx="49.5" cy="55.5" fill="#4c241d" r="1.132" />
            <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                <path
                    d="m58.837 12.663-3.674 3.674"
                    fill="none"
                    stroke="#4c241d"
                />
                <path
                    d="m55.163 12.663 3.674 3.674"
                    fill="none"
                    stroke="#4c241d"
                />
                <circle
                    cx="32"
                    cy="33"
                    fill="#ffce56"
                    r="23"
                    stroke="#4c241d"
                />
                <path
                    d="m19.551 20a18 18 0 1 0 24.9 0"
                    fill="none"
                    stroke="#fc8c29"
                />
                <path d="m35 17v5" fill="none" stroke="#4c241d" />
                <path d="m24 17h4l-4 4h8" fill="none" stroke="#4c241d" />
                <path d="m32 23v-7h6v6" fill="none" stroke="#4c241d" />
                <path d="m40 19h-8" fill="none" stroke="#4c241d" />
                <path d="m26 14v2" fill="none" stroke="#4c241d" />
                <path d="m28 21v2" fill="none" stroke="#4c241d" />
                <path
                    d="m26.613 26.076 4.982 1.78a1.211 1.211 0 0 0 .81 0l4.982-1.78a1.2 1.2 0 0 1 1.537 1.537l-1.78 4.987a1.211 1.211 0 0 0 0 .81l1.78 4.982a1.2 1.2 0 0 1 -1.537 1.537l-4.982-1.78a1.211 1.211 0 0 0 -.81 0l-4.982 1.78a1.2 1.2 0 0 1 -1.537-1.537l1.78-4.982a1.211 1.211 0 0 0 0-.81l-1.78-4.982a1.2 1.2 0 0 1 1.537-1.542z"
                    fill="#fff"
                    stroke="#4c241d"
                />
                <circle
                    cx="14"
                    cy="50"
                    fill="#ffce56"
                    r="12"
                    stroke="#4c241d"
                />
                <circle cx="14" cy="50" fill="none" r="9" stroke="#fc8c29" />
            </g>
        </svg>
    )
}
