import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User2 } from "lucide-react"

type UserProfileProps = {
    name: string
    image?: string
}

export default function UserProfileButton({ name, image }: UserProfileProps) {
    return (
        <div className="group relative rounded-full   active:scale-95 transition-all  ">
            <Avatar className="h-[50px] opacity-90 w-[50px]">
                <AvatarImage src={image} alt={name} />
                <AvatarFallback className="bg-neutral-100 border text-neutral-400">
                    <User2 className="h-6 w-6" />
                </AvatarFallback>
            </Avatar>
        </div>
    )
}
