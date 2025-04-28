import AnimatedLoader from "@/components/ui/animated-loader"

export default function Loading() {
    return (
        <div className="flex dark:bg-neutral-900 min-h-[100vh] items-center justify-center">
            <AnimatedLoader />
        </div>
    )
}
