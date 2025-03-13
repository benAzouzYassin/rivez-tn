import { cn } from "@/lib/ui-utils"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { Strike } from "@tiptap/extension-strike"
import { Underline } from "@tiptap/extension-underline"
import { Color } from "@tiptap/extension-color"
import { TextStyle } from "@tiptap/extension-text-style"
import { TextAlign } from "@tiptap/extension-text-align"
import { Image } from "@tiptap/extension-image"
import { Link } from "@tiptap/extension-link"
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
import { memo } from "react"
import CodeBlockComponent from "./code-block"
import "./styles.css"
import Toolbar from "./toolbar"

// Create a lowlight instance with specific languages
const lowlight = createLowlight()
lowlight.register("html", html)
lowlight.register("css", css)
lowlight.register("js", js)
lowlight.register("ts", ts)

interface Props {
    className?: string
    onChange?: (content: JSONContent) => void
    initialContent?: string
}

function RichTextEditor(props: Props) {
    const editor = useEditor({
        immediatelyRender: true,

        extensions: [
            StarterKit.configure({
                // Disable the default code block to use our custom one
                codeBlock: false,
            }),
            Underline,
            Strike,
            Image,
            ImageResize,
            TextAlign.configure({
                types: ["heading", "paragraph"],
                alignments: ["left", "right", "center"],
            }),
            Color,
            TextStyle,
            Link.configure({
                openOnClick: false,
                autolink: true,
                defaultProtocol: "https",
                protocols: ["http", "https"],
                isAllowedUri: (url, ctx) => {
                    try {
                        // construct URL
                        const parsedUrl = url.includes(":")
                            ? new URL(url)
                            : new URL(`${ctx.defaultProtocol}://${url}`)

                        // use default validation
                        if (!ctx.defaultValidate(parsedUrl.href)) {
                            return false
                        }

                        // disallowed protocols
                        const disallowedProtocols = ["ftp", "file", "mailto"]
                        const protocol = parsedUrl.protocol.replace(":", "")

                        if (disallowedProtocols.includes(protocol)) {
                            return false
                        }

                        // only allow protocols specified in ctx.protocols
                        const allowedProtocols = ctx.protocols.map((p) =>
                            typeof p === "string" ? p : p.scheme
                        )

                        if (!allowedProtocols.includes(protocol)) {
                            return false
                        }

                        // disallowed domains
                        const disallowedDomains = [
                            "example-phishing.com",
                            "malicious-site.net",
                        ]
                        const domain = parsedUrl.hostname

                        if (disallowedDomains.includes(domain)) {
                            return false
                        }

                        // all checks have passed
                        return true
                    } catch {
                        return false
                    }
                },
                shouldAutoLink: (url) => {
                    try {
                        // construct URL
                        const parsedUrl = url.includes(":")
                            ? new URL(url)
                            : new URL(`https://${url}`)

                        // only auto-link if the domain is not in the disallowed list
                        const disallowedDomains = [
                            "example-no-autolink.com",
                            "another-no-autolink.com",
                        ]
                        const domain = parsedUrl.hostname

                        return !disallowedDomains.includes(domain)
                    } catch {
                        return false
                    }
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
                    "min-h-[10rem] border-x-2 border-b-2 rounded-b-lg w-full border-t focus:pl-3 focus:shadow-sm p-2 outline-none transition-all"
                ),
            },
        },
    })

    return (
        <div className={props.className}>
            <Toolbar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}

export default memo(RichTextEditor)
