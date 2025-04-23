const en = {
    Quizzes: "Quizzes",
    Search: "Search",
    "Add Quiz": "Add Quiz",
    "My Quizzes": "My Quizzes",
    "Shared Quizzes": "Shared",
    Questions: "Questions",
    Submissions: "Submissions",
    "Update questions": "Update questions",
    "Update information": "Update information",
    Details: "Details",
    Share: "Share",
    Delete: "Delete",
}

const ar = {
    Quizzes: "الاختبارات",
    Search: "بحث",
    "Add Quiz": "إضافة اختبار",
    "My Quizzes": "اختباراتي",
    "Shared Quizzes": "الاختبارات المشتركة",
    Questions: "سؤال",
    Submissions: "إجابة",
    "Update questions": "تحديث الأسئلة",
    "Update information": "تحديث المعلومات",
    Details: "تفاصيل",
    Share: "مشاركة",
    Delete: "حذف",
} satisfies Translation

const fr = {
    Quizzes: "Les Quiz",
    Search: "Recherche",
    "Add Quiz": "Ajouter un quiz",
    "My Quizzes": "Mes quiz",
    "Shared Quizzes": "Partagés",
    Questions: "Questions",
    Submissions: "Soumissions",
    "Update questions": "Mettre à jour les questions",
    "Update information": "Mettre à jour les informations",
    Details: "Détails",
    Share: "Partager",
    Delete: "Supprimer",
} satisfies Translation

export const translation = {
    en,
    ar,
    fr,
}
export type Translation = typeof en
