import AnimatedLoader from "@/components/ui/animated-loader"

export default function Loading() {
    return (
        <div className="flex min-h-[50vh] items-center justify-center">
            <AnimatedLoader />
        </div>
    )
}
