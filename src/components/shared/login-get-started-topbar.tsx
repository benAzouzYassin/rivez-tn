import { cn } from "@/lib/ui-utils"
import { HTMLAttributes } from "react"
import { Button } from "../ui/button"
import Link from "next/link"

type Props = {} & HTMLAttributes<HTMLDivElement>
export default function LoginGetStartedTopBar({ className, ...props }: Props) {
    return (
        <header
            {...props}
            className={cn(
                "bg-[#1CB0F6] flex items-center px-40  h-20",
                className
            )}
        >
            <Button
                asChild
                className="font-bold  text-[#1CB0F6] mt-1 shadow-[#0B3E71]/20 px-5 ml-auto  h-[44px]"
                variant={"secondary"}
            >
                <Link href={"/auth/login"}>LOGIN</Link>
            </Button>
            <Button
                asChild
                className="font-semibold ml-4  h-[44px] "
                variant={"green"}
            >
                <Link href={"/auth/register"}>GET STARTED</Link>
            </Button>
        </header>
    )
}
