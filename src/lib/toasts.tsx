import { Check, Info, LoaderCircleIcon, TriangleAlert, X } from "lucide-react"
import { toast } from "sonner"
import { cn } from "./ui-utils"

export function toastSuccess(
    message?: string,
    opts?: {
        title?: string
        className?: string
    }
) {
    const defaultTitle = "Success"
    return toast.custom(
        () => (
            <div
                className={cn(
                    `flex items-center min-w-[350px] gap-3 px-4 py-3 w-full 
      bg-green-100/60 border-green-300 border   rounded-lg shadow-sm 
      animate-in fade-in-0 duration-300 `,
                    opts?.className
                )}
            >
                <div className="flex items-center justify-center  w-5 h-5 bg-green-500/60 rounded-full">
                    <Check className="w-3  h-3 stroke-4 text-white" />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-extrabold text-green-700">
                        {opts?.title || defaultTitle}
                    </span>
                    <span className="text-xs font-semibold text-green-700 ">
                        {message}
                    </span>
                </div>
            </div>
        ),
        {
            duration: 2000,
            id: "success",
        }
    )
}
export function toastWarning(
    message?: string,
    opts?: {
        title?: string
        className?: string
    }
) {
    const defaultTitle = "Warning"
    return toast.custom(
        () => (
            <div
                className={cn(
                    `flex items-center min-w-[350px] gap-3 px-4 py-3 w-full 
          bg-yellow-100/30 border-yellow-300 border   rounded-lg shadow-sm 
          animate-in fade-in-0 duration-300 `,
                    opts?.className
                )}
            >
                <div className="flex items-center justify-center  w-5 h-5 bg-yellow-500/60 rounded-full">
                    <TriangleAlert className="w-3  h-3 stroke-4 text-white" />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-extrabold text-yellow-700">
                        {opts?.title || defaultTitle}
                    </span>
                    <span className="text-xs font-semibold text-yellow-700 ">
                        {message}
                    </span>
                </div>
            </div>
        ),
        {
            duration: 2000,
            id: "warning",
        }
    )
}
export function toastError(
    message?: string,
    opts?: {
        title?: string
        className?: string
    }
) {
    const defaultTitle = "Error"
    return toast.custom(
        () => (
            <div
                className={cn(
                    `flex items-center min-w-[350px] gap-3 px-4 py-3 w-full 
          bg-red-100/60 border-red-300 border   rounded-lg shadow-sm 
          animate-in fade-in-0 duration-300 `,
                    opts?.className
                )}
            >
                <div className="flex items-center justify-center  w-5 h-5 bg-red-500/60 rounded-full">
                    <X className="w-3  h-3 stroke-4 text-white" />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-extrabold text-red-700">
                        {opts?.title || defaultTitle}
                    </span>
                    <span className="text-xs font-semibold text-red-700 ">
                        {message}
                    </span>
                </div>
            </div>
        ),
        {
            duration: 2000,
            id: "error",
        }
    )
}
export function toastLoading(
    message?: string,
    opts?: {
        title?: string
        className?: string
    }
) {
    const defaultTitle = "Processing..."
    return toast.custom(
        () => (
            <div
                className={cn(
                    `flex items-center min-w-[350px] gap-3 px-4 py-3 w-full 
          bg-blue-100/40 border-blue-300 border   rounded-lg shadow-sm 
          animate-in fade-in-0 duration-300 `,
                    opts?.className
                )}
            >
                <div className="flex items-center justify-center scale-90 rounded-full">
                    <LoaderCircleIcon className=" duration-500  animate-spin   w-5 h-5 text-blue-600 " />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-extrabold text-blue-700">
                        {opts?.title || defaultTitle}
                    </span>
                    <span className="text-xs font-semibold text-blue-700 ">
                        {message}
                    </span>
                </div>
            </div>
        ),
        {
            duration: Infinity,
            id: "loading",
        }
    )
}
export function toastInfo(
    message?: string,
    opts?: {
        title?: string
        className?: string
    }
) {
    const defaultTitle = "Information"
    return toast.custom(
        () => (
            <div
                className={cn(
                    `flex items-center min-w-[350px] gap-3 px-4 py-3 w-full 
          bg-neutral-100/40 border-neutral-300 border   rounded-lg shadow-sm 
          animate-in fade-in-0 duration-300 `,
                    opts?.className
                )}
            >
                <div className="flex items-center justify-center scale-90 rounded-full">
                    <Info className=" duration-500    w-5 h-5 text-neutral-600 " />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-extrabold text-neutral-700">
                        {opts?.title || defaultTitle}
                    </span>
                    <span className="text-xs font-semibold text-neutral-700 ">
                        {message}
                    </span>
                </div>
            </div>
        ),
        {
            duration: 2000,
            id: "info",
        }
    )
}
export function dismissToasts(
    id: "loading" | "success" | "error" | "warning" | "info"
) {
    return toast.dismiss(id)
}
