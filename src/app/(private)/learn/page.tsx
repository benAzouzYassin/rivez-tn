import UserLayout from "@/components/layouts/user-layout/user-layout"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Page() {
    return (
        <UserLayout>
            <Link href={"/quizzes/question-answer"}>
                <Button>Quizz </Button>
            </Link>
        </UserLayout>
    )
}
