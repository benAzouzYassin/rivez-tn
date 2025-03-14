"use client"

import ActionButtons from "./_components/action-buttons"
import Content from "./_components/content"
import Header from "./_components/header"

export default function Page() {
    return (
        <section className="flex items-center pb-20 justify-center ">
            <section className="w-[50rem]">
                <Header />
                <Content />
                <ActionButtons />
            </section>
        </section>
    )
}
