import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Page() {
    return (
        <section className="flex items-center min-h-[60vh] flex-col justify-center">
            <p className="text-5xl font-bold text-neutral-600 mb-4">
                Coming soon..
            </p>
            <Link href={"/home"}>
                <Button>Home page</Button>
            </Link>
        </section>
    )
}
