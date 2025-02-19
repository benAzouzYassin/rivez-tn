import { AlertTriangle, Info, Loader2 } from "lucide-react"
import toast from "react-hot-toast"

export function toastSuccess(message?: string) {
    return toast.success(message || "Success", {
        duration: 2000,
        id: "success",
        className: "font-bold",
    })
}

export function toastWarning(message?: string) {
    return toast(message || "Warning", {
        duration: 2000,
        id: "warning",
        icon: <AlertTriangle className="w-7 h-7 text-amber-500 stroke-[2.5]" />,
        className: "font-bold",
    })
}

export function toastError(message?: string) {
    return toast.error(message || "Error", {
        duration: 2000,
        id: "error",
        className: "font-bold",
    })
}

export function toastLoading(message?: string) {
    return toast(message || "Loading...", {
        duration: Infinity,
        id: "loading",
        icon: (
            <Loader2 className="w-5 h-5 duration-300 text-neutral-500 animate-spin " />
        ),
        className: "font-bold",
    })
}

export function toastInfo(message?: string) {
    return toast(message || "Info", {
        duration: 2000,
        id: "info",
        icon: <Info className="w-7 h-7 text-blue-500 stroke-[2.5]" />,
        className: "font-bold",
    })
}

export function dismissToasts(
    id: "loading" | "success" | "error" | "warning" | "info"
) {
    return toast.remove(id)
}
