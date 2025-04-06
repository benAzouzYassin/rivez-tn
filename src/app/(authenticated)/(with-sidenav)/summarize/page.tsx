"use client"
import { FileTextIcon, ImageIcon, Link, Video } from "lucide-react"
import Item from "./_components/item"
import YoutubeLinkDialog from "./_components/youtube-link-dialog"
import { useMemo, useState } from "react"
export default function Page() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const items = useMemo(
        () =>
            [
                {
                    disabled: false,
                    route: "/pdf-summarizer",
                    text: "PDF Document Upload",
                    icon: (
                        <FileTextIcon className="!w-7 !h-7 text-indigo-500" />
                    ),
                    description: "Upload PDF files to generate summaries.",
                },

                {
                    disabled: false,
                    route: "/image-summarizer",
                    text: "From Images",
                    icon: <ImageIcon className="!w-7 text-indigo-500 !h-7" />,
                    description:
                        "Upload images containing text, diagrams, or visual information to create summaries.",
                },
                {
                    disabled: false,
                    onClick: () => setIsDialogOpen(true),
                    text: "YouTube Video",
                    icon: <Video className="!w-7 text-indigo-500 !h-7" />,
                    description:
                        "Transform any YouTube video into a comprehensive summarized summary by providing a URL.",
                },
            ] as const,
        []
    )
    return (
        <main className="flex relative flex-col items-center w-full min-h-screen p-6 bg-white">
            <section className="grid grid-cols-1 sm:grid-cols-2 max-w-[1100px] gap-x-4 gap-y-5 mt-20 ">
                {items.map((item) => (
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
