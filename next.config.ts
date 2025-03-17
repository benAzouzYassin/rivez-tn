import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    // webpack: (config) => {
    //     config.resolve.alias = {
    //         ...config.resolve.alias,
    //         canvas: false,
    //         encoding: false,
    //     }
    //     return config
    // },
    images: {
        remotePatterns: [
            {
                hostname: "127.0.0.1",
            },
        ],
    },
}

export default nextConfig
