import { readQuizzes } from "@/data-access/quizzes/read"
import { useQuery } from "@tanstack/react-query"

export function useQuizzes() {
    return useQuery({
        queryKey: ["quizzes"],
        queryFn: readQuizzes,
    })
}
