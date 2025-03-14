"use client"
import Answer from "./_components/answer"
import Aside from "./_components/aside"
import Buttons from "./_components/buttons"
import Question from "./_components/question"

export default function Page() {
    return (
        <section className="flex relative pb-20 ">
            <Buttons className="absolute top-12 right-8" />
            <Aside items={fakeSideItems} selectedId="2" />
            <section className="grow flex pr-5 pt-20 flex-col items-center justify-center min-h-[90vh] ">
                <Question />
                <Answer />
            </section>
        </section>
    )
}

const fakeSideItems = [
    {
        name: "1",
        localId: "1",
    },
    {
        name: "2",
        localId: "2",
    },
    {
        name: "3",
        localId: "3",
    },
    {
        name: "4",
        localId: "4",
    },
    {
        name: "5",
        localId: "5",
    },
    {
        name: "6",
        localId: "6",
    },
    {
        name: "7",
        localId: "7",
    },
    {
        name: "8",
        localId: "8",
    },
]
