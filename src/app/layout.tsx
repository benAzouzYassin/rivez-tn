import type { Metadata } from "next"
import "./globals.css"
import { Nunito } from "next/font/google"
import NextTopLoader from "nextjs-toploader"
import { Toaster } from "react-hot-toast"
import QueryClientProvider from "@/providers/query-client"
import { SidenavProvider } from "@/providers/sidenav-provider"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { cookies } from "next/headers"
import { headers } from "next/headers"
import { getPreferredLanguage } from "@/utils/languages"

const nunito = Nunito({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800", "900", "1000"],
})
export const metadata: Metadata = {
    title: "Fikr",
    description: "",
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const reqHeaders = await headers()
    const preferred = getPreferredLanguage(
        reqHeaders.get("accept-language") as string
    )
    const lang = (await cookies()).get("selected-language")?.value || preferred

    return (
        <html
            dir={lang === "ar" ? "rtl" : "ltr"}
            lang={lang}
            className=" overflow-x-hidden"
        >
            <head>
                {/* <script src="https://unpkg.com/react-scan/dist/auto.global.js"></script> */}
            </head>
            <body
                className={`${nunito.className} overflow-y-auto overflow-x-hidden antialiased  min-w-screen`}
            >
                <Toaster />
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
                <QueryClientProvider>
                    <SidenavProvider>
                        <NuqsAdapter>{children}</NuqsAdapter>
                    </SidenavProvider>
                </QueryClientProvider>
            </body>
        </html>
    )
}
