export default function ShareDialogSkeleton() {
    return (
        <>
            <div className="flex items-center mt-4 space-x-2">
                <div className="flex-1 flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-100">
                    <div className="w-full p-3 h-14">
                        <div className="h-7 bg-gray-200 animate-pulse rounded-md w-full"></div>
                    </div>
                </div>
                <div className="p-3 h-14 w-14 rounded-lg border-2 border-gray-200 flex items-center justify-center">
                    <div className="h-5 w-5 bg-gray-200 animate-pulse rounded-md"></div>
                </div>
            </div>

            <div className="mt-2 text-center">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-white px-4 text-gray-200">
                            <div className="h-4 w-32 bg-gray-200 animate-pulse rounded-md"></div>
                        </span>
                    </div>
                </div>
            </div>

            <div className="-mt-2 flex justify-center">
                <div className="flex gap-8">
                    {[1, 2, 3].map((index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div className="p-3 rounded-full bg-gray-100">
                                <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-full"></div>
                            </div>
                            <div className="mt-2 h-4 w-16 bg-gray-200 animate-pulse rounded-md"></div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
