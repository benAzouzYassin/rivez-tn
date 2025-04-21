"use client"
import { highPrice, lowPrice, mediumPrice } from "@/constants/prices"
import { FileTextIcon, ImageIcon, Video } from "lucide-react"
import { useMemo, useState } from "react"
import Item from "./_components/item"
import YoutubeLinkDialog from "./_components/youtube-link-dialog"
import { useIsSmallScreen } from "@/hooks/is-small-screen"
export default function Page() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const isSmallScreen = useIsSmallScreen()
    const items = useMemo(
        () =>
            [
                {
                    price: lowPrice / 5,
                    isPerPage: true,
                    disabled: isSmallScreen,
                    route: "/pdf-summarizer",
                    text: "PDF Document Upload",
                    icon: (
                        <FileTextIcon className="!w-7 !h-7 text-indigo-500" />
                    ),
                    description: "Upload PDF files to generate summaries.",
                },

                {
                    price: mediumPrice,
                    disabled: false,
                    route: "/image-summarizer",
                    text: "From Images",
                    icon: <ImageIcon className="!w-7 text-indigo-500 !h-7" />,
                    description:
                        "Upload images containing text, diagrams, or visual information to create summaries.",
                },
                {
                    price: highPrice,
                    disabled: false,
                    onClick: () => setIsDialogOpen(true),
                    text: "YouTube Video",
                    icon: <Video className="!w-7 text-indigo-500 !h-7" />,
                    description:
                        "Transform any YouTube video into a comprehensive summarized summary by providing a URL.",
                },
            ] as const,
        [isSmallScreen]
    )
    return (
        <main className="flex relative flex-col items-center w-full min-h-screen md:p-6 bg-white">
            <div className="max-w-3xl w-full text-center">
                <h1 className="md:text-4xl text-3xl font-extrabold text-neutral-700  pt-6">
                    Summarize something
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                    Choose a method to create your summary quickly and easily.
                </p>
            </div>

            <section className="grid  md:px-0 px-3  grid-cols-1 sm:grid-cols-2 max-w-[850px] pb-10 gap-x-10 gap-y-7 mt-10 ">
                {items
                    .filter((item) => !item.disabled)
                    .map((item) => (
                        <Item key={item.text} {...item} />
                    ))}
            </section>
            <YoutubeLinkDialog
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
            />
        </main>
    )
}
