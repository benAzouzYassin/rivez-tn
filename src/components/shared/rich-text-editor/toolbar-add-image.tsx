import AddImageDialog from "@/components/shared/add-image-dialog/add-image-dialog"
import { Editor } from "@tiptap/react"
import { ReactNode } from "react"
interface Props {
    isOpen: boolean
    setIsOpen: (value: boolean) => void
    children: ReactNode
    asChild?: boolean
    editor: Editor
}
export default function ToolBarImage(props: Props) {
    return (
        <>
            {props.children}
            <AddImageDialog
                disabledOptions={["code-snippets"]}
                isOpen={props.isOpen}
                onImageSave={(url) => {
                    if (url) {
                        console.log("image url ==>", url)
                        props.editor
                            .chain()
                            .focus()
                            .setImage({
                                src: url,
                            })
                            .run()
                    }
                }}
                onOpenChange={props.setIsOpen}
            />
        </>
    )
}
