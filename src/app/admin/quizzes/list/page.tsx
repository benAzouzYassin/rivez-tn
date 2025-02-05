"use client"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import AddQuizDialog from "./_components/add-quiz-dialog"

export default function Page() {
    const [isAddingQuiz, setIsAddingQuiz] = useState(false)

    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <Button
                variant={"blue"}
                onClick={() => {
                    setIsAddingQuiz(true)
                }}
            >
                <Plus />
                Add new quiz
            </Button>
            <AddQuizDialog
                isOpen={isAddingQuiz}
                onOpenChange={setIsAddingQuiz}
            />
        </div>
    )
}
