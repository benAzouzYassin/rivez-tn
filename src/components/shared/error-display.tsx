import { ArrowRightCircleIcon } from "lucide-react"
import { Button } from "../ui/button"
import { useRouter } from "nextjs-toploader/app"

interface ErrorDisplayProps {
    message?: string
    onRetry?: () => void
    title?: string
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
    message = "An error has accured",
    onRetry = () => window.location.reload(),
}) => {
    const router = useRouter()
    return (
        <div
            role="alert"
            aria-live="assertive"
            className="w-full flex items-center justify-center p-4"
        >
            <div className="text-center p-8 w-[50vw] h-[50vh] rounded-2xl  animate-fadeIn">
                <div className="relative">
                    <svg
                        className="mx-auto h-44 w-44 text-red-400 animate-pulse"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>
                <h3 className="mt-4 text-4xl font-semibold text-red-400">
                    {message}
                </h3>
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        variant={"red"}
                        className="text-white bg-red-500/90 shadow-red-600/70 border-red-600/70"
                        onClick={onRetry}
                        type="button"
                    >
                        <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                        Retry
                    </Button>

                    <Button
                        className="text-red-500 shadow-red-200 border-red-200"
                        onClick={() => router.back()}
                        variant={"secondary"}
                        type="button"
                    >
                        <ArrowRightCircleIcon />
                        Back
                    </Button>
                </div>
            </div>
        </div>
    )
}
