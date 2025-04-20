import AnimatedLoader from "@/components/ui/animated-loader"

export default function Loading() {
    return (
        <div className="flex min-h-[100vh] items-center justify-center">
            <AnimatedLoader />
        </div>
    )
}
