"use client"
import Link from "next/link"
import Nav from "./_components/nav"
import { motion } from "framer-motion"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useRouter } from "nextjs-toploader/app"

function Page() {
    const router = useRouter()
    const currentUser = useCurrentUser()
    const isAuthenticated = currentUser.data?.id
    if (isAuthenticated) {
        router.replace("/home")
    }
    return (
        <section className="bg-[#EEFBFC]">
            <section className="bg-[#EEFBFC] h-auto  overflow-hidden  relative ">
                <Nav />
                <div
                    id="home"
                    className="xl:grid   z-50 pt-10  xl:grid-cols-2 max-w-[1700px] mx-auto"
                >
                    <div className="xl:pl-20 xl:pt-20 ">
                        <img
                            alt=""
                            className="z-10 xl:hidden block -mt-20 mx-auto h-[280px]"
                            src="/hero-img.svg"
                        />
                        <motion.p
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.25,
                            }}
                            className="text-[#8459DF] text-2xl  max-[1650px]:text-[1.5rem] max-[1300px]:text-[1.2rem] max-[1250px]:text-center"
                        >
                            Rivez.tn for easier exam preparing
                        </motion.p>
                        <motion.h1
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15, duration: 0.25 }}
                            className="xl:text-[4rem] lg:text-6xl md:text-5xl text-4xl xl:text-left text-center text-neutral-700 xl:leading-20 mt-3 font-extrabold"
                        >
                            The best way for preparing for exams
                        </motion.h1>
                        <motion.p
                            transition={{ delay: 0.3, duration: 0.25 }}
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[#33b7d1] text-2xl mt-4 xl:block hidden max-[1650px]:text-[1.5rem] max-[1300px]:text-[1.2rem] max-[1250px]:text-center"
                        >
                            Let ai help you prepare for exams
                        </motion.p>
                        <motion.div
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.25 }}
                            className="flex xl:justify-start justify-center   items-center gap-4 px-4 xl:px-0"
                        >
                            <Link
                                href={"/auth/login"}
                                className="bg-amber-400  items-center justify-center z-10 h-14  md:h-16 md:flex hidden px-9 rounded-full  shadow-amber-300 text-white/95 shadow-[0px_3px_7px] font-bold hover:text-white hover:cursor-pointer hover:scale-105 transition-all hover:bg-amber-400/95 text-xl mt-10 active:scale-100 "
                            >
                                Sign In
                            </Link>
                            <Link
                                href={"/auth/register"}
                                className="bg-blue-400 z-10 h-14 md:h-16 px-9 flex items-center md:w-auto w-full justify-center rounded-full  shadow-blue-300 text-white shadow-[0px_3px_7px] font-bold hover:text-white/90 hover:cursor-pointer hover:scale-105 transition-all hover:bg-blue-400/95 text-xl mt-10 active:scale-100 "
                            >
                                Get started
                            </Link>
                        </motion.div>
                    </div>
                    <motion.img
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        alt=""
                        className="z-10 xl:block  hidden -mt-32 h-[700px]"
                        src="/hero-img.svg"
                    />
                </div>
                <div className="h-10"></div>
                <svg
                    className="w-full  absolute left-0 xl:block hidden   z-50 max-w-[2200px]  bottom-0 min-[1200px]:-bottom-36 min-[2200px]:hidden min-[1600px]:-bottom-32 min-[1800px]:-bottom-48"
                    viewBox="0 0 900 140"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M0 58L25 51.5C50 45 100 32 150 28.7C200 25.3 250 31.7 300 37.7C350 43.7 400 49.3 450 40.5C500 31.7 550 8.29999 600 11.3C650 14.3 700 43.7 750 46.2C800 48.7 850 24.3 875 12.2L900 0V140H875C850 140 800 140 750 140C700 140 650 140 600 140C550 140 500 140 450 140C400 140 350 140 300 140C250 140 200 140 150 140C100 140 50 140 25 140H0V58Z"
                        fill="#FFEAA0"
                    />
                </svg>
            </section>
            <section className="  mx-auto  px-2 sm:px-20 pb-10 bg-[#EEFBFC] overflow-hidden  relative  w-full">
                <svg
                    className="max-w-[2700px] w-screen md:block hidden  absolute left-0 rotate-180  top-0 min-[1200px]:-top-36  min-[1600px]:-top-32 min-[1800px]:-top-48     z-50 "
                    viewBox="0 0 900 140"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M0 58L25 51.5C50 45 100 32 150 28.7C200 25.3 250 31.7 300 37.7C350 43.7 400 49.3 450 40.5C500 31.7 550 8.29999 600 11.3C650 14.3 700 43.7 750 46.2C800 48.7 850 24.3 875 12.2L900 0V140H875C850 140 800 140 750 140C700 140 650 140 600 140C550 140 500 140 450 140C400 140 350 140 300 140C250 140 200 140 150 140C100 140 50 140 25 140H0V58Z"
                        fill="#FFEAA0"
                    />
                </svg>
                <div className="min-[2200px]"></div>
                <div
                    id="tools"
                    className="bg-white max-w-[2200px]  mx-auto   sm:px-5 py-6 gap-10  w-full grid md:grid-cols-2 grid-cols-1 xl:grid-cols-4 md:h-80 sm:mt-40 mt-3 rounded-[50px] shadow-[0px_5px_10px] border-sky-200 shadow-sky-200"
                >
                    <div className="h-full hover:bg-[#E6F9FF] px-4 rounded-3xl">
                        <div className="h-24 w-24 mt-10  border flex items-center justify-center rounded-2xl mx-auto">
                            <img
                                className="w-20 h-20 mb-3"
                                alt=""
                                src="/icons/quiz.png"
                            />{" "}
                        </div>
                        <p className="text-[#0C4888] mt-6 text-2xl font-bold text-center">
                            Quizzes
                        </p>
                        <p className="text- mt-1 font-normal text-[#0C4888] text-center">
                            Convert your documents and lessons to interactive
                            quizzes .
                        </p>
                    </div>
                    <div className="h-full relative hover:bg-[#E6F9FF] px-4  rounded-3xl">
                        <div className="absolute md:block hidden top-1/2 -translate-y-1/2 w-[2px] h-3/5 -left-5 bg-[#0C4888]/50"></div>
                        <div className="absolute left-1/2 block md:hidden -translate-x-1/2 h-[2px] w-3/5 top-0 bg-[#0C4888]/50"></div>

                        <div className="h-24 w-24 border mt-10  flex items-center justify-center rounded-2xl mx-auto">
                            <img
                                className="w-20 h-20 mt-2 "
                                alt=""
                                src="/icons/brain-storm.png"
                            />
                        </div>
                        <p className="text-[#0C4888] mt-6 text-2xl font-bold text-center">
                            Mindmaps
                        </p>
                        <p className="text- mt-1 font-normal text-[#0C4888] text-center">
                            Create and generate mindmaps to simplify complex
                            topics.
                        </p>
                    </div>{" "}
                    <div className="h-full relative hover:bg-[#E6F9FF] px-4 rounded-3xl hidden xl:block">
                        <div className="absolute top-1/2 -translate-y-1/2 w-[1px] h-3/5 -left-5 bg-[#0C4888]/50"></div>

                        <div className="h-24 w-24 mt-10 border rounded-2xl mx-auto">
                            <img
                                className="w-20 h-20 ml-1 "
                                alt=""
                                src="/icons/documentation.png"
                            />
                        </div>
                        <p className="text-[#0C4888] mt-6 text-2xl font-bold text-center">
                            Summarize lessons
                        </p>
                        <p className="text- mt-1 font-normal text-[#0C4888] text-center">
                            Upload lessons and let the ai summarize them for
                            you.
                        </p>
                    </div>
                    <div className="h-full relative hover:bg-[#E6F9FF] px-4 rounded-3xl hidden xl:block">
                        <div className="absolute top-1/2  -translate-y-1/2 w-[2px] h-3/5 -left-5 bg-[#0C4888]/50"></div>
                        <div className="h-24 w-24 border flex items-center justify-center mt-10 rounded-2xl mx-auto">
                            {" "}
                            <img
                                className="w-18 h-18 ml-1 "
                                alt=""
                                src="/icons/giftbox.png"
                            />
                        </div>
                        <p className="text-[#0C4888] mt-6 text-2xl font-bold text-center">
                            Generous free tier
                        </p>
                        <p className="text- mt-1 font-normal text-[#0C4888] text-center">
                            Once you signin for the first time you will get free
                            100 credits
                        </p>
                    </div>
                </div>
                <div className="bg-white max-w-[2200px]  mx-auto   px-5 py-6 gap-10  w-full xl:hidden grid grid-cols-1 md:grid-cols-2  md:h-80 mt-5 rounded-[50px] shadow-[0px_5px_10px] border-sky-200 shadow-sky-200">
                    <div className="h-full relative hover:bg-[#E6F9FF] px-4 rounded-3xl ">
                        <div className="h-24 w-24 mt-10 border rounded-2xl mx-auto">
                            <img
                                className="w-20 h-20 ml-1 "
                                alt=""
                                src="/icons/documentation.png"
                            />
                        </div>
                        <p className="text-[#0C4888] mt-6 text-2xl font-bold text-center">
                            Summarize lessons
                        </p>
                        <p className="text- mt-1 font-normal text-[#0C4888] text-center">
                            Upload lessons and let the ai summarize them for
                            you.
                        </p>
                    </div>
                    <div className="h-full relative hover:bg-[#E6F9FF] px-4 rounded-3xl ">
                        <div className="absolute md:block hidden top-1/2  -translate-y-1/2 w-[2px] h-3/5 -left-5 bg-[#0C4888]/50"></div>
                        <div className="absolute md:hidden block left-1/2  -translate-x-1/2 h-[2px] w-3/5 -top-0 bg-[#0C4888]/50"></div>
                        <div className="h-24 w-24 border flex items-center justify-center mt-10 rounded-2xl mx-auto">
                            {" "}
                            <img
                                className="w-18 h-18 ml-1 "
                                alt=""
                                src="/icons/giftbox.png"
                            />
                        </div>
                        <p className="text-[#0C4888] mt-6 text-2xl font-bold text-center">
                            Generous free tier
                        </p>
                        <p className="text- mt-1 font-normal text-[#0C4888] text-center">
                            Once you signin for the first time you will get free
                            100 credits
                        </p>
                    </div>
                </div>
            </section>
            <div className="md:h-20 h-2"></div>
            <section
                id="about"
                className="mx-auto  py-10 bg-[#EEFBFC] overflow-hidden relative w-full"
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
                    <div className="pt-0 xl:pl-20 lg:pt-14">
                        <h2 className="text-[#1BAFDE] text-3xl sm:text-4xl font-bold">
                            Who are we ?
                        </h2>
                        <p className="text-xl sm:text-3xl mt-3 sm:mt-4 font-semibold text-[#0C4888]">
                            Rivez.tn is an education platform that helps
                            students with education{" "}
                        </p>
                        <p className="text-base sm:text-lg mt-3 sm:mt-4 text-[#0C4888]">
                            We make preparing for school exams a breeze by
                            giving you the ability to interact with your courses
                            in a fun way. we give you tools that leverage ai to
                            speed up the process of learning.
                        </p>
                    </div>
                    <div className="w-full rounded-2xl flex items-center justify-center">
                        <div className="grid grid-cols-2 gap-4 sm:gap-5">
                            <div className="border flex items-center text-neutral-600 flex-col text-lg font-bold justify-center rounded-xl h-32 sm:h-44 shadow-sky-200 border-sky-200 shadow-[0px_4px_8px] w-full sm:w-56 bg-white text-center px-2 sm:px-0">
                                <p>Generate Mindmaps</p>
                            </div>
                            <div className="border flex items-center text-neutral-600 flex-col text-lg font-bold justify-center rounded-xl h-32 sm:h-44 shadow-sky-200 border-sky-200 shadow-[0px_4px_8px] w-full sm:w-56 bg-white text-center px-2 sm:px-0">
                                <p>Generate Quizzes</p>
                            </div>

                            <div className="border flex items-center text-neutral-600 flex-col text-lg font-bold justify-center rounded-xl h-32 sm:h-44 shadow-sky-200 border-sky-200 shadow-[0px_4px_8px] w-full sm:w-56 bg-white text-center px-2 sm:px-0">
                                <p>Summarize Documents</p>
                            </div>
                            <div className="border flex items-center text-neutral-600 flex-col text-lg font-bold justify-center rounded-xl h-32 sm:h-44 shadow-sky-200 border-sky-200 shadow-[0px_4px_8px] w-full sm:w-56 bg-white text-center px-2 sm:px-0">
                                <p>Summarize Videos</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="contact" className="bg-[#EEFBFC] py-5">
                <div className="max-w-[2200px] mx-auto px-8 md:px-12 lg:px-20">
                    <div className="flex flex-col md:flex-row justify-between gap-8">
                        <div className="bg-white h-auto shadow-[0px_2px_10px] shadow-sky-200 rounded-2xl p-6 md:w-2/5 lg:w-1/3 flex flex-col items-start justify-center">
                            <h2 className="text-[#0C4888] text-2xl lg:text-3xl font-bold ">
                                Start now and get 2500 credit for free !
                            </h2>
                            <Link
                                href={"/auth/register"}
                                className="bg-gradient-to-r flex items-center justify-center font-bold from-amber-400 to-amber-500 h-12 px-8 rounded-full shadow-sm shadow-amber-300/50 text-amber-950/90  hover:text-white hover:cursor-pointer hover:scale-105 transition-all hover:bg-amber-400/95 text-lg mt-6 active:scale-100"
                            >
                                Get started
                            </Link>
                        </div>
                        <div className="bg-white grow pt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 shadow-[0px_2px_10px] shadow-sky-200 rounded-2xl p-6 items-start justify-center">
                            <div className="flex flex-col items-center">
                                <div className="text-[#0C4888] gap-2 font-bold flex items-center  mb-2">
                                    {/* <PhoneIcon /> */}
                                    Phone numbers :
                                </div>
                                <p className="mt-2 text-[#0C4888]/80">
                                    +1 (555) 123-4567
                                </p>
                                <p className="mt-2 text-[#0C4888]/80">
                                    +1 (555) 987-6543
                                </p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="text-[#0C4888] gap-2 flex items-center font-bold mb-2">
                                    {/* <MapPinIcon /> */}
                                    Locations :
                                </div>
                                <p className="mt-2 text-[#0C4888]/80">
                                    123 Education Ave, Suite 200
                                </p>
                                <p className="mt-2 text-[#0C4888]/80">
                                    New York, NY 10001
                                </p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="text-[#0C4888] gap-2 font-bold flex items-center  mb-2">
                                    {/* <Contact2 /> */}
                                    Contact us :
                                </div>
                                <p className=" mt-2 text-[#0C4888]/80">
                                    yassinebenazouz@gmail.com
                                </p>
                                <p className="mt-2 text-[#0C4888]/80">
                                    support@river.tn
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="text-center mt-10 pt-4 border-t border-sky-100/50">
                        <p className="text-[#0C4888]/70 text-sm">
                            All rights reserved © 2025
                        </p>
                    </div>
                </div>
            </section>
        </section>
    )
}

export default Page
