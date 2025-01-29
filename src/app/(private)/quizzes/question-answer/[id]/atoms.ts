import { Database } from "@/types/database.types"
import { atom } from "jotai"

export const currentStepAtom = atom(0)

export const wrongAnswersIdsAtom = atom<number[]>([])

export const questionsAtom = atom<Question[]>([])

//types
type Question = Database["public"]["Tables"]["quizzes_questions"]["Row"]
