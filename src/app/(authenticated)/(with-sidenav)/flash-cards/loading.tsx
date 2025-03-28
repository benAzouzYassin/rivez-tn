import AnimatedLoader from "@/components/ui/animated-loader"

export default function Loading() {
    return (
        <div className="w-full h-[90vh] flex items-center justify-center">
            <AnimatedLoader />
        </div>
    )
}
