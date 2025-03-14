"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import ActionButtons from "./_components/action-buttons"
import Content from "./_components/content"
import Header from "./_components/header"
import { useRouter } from "nextjs-toploader/app"

export default function Page() {
    const router = useRouter()
    return (
        <section className="flex relative items-center pb-20 justify-center ">
            <section className="w-[50rem]">
                <Button
                    onClick={router.back}
                    variant={"secondary"}
                    className="w-fit gap-1 absolute items-center flex  top-4 left-8 text-neutral-500   px-6 text-base h-12"
                >
                    <ChevronLeft className="stroke-3 !w-5 !h-5" />
                    Back
                </Button>
                <Header />
                <Content />
                <ActionButtons />
            </section>
        </section>
    )
}
