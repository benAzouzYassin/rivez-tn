import { cn } from "@/lib/ui-utils"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { Strike } from "@tiptap/extension-strike"
import { Underline } from "@tiptap/extension-underline"
import { Color } from "@tiptap/extension-color"
import { TextStyle } from "@tiptap/extension-text-style"
import { TextAlign } from "@tiptap/extension-text-align"
import { Link } from "@tiptap/extension-link"
import { Placeholder } from "@tiptap/extension-placeholder"
import Table from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import { ImageResize } from "tiptap-extension-resize-image"

import {
    EditorContent,
    JSONContent,
    ReactNodeViewRenderer,
    useEditor,
} from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import css from "highlight.js/lib/languages/css"
import js from "highlight.js/lib/languages/javascript"
import ts from "highlight.js/lib/languages/typescript"
import html from "highlight.js/lib/languages/xml"
import { createLowlight } from "lowlight"
import { memo, useEffect } from "react"
import CodeBlockComponent from "./code-block"
import "./styles.css"
import Toolbar from "./toolbar"

const lowlight = createLowlight()
lowlight.register("html", html)
lowlight.register("css", css)
lowlight.register("js", js)
lowlight.register("ts", ts)

interface Props {
    containerClassName?: string
    contentClassName?: string
    onChange?: (content: JSONContent) => void
    initialContent?: string
    placeholder?: string
}

function RichTextEditor(props: Props) {
    const editor = useEditor({
        immediatelyRender: true,

        extensions: [
            StarterKit.configure({
                codeBlock: false,
            }),
            Underline,
            Strike,
            ImageResize,
            Placeholder.configure({
                placeholder: props.placeholder,
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
                alignments: ["left", "right", "center"],
            }),
            Color,
            TextStyle,
            Table.configure({
                resizable: true,
                allowTableNodeSelection: true,
            }),
            TableRow,
            TableCell,
            TableHeader,
            Link.configure({
                openOnClick: false,
                autolink: true,
                defaultProtocol: "https",
                protocols: ["http", "https"],
                isAllowedUri: (url, ctx) => {
                    try {
                        const parsedUrl = url.includes(":")
                            ? new URL(url)
                            : new URL(`${ctx.defaultProtocol}://${url}`)

                        if (!ctx.defaultValidate(parsedUrl.href)) {
                            return false
                        }

                        const disallowedProtocols = ["ftp", "file", "mailto"]
                        const protocol = parsedUrl.protocol.replace(":", "")

                        if (disallowedProtocols.includes(protocol)) {
                            return false
                        }

                        const allowedProtocols = ctx.protocols.map((p) =>
                            typeof p === "string" ? p : p.scheme
                        )

                        if (!allowedProtocols.includes(protocol)) {
                            return false
                        }

                        return true
                    } catch {
                        return false
                    }
                },
                shouldAutoLink: (url) => {
                    return true
                },
            }),
            CodeBlockLowlight.extend({
                addNodeView() {
                    return ReactNodeViewRenderer(
                        ({ updateAttributes, extension, node }) => (
                            <CodeBlockComponent
                                extension={extension}
                                node={{
                                    attrs: {
                                        language: node.attrs.language || "TS",
                                    },
                                }}
                                updateAttributes={updateAttributes}
                            />
                        )
                    )
                },
            }).configure({ lowlight }),
        ],
        content: props.initialContent || "",
        onUpdate: ({ editor }) => {
            props.onChange?.(editor.getJSON())
        },
        editorProps: {
            attributes: {
                class: cn(
                    "min-h-[10rem] h-full overflow-y-auto border-x-2 border-b-2 rounded-b-lg w-full border-t focus:pl-[1.5rem] focus:shadow-sm p-5 outline-none transition-all",
                    props.contentClassName
                ),
            },
        },
    })

    useEffect(() => {
        if (editor !== null && props.placeholder !== "") {
            editor.view.dispatch(editor.state.tr)
        }
    }, [editor, props.placeholder])

    return (
        <div className={props.containerClassName}>
            <Toolbar editor={editor} />
            <EditorContent className={props.contentClassName} editor={editor} />
        </div>
    )
}

export default memo(RichTextEditor)
