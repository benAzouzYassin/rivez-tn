import type { Metadata } from "next"
import "./globals.css"
import { Nunito } from "next/font/google"
import NextTopLoader from "nextjs-toploader"
import { Toaster } from "sonner"
import QueryClientProvider from "@/providers/query-client"
const nunito = Nunito({
    weight: ["300", "400", "500", "600", "700", "800", "900", "1000"],
})
export const metadata: Metadata = {
    title: "Fikr",
    description: "",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={`${nunito.className} antialiased`}>
                <Toaster
                    visibleToasts={5}
                    expand
                    richColors
                    className={`${nunito.className}`}
                />
                <NextTopLoader
                    color="#1CB0F6"
                    initialPosition={0.08}
                    crawlSpeed={200}
                    height={6}
                    crawl={true}
                    showSpinner={true}
                    easing="ease"
                    speed={200}
                    shadow="0 0 10px #1CB0F6,0 0 5px #1CB0F6"
                    template='<div class="bar" role="bar"><div class="peg"></div></div>
                      <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
                    zIndex={1600}
                    showAtBottom={false}
                />
                <QueryClientProvider>{children}</QueryClientProvider>
            </body>
        </html>
    )
}
