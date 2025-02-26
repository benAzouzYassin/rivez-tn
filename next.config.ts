import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    target: "serverless",
    future: { webpack5: true },
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        config.resolve.alias.canvas = false
        config.resolve.alias.encoding = false
        return config
    },
    images: {
        remotePatterns: [
            {
                hostname: "127.0.0.1",
            },
        ],
    },
}

export default nextConfig
