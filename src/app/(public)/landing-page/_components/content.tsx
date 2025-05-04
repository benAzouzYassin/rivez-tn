"use client"
import Link from "next/link"
import Nav from "./nav"
import { motion } from "framer-motion"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useRouter } from "nextjs-toploader/app"
import { Translation } from "../translations/english"
import { useEffect } from "react"
import Cookies from "js-cookie"

interface Props {
    translation: Translation
    shouldSaveLang: boolean
    currentLang: string
}
function Content({ translation, shouldSaveLang, currentLang }: Props) {
    const router = useRouter()
    const currentUser = useCurrentUser()
    const isAuthenticated = currentUser.data?.id

    useEffect(() => {
        if (shouldSaveLang) {
            Cookies.set("selected-language", currentLang)
        }
    }, [shouldSaveLang, currentLang])
    if (isAuthenticated) {
        router.replace("/home")
    }
    return (
        <section className="dark:bg-neutral-900">
            <section className="h-auto overflow-hidden relative">
                <Nav translation={translation} defaultLang={currentLang} />
                {/* hero */}
                <div
                    id="home"
                    className="xl:grid z-50 md:pt-10 pt-8 xl:grid-cols-2 max-w-[1700px] mx-auto"
                >
                    <div className="xl:pl-20 rtl:xl:pr-20 rtl:xl:pl-0 xl:pt-20">
                        <motion.p
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.25,
                            }}
                            className="text-[#8459DF] dark:text-[#a78df1] text-2xl max-[1650px]:text-[1.5rem] max-[1300px]:text-[1.2rem] max-[1250px]:text-center"
                        >
                            {translation["Rivez.tn for easier exam preparing"]}
                        </motion.p>
                        <motion.h1
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15, duration: 0.25 }}
                            className="xl:text-[4.5rem] lg:text-6xl md:text-5xl text-4xl xl:text-left rtl:xl:text-right text-center text-neutral-700 dark:text-neutral-100 xl:leading-20 mt-3 font-extrabold"
                        >
                            {translation["The best way for preparing to exams"]}
                        </motion.h1>
                        <motion.p
                            transition={{ delay: 0.3, duration: 0.25 }}
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[#33b7d1] dark:text-[#4dcce6] text-2xl mt-4 xl:block hidden max-[1650px]:text-[1.5rem] max-[1300px]:text-[1.2rem] max-[1250px]:text-center"
                        >
                            {translation["Let ai help you prepare for exams"]}
                        </motion.p>
                        <img
                            alt=""
                            className="z-10 lg:hidden block mt-8 translate-x-5 mx-auto h-[220px]"
                            src="/hero-img.svg"
                        />
                        <motion.div
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.25 }}
                            className="md:flex grid grid-cols-2 xl:justify-start justify-center items-center gap-4 px-4 xl:px-0"
                        >
                            <Link
                                href={"/auth/login"}
                                className="bg-[#ffd118] dark:hover:text-white dark:hover:bg-yellow-400 items-center justify-center z-10 h-14 md:h-16 flex md:px-14 rounded-full text-neutral-700/95 dark:text-neutral-800 shadow-[#FFDC18] font-bold hover:text-white hover:cursor-pointer hover:scale-105 transition-all hover:bg-yellow-400/95 text-xl mt-10 active:scale-100"
                            >
                                {translation["Sign In"]}
                            </Link>
                            <Link
                                href={"/auth/register"}
                                className="bg-blue-400 dark:bg-blue-500 z-10 h-14 md:h-16 md:px-9 flex items-center md:w-auto w-full justify-center rounded-full shadow-blue-300 dark:shadow-blue-700/30 text-white font-bold hover:text-white/90 hover:cursor-pointer hover:scale-105 transition-all hover:bg-blue-400/95 dark:hover:bg-blue-500/90 text-xl mt-10 active:scale-100"
                            >
                                {translation["Get started"]}
                            </Link>
                        </motion.div>
                    </div>

                    <motion.img
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        alt=""
                        className="z-10 lg:block hidden mx-auto h-[550px]"
                        src="/hero-img.svg"
                    />
                    <div className="h-[90px] md:block hidden"></div>
                </div>
                <div className="h-10"></div>
                <svg
                    className="w-full absolute left-0 rtl:right-0 rtl:left-auto xl:block hidden z-40 max-w-[2200px] bottom-0 min-[1200px]:-bottom-28 min-[2200px]:hidden min-[1600px]:-bottom-32 min-[1800px]:-bottom-48"
                    viewBox="0 0 900 140"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M0 58L25 51.5C50 45 100 32 150 28.7C200 25.3 250 31.7 300 37.7C350 43.7 400 49.3 450 40.5C500 31.7 550 8.29999 600 11.3C650 14.3 700 43.7 750 46.2C800 48.7 850 24.3 875 12.2L900 0V140H875C850 140 800 140 750 140C700 140 650 140 600 140C550 140 500 140 450 140C400 140 350 140 300 140C250 140 200 140 150 140C100 140 50 140 25 140H0V58Z"
                        fill="#1d8effe7"
                        className="dark:fill-[#454a55]"
                    />
                </svg>
            </section>
            {/* other sections */}
            <section className="mx-auto px-2 sm:px-20 pb-10 border-[#1d8effe7] dark:border-blue-800 bg-[#FFF] dark:bg-neutral-900 overflow-hidden relative w-full">
                <svg
                    className="max-w-[2700px] w-screen md:block hidden absolute left-0 rtl:right-0 rtl:left-auto rotate-180 top-0 min-[1200px]:-top-36 min-[1600px]:-top-32 min-[1800px]:-top-48 z-40"
                    viewBox="0 0 900 140"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M0 58L25 51.5C50 45 100 32 150 28.7C200 25.3 250 31.7 300 37.7C350 43.7 400 49.3 450 40.5C500 31.7 550 8.29999 600 11.3C650 14.3 700 43.7 750 46.2C800 48.7 850 24.3 875 12.2L900 0V140H875C850 140 800 140 750 140C700 140 650 140 600 140C550 140 500 140 450 140C400 140 350 140 300 140C250 140 200 140 150 140C100 140 50 140 25 140H0V58Z"
                        fill="#1d8effe7"
                        className="dark:fill-[#454a55]"
                    />
                </svg>
                <div className="min-[2200px]"></div>
                <div
                    id="tools"
                    className="bg-white dark:bg-neutral-800 border-2 max-w-[2200px] mx-auto sm:px-5 py-6 gap-10 w-full grid md:grid-cols-2 grid-cols-1 xl:grid-cols-4 md:h-80 sm:mt-40 mt-3 rounded-[50px] shadow-[0px_5px_2px] border-neutral-200 dark:border-neutral-700 shadow-neutral-200 dark:shadow-neutral-900"
                >
                    <div className="h-full hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:border-neutral-200 dark:hover:border-neutral-600 border-transparent border-2 px-4 rounded-3xl">
                        <div className="h-24 w-24 mt-10 border dark:border-neutral-600 flex items-center justify-center rounded-2xl mx-auto">
                            <img
                                className="w-20 h-20 mb-3"
                                alt=""
                                src="/icons/quiz.png"
                            />
                        </div>
                        <p className="text-[#0C4888] dark:text-blue-300 mt-6 text-2xl font-bold text-center">
                            {translation["Quizzes"]}
                        </p>
                        <p className="text-[#0C4888] dark:text-blue-200 mt-1 font-normal text-center">
                            {
                                translation[
                                    "Convert your documents and lessons to interactive quizzes ."
                                ]
                            }
                        </p>
                    </div>
                    <div className="h-full relative hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:border-neutral-200 dark:hover:border-neutral-600 border-transparent border-2 px-4 rounded-3xl">
                        <div className="absolute md:block hidden top-1/2 -translate-y-1/2 w-[2px] h-3/5 -left-5 rtl:-right-5 rtl:left-auto bg-[#0C4888]/50 dark:bg-blue-400/50"></div>
                        <div className="absolute left-1/2 block md:hidden -translate-x-1/2 h-[2px] w-3/5 top-0 bg-[#0C4888]/50 dark:bg-blue-400/50"></div>

                        <div className="h-24 w-24 border dark:border-neutral-600 mt-10 flex items-center justify-center rounded-2xl mx-auto">
                            <img
                                className="w-20 h-20 mt-2"
                                alt=""
                                src="/icons/brain-storm.png"
                            />
                        </div>
                        <p className="text-[#0C4888] dark:text-blue-300 mt-6 text-2xl font-bold text-center">
                            {translation["Mindmaps"]}
                        </p>
                        <p className="text-[#0C4888] dark:text-blue-200 mt-1 font-normal text-center">
                            {
                                translation[
                                    "Create and generate mindmaps to simplify complex topics."
                                ]
                            }
                        </p>
                    </div>
                    <div className="h-full relative hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:border-neutral-200 dark:hover:border-neutral-600 border-transparent border-2 px-4 rounded-3xl hidden xl:block">
                        <div className="absolute top-1/2 -translate-y-1/2 w-[2px] h-3/5 -left-5 rtl:-right-5 rtl:left-auto bg-[#0C4888]/50 dark:bg-blue-400/50"></div>

                        <div className="h-24 w-24 mt-10 border dark:border-neutral-600 rounded-2xl mx-auto">
                            <img
                                className="w-20 h-20 ml-1 rtl:mr-1 rtl:ml-0"
                                alt=""
                                src="/icons/documentation.png"
                            />
                        </div>
                        <p className="text-[#0C4888] dark:text-blue-300 mt-6 text-2xl font-bold text-center">
                            {translation["Summarize lessons"]}
                        </p>
                        <p className="text-[#0C4888] dark:text-blue-200 mt-1 font-normal text-center">
                            {
                                translation[
                                    "Upload lessons and let the ai summarize them for you."
                                ]
                            }
                        </p>
                    </div>
                    <div className="h-full relative hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:border-neutral-200 dark:hover:border-neutral-600 border-transparent border-2 px-4 rounded-3xl hidden xl:block">
                        <div className="absolute top-1/2 -translate-y-1/2 w-[2px] h-3/5 -left-5 rtl:-right-5 rtl:left-auto bg-[#0C4888]/50 dark:bg-blue-400/50"></div>
                        <div className="h-24 w-24 border dark:border-neutral-600 flex items-center justify-center mt-10 rounded-2xl mx-auto">
                            <img
                                className="w-18 h-18 ml-1 rtl:mr-1 rtl:ml-0"
                                alt=""
                                src="/icons/giftbox.png"
                            />
                        </div>
                        <p className="text-[#0C4888] dark:text-blue-300 mt-6 text-2xl font-bold text-center">
                            {translation["Generous free tier"]}
                        </p>
                        <p className="text-[#0C4888] dark:text-blue-200 mt-1 font-normal text-center">
                            {
                                translation[
                                    "Once you signin for the first time you will get free 100 credits"
                                ]
                            }
                        </p>
                    </div>
                </div>
                <div className="bg-white dark:bg-neutral-800 max-w-[2200px] mx-auto px-5 py-6 gap-10 w-full xl:hidden grid grid-cols-1 md:grid-cols-2 md:h-80 mt-5 rounded-[50px] shadow-[0px_5px_10px] border-neutral-200 dark:border-neutral-700 shadow-neutral-200 dark:shadow-neutral-900 border">
                    <div className="h-full relative hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:border-neutral-200 dark:hover:border-neutral-600 border-transparent border-2 px-4 rounded-3xl">
                        <div className="h-24 w-24 mt-10 border dark:border-neutral-600 rounded-2xl mx-auto">
                            <img
                                className="w-20 h-20 ml-1 rtl:mr-1 rtl:ml-0"
                                alt=""
                                src="/icons/documentation.png"
                            />
                        </div>
                        <p className="text-[#0C4888] dark:text-blue-300 mt-6 text-2xl font-bold text-center">
                            {translation["Summarize lessons"]}
                        </p>
                        <p className="text-[#0C4888] dark:text-blue-200 mt-1 font-normal text-center">
                            {
                                translation[
                                    "Upload lessons and let the ai summarize them for you."
                                ]
                            }
                        </p>
                    </div>
                    <div className="h-full relative hover:bg-[#E6F9FF] dark:hover:bg-neutral-700 px-4 rounded-3xl">
                        <div className="absolute md:block hidden top-1/2 -translate-y-1/2 w-[2px] h-3/5 -left-5 rtl:-right-5 rtl:left-auto bg-[#0C4888]/50 dark:bg-blue-400/50"></div>
                        <div className="absolute md:hidden block left-1/2 -translate-x-1/2 h-[2px] w-3/5 -top-0 bg-[#0C4888]/50 dark:bg-blue-400/50"></div>
                        <div className="h-24 w-24 border dark:border-neutral-600 flex items-center justify-center mt-10 rounded-2xl mx-auto">
                            <img
                                className="w-18 h-18 ml-1 rtl:mr-1 rtl:ml-0"
                                alt=""
                                src="/icons/giftbox.png"
                            />
                        </div>
                        <p className="text-[#0C4888] dark:text-blue-300 mt-6 text-2xl font-bold text-center">
                            {translation["Generous free tier"]}
                        </p>
                        <p className="text-[#0C4888] dark:text-blue-200 mt-1 font-normal text-center">
                            {
                                translation[
                                    "Once you signin for the first time you will get free 100 credits"
                                ]
                            }
                        </p>
                    </div>
                </div>
            </section>
            <div className="md:h-20 h-2 bg-[#FFF] dark:bg-neutral-900"></div>
            <section
                id="about"
                className="mx-auto pb-10 bg-[#FFF] dark:bg-neutral-900 overflow-hidden relative w-full"
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
                    <div className="pt-0 xl:pl-20 rtl:xl:pr-20 rtl:xl:pl-0 lg:pt-5">
                        <h2 className="text-blue-500 dark:text-blue-400 text-3xl sm:text-5xl font-extrabold">
                            {translation["Who are we ?"]}
                        </h2>
                        <p className="text-xl sm:text-3xl mt-3 sm:mt-4 font-semibold text-neutral-800 dark:text-neutral-200">
                            {
                                translation[
                                    "Rivez.tn is an education platform that helps students with education"
                                ]
                            }
                        </p>
                        <p className="text-base sm:text-lg mt-3 sm:mt-4 text-neutral-800 dark:text-neutral-300">
                            {
                                translation[
                                    "We make preparing for school exams a breeze by giving you the ability to interact with your courses in a fun way. we give you tools that leverage ai to speed up the process of learning."
                                ]
                            }
                        </p>
                    </div>
                    <div className="w-full rounded-2xl flex items-center justify-center">
                        <div className="grid grid-cols-2 gap-4 sm:gap-5">
                            <div className="border dark:border-neutral-700 flex items-center text-neutral-600 dark:text-neutral-300 flex-col text-lg font-bold justify-center rounded-xl h-32 sm:h-44 shadow-neutral-200 dark:shadow-neutral-900 border-neutral-200 shadow-[0px_4px_8px] w-full sm:w-56 bg-white dark:bg-neutral-800 text-center px-2 sm:px-0">
                                <p>{translation["Generate Mindmaps"]}</p>
                            </div>
                            <div className="border dark:border-neutral-700 flex items-center text-neutral-600 dark:text-neutral-300 flex-col text-lg font-bold justify-center rounded-xl h-32 sm:h-44 shadow-neutral-200 dark:shadow-neutral-900 border-neutral-200 shadow-[0px_4px_8px] w-full sm:w-56 bg-white dark:bg-neutral-800 text-center px-2 sm:px-0">
                                <p>{translation["Generate Quizzes"]}</p>
                            </div>

                            <div className="border dark:border-neutral-700 flex items-center text-neutral-600 dark:text-neutral-300 flex-col text-lg font-bold justify-center rounded-xl h-32 sm:h-44 shadow-neutral-200 dark:shadow-neutral-900 border-neutral-200 shadow-[0px_4px_8px] w-full sm:w-56 bg-white dark:bg-neutral-800 text-center px-2 sm:px-0">
                                <p>{translation["Summarize Documents"]}</p>
                            </div>
                            <div className="border dark:border-neutral-700 flex items-center text-neutral-600 dark:text-neutral-300 flex-col text-lg font-bold justify-center rounded-xl h-32 sm:h-44 shadow-neutral-200 dark:shadow-neutral-900 border-neutral-200 shadow-[0px_4px_8px] w-full sm:w-56 bg-white dark:bg-neutral-800 text-center px-2 sm:px-0">
                                <p>{translation["Summarize Videos"]}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section
                id="contact"
                className="bg-[#FFF] dark:bg-neutral-900 md:py-5"
            >
                <div className="max-w-[2200px] mx-auto px-3 md:px-12 lg:px-20">
                    <div className="flex flex-col md:flex-row rtl:md:flex-row-reverse justify-between gap-8">
                        <div className="bg-white dark:bg-neutral-800 h-auto shadow-[0px_2px_10px] shadow-neutral-200 dark:shadow-neutral-900 border dark:border-neutral-700 rounded-2xl p-6 md:w-2/5 lg:w-1/3 flex flex-col items-start rtl:items-end justify-center">
                            <h2 className="text-neutral-600 dark:text-neutral-200 text-2xl lg:text-3xl font-extrabold">
                                {
                                    translation[
                                        "Start now and get 100 credit for free !"
                                    ]
                                }
                            </h2>
                            <Link
                                href={"/auth/register"}
                                className="bg-gradient-to-r flex items-center justify-center font-bold from-yellow-400 to-yellow-400 h-12 px-8 rounded-full shadow-sm shadow-amber-300/50 dark:shadow-amber-500/20 text-amber-950/90 dark:text-amber-950 hover:text-white hover:cursor-pointer hover:scale-105 transition-all hover:bg-amber-400/95 text-lg mt-6 active:scale-100"
                            >
                                {translation["Get started"]}
                            </Link>
                        </div>
                        <div className="bg-white dark:bg-neutral-800 grow pt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 shadow-[0px_2px_10px] shadow-neutral-200 dark:shadow-neutral-900 border dark:border-neutral-700 rounded-2xl p-6 items-start justify-center">
                            <div className="flex flex-col items-center">
                                <div className="text-[#1e1e1e] dark:text-neutral-200 gap-2 font-bold flex items-center mb-2">
                                    {/* <PhoneIcon /> */}
                                    {translation["Phone numbers :"]}
                                </div>
                                <p className="mt-2 text-[#1e1e1e]/80 dark:text-neutral-400">
                                    +216 28 348 622
                                </p>
                                <p className="mt-2 text-[#1e1e1e]/80 dark:text-neutral-400"></p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="text-[#1e1e1e] dark:text-neutral-200 gap-2 flex items-center font-bold mb-2">
                                    {/* <MapPinIcon /> */}
                                    {translation["Locations :"]}
                                </div>
                                <p className="mt-2 text-[#1e1e1e]/80 dark:text-neutral-400">
                                    Tunisia Nabeul Soliman 8020
                                </p>
                                <p className="mt-2 text-[#1e1e1e]/80 dark:text-neutral-400"></p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="text-[#1e1e1e] dark:text-neutral-200 gap-2 font-bold flex items-center mb-2">
                                    {translation["Contact us :"]}
                                </div>
                                <p className="mt-2 text-[#1e1e1e]/80 dark:text-neutral-400">
                                    yassinebenazouz123@gmail.com
                                </p>
                                <p className="mt-2 text-[#1e1e1e]/80 dark:text-neutral-400">
                                    yassine@benazouz.tn
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="text-center mt-10 py-4 border-t border-sky-100/50 dark:border-neutral-800">
                        <p className="text-[#1e1e1e]/70 dark:text-neutral-500 text-sm">
                            {translation["All rights reserved © 2025"]}
                        </p>
                    </div>
                </div>
            </section>
        </section>
    )
}

export default Content
