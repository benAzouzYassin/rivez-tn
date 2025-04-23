import { Checkbox } from "@/components/ui/checkbox"
import ImageWithPreview from "@/components/ui/img-with-preview"
import { cn } from "@/lib/ui-utils"
import { ColumnDef } from "@tanstack/react-table"
import { formatDate, formatSeconds } from "@/utils/date"
import { Badge } from "@/components/ui/badge"
import TooltipWrapper from "@/components/ui/tooltip"
import { SubmissionType } from "./_components/submissions"
import SubmissionsMoreButton from "./_components/submissions-more-button"
import { getLanguage } from "@/utils/get-language"

const translation = {
    en: {
        User: "User",
        Duration: "Duration",
        Correct: "Correct",
        Wrong: "Wrong",
        Skipped: "Skipped",
        "Correct questions": "Correct questions",
        "Failed questions": "Failed questions",
        "Skipped questions": "Skipped questions",
        Date: "Date",
        Actions: "Actions",
        Min: "Min",
    },
    fr: {
        User: "Utilisateur",
        Duration: "Durée",
        Correct: "Correct",
        Wrong: "Faux",
        Skipped: "Passé",
        "Correct questions": "Questions correctes",
        "Failed questions": "Questions échouées",
        "Skipped questions": "Questions passées",
        Date: "Date",
        Actions: "Actions",
        Min: "Min",
    },
    ar: {
        User: "المستخدم",
        Duration: "المدة",
        Correct: "صحيح",
        Wrong: "خاطئ",
        Skipped: "تخطى",
        "Correct questions": "الأسئلة الصحيحة",
        "Failed questions": "الأسئلة الخاطئة",
        "Skipped questions": "الأسئلة المتخطاة",
        Date: "التاريخ",
        Actions: "الإجراءات",
        Min: "دقيقة",
    },
}

export const columns: ColumnDef<SubmissionType>[] = [
    {
        id: "checkbox",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllRowsSelected()}
                onCheckedChange={(checked) =>
                    table.toggleAllRowsSelected(!!checked)
                }
                className="border-neutral-400/60 z-[2] w-6 h-6"
            />
        ),
        cell: ({ row }) => (
            <div className="flex p-0 relative min-h-16 items-center justify-center">
                <div
                    className={cn(
                        "absolute bg-blue-500 rounded-r-full w-2 scale-y-0 h-20 -top-2 -left-2 transition-transform",
                        {
                            "scale-y-100": row.getIsSelected(),
                        }
                    )}
                ></div>
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={() => row.toggleSelected()}
                    className="w-6 h-6"
                />
            </div>
        ),
    },
    {
        id: "Name",
        header: () => {
            const lang = getLanguage()
            const t = translation[lang] || translation.en
            return <div className="text-center">{t.User}</div>
        },
        cell: ({ row }) => (
            <div className="flex items-center gap-4">
                <div
                    className={cn(
                        "min-h-14  h-14 ml-4 relative w-14 min-w-14 rounded-xl",
                        {
                            " bg-zinc-200/70": !row.original?.user?.avatar_url,
                        }
                    )}
                >
                    {!!row.original?.user?.avatar_url && (
                        <div className=" overflow-hidden  rounded-xl  h-full w-full ">
                            <ImageWithPreview
                                alt=""
                                src={row.original.user.avatar_url}
                                className="object-cover object-center"
                            />
                        </div>
                    )}
                </div>
                <p className="md:text-center  min-w-[200px] text-base font-semibold">
                    {row.original?.user?.username ||
                        row.original?.user?.email ||
                        row.original.user_submit_name}
                </p>
            </div>
        ),
    },
    {
        id: "Duration",
        header: () => {
            const lang = getLanguage()
            const t = translation[lang] || translation.en
            return <>{t["Duration"]}</>
        },
        cell: ({ row }) => {
            const lang = getLanguage()
            const t = translation[lang] || translation.en

            return (
                <div className="flex items-center  min-w-[200px] !text-base font-semibold justify-center">
                    {formatSeconds(row.original?.seconds_spent || 0)} {t["Min"]}
                </div>
            )
        },
    },
    {
        id: "Correct questions",
        header: () => {
            const lang = getLanguage()
            const t = translation[lang] || translation.en
            return <>{t.Correct}</>
        },
        cell: ({ row }) => {
            const lang = getLanguage()
            const t = translation[lang] || translation.en
            return (
                <TooltipWrapper content={t["Correct questions"]} asChild>
                    <Badge
                        variant={"green"}
                        className="flex text-lg font-bold mx-auto w-fit"
                    >
                        {
                            row.original?.quiz_submission_answers?.filter(
                                (item) => !!item.is_answered_correctly
                            ).length
                        }{" "}
                    </Badge>
                </TooltipWrapper>
            )
        },
    },
    {
        id: "Failed questions",
        header: () => {
            const lang = getLanguage()
            const t = translation[lang] || translation.en
            return <>{t.Wrong}</>
        },
        cell: ({ row }) => {
            const lang = getLanguage()
            const t = translation[lang] || translation.en
            return (
                <TooltipWrapper content={t["Failed questions"]} asChild>
                    <Badge
                        variant={"red"}
                        className="flex text-lg font-bold mx-auto w-fit"
                    >
                        {
                            row.original?.quiz_submission_answers?.filter(
                                (item) =>
                                    !item.is_answered_correctly &&
                                    !item.is_skipped
                            ).length
                        }{" "}
                    </Badge>
                </TooltipWrapper>
            )
        },
    },
    {
        id: "Skipped questions",
        header: () => {
            const lang = getLanguage()
            const t = translation[lang] || translation.en
            return <>{t.Skipped}</>
        },
        cell: ({ row }) => {
            const lang = getLanguage()
            const t = translation[lang] || translation.en
            return (
                <TooltipWrapper content={t["Skipped questions"]} asChild>
                    <Badge
                        variant={"gray"}
                        className="flex text-lg font-bold mx-auto w-fit"
                    >
                        {
                            row.original?.quiz_submission_answers?.filter(
                                (item) => item.is_skipped
                            ).length
                        }{" "}
                    </Badge>
                </TooltipWrapper>
            )
        },
    },
    {
        id: "Date",
        header: () => {
            const lang = getLanguage()
            const t = translation[lang] || translation.en
            return <>{t.Date}</>
        },
        cell: ({ row }) => (
            <div className="flex items-center !text-base font-semibold justify-center">
                {formatDate(row.original?.created_at, { format: "short" })}
            </div>
        ),
    },
    {
        id: "actions",
        header: () => {
            const lang = getLanguage()
            const t = translation[lang] || translation.en
            return <>{t.Actions}</>
        },
        cell: ({ row }) => (
            <div className="min-w-[70px] flex items-center  justify-center">
                <div className="">
                    {row.original?.id ? (
                        <SubmissionsMoreButton itemId={row.original?.id} />
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        ),
    },
]
