import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "127.0.0.1",
            },
        ],
    },
}

export default nextConfig
