import { Check } from "lucide-react"
import PaymentMethodDialog from "./_components/payment-method-dialog"
import { CREDITS_FOR_10_DINARS } from "@/app/api/buy-credits/generate-payment-link/constants"

export default function Page() {
    return (
        <section className="flex min-h-[90vh]   flex-col">
            <section className="flex pb-32 mt-16 font-sans items-center justify-center">
                <div className="md:grid flex flex-col-reverse  w-[1000px] gap-8 px-2 md:h-[600px] md:grid-cols-2">
                    <div className="border  bg-[#f3f3f3] px-4 md:px-5 py-8 rounded-3xl">
                        <h2 className="text-neutral-600 text-xl font-medium">
                            Trial
                        </h2>
                        <p className="text-4xl font-extrabold mt-3 text-neutral-600">
                            {" "}
                            Free
                        </p>
                        <p className="mt-3 pl-1 text-lg text-neutral-600">
                            Limited access
                        </p>
                        <button className="h-20 rounded-2xl  bg-neutral-400 w-full text-center text-[1.7rem] font-bold text-neutral-100">
                            Current Plan
                        </button>
                        <p className="mt-2 pl-1 pb-3 text-lg text-gray-400">
                            Basic access to interactive learning and skill
                            development tools...
                        </p>
                        <div className="flex mt-6 items-center gap-2">
                            <div className="w-6 text-neutral-50 p-1 h-6 bg-neutral-400/80 scale-90 rounded-full flex items-center justify-center ">
                                <Check className="stroke-3" />
                            </div>
                            <p className=" text-neutral-700">
                                Unlimited custom quizzes.
                            </p>
                        </div>
                        <div className="flex mt-6 items-center gap-2">
                            <div className="w-6 text-neutral-50 p-1 h-6 bg-neutral-400/80 scale-90 rounded-full flex items-center justify-center ">
                                <Check className="stroke-3" />
                            </div>
                            <p className=" text-neutral-700">
                                Unlimited custom quizzes.
                            </p>
                        </div>
                        <div className="flex mt-6 items-center gap-2">
                            <div className="w-6 text-neutral-50 p-1 h-6 bg-neutral-400/80 scale-90 rounded-full flex items-center justify-center ">
                                <Check className="stroke-3" />
                            </div>
                            <p className=" text-neutral-700">
                                Limited Ai features
                            </p>
                        </div>
                        <div className="flex mt-6 items-center gap-2">
                            <div className="w-6 text-neutral-50 p-1 h-6 bg-neutral-400/80 scale-90 rounded-full flex items-center justify-center ">
                                <Check className="stroke-3" />
                            </div>
                            <p className=" text-neutral-700">
                                Supports: Text and PDFs
                            </p>
                        </div>
                    </div>
                    <div className="border  bg-[#3a7ef4] px-4 md:px-5 py-8 rounded-3xl">
                        <h2 className="text-white text-xl font-medium">
                            Premium
                        </h2>
                        <p className="text-4xl font-extrabold mt-3 text-white">
                            {" "}
                            10 Dinars
                        </p>
                        <p className="mt-3 pl-1 text-lg text-neutral-100">
                            Pay as you go{" "}
                        </p>
                        <PaymentMethodDialog>
                            <button className="h-20 hover:scale-105 active:scale-100 transition-all cursor-pointer rounded-2xl   hover:bg-[#FFDF46] w-full text-center text-[1.7rem] font-bold text-neutral-700 bg-[#ffcb46]">
                                10 TND for {CREDITS_FOR_10_DINARS} credits
                            </button>
                        </PaymentMethodDialog>
                        <p className="mt-2 pb-3 pl-1 text-lg font-bold  text-gray-50">
                            All features from the trial plan plus :
                        </p>
                        <div className="flex mt-6 items-center gap-2">
                            <div className="w-6 text-neutral-700 p-1 h-6 bg-amber-400 scale-90 rounded-full flex items-center justify-center ">
                                <Check className="stroke-[4]" />
                            </div>
                            <p className=" text-neutral-50 font-medium">
                                Access to AI Quiz Generation
                            </p>
                        </div>
                        <div className="flex mt-6 items-center gap-2">
                            <div className="w-6 text-neutral-700 p-1 h-6 bg-amber-400 scale-90 rounded-full flex items-center justify-center ">
                                <Check className="stroke-[4]" />
                            </div>
                            <p className=" text-neutral-50 font-medium">
                                Access to AI Mind map generation
                            </p>
                        </div>
                        <div className="flex mt-6 items-center gap-2">
                            <div className="w-6 text-neutral-700 p-1 h-6 bg-amber-400 scale-90 rounded-full flex items-center justify-center ">
                                <Check className="stroke-[4]" />
                            </div>
                            <p className=" text-neutral-50 font-medium">
                                Access to AI content summarizer .
                            </p>
                        </div>
                        <div className="flex mt-6 items-center gap-2">
                            <div className="w-6 text-neutral-700 p-1 h-6 bg-amber-400 scale-90 rounded-full flex items-center justify-center ">
                                <Check className="stroke-[4]" />
                            </div>
                            <p className=" text-neutral-50 font-medium">
                                Supports: Text, Images, PDFs and youtube videos.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </section>
    )
}
