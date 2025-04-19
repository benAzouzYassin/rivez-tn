import { HTMLAttributes } from "react"

interface Props extends HTMLAttributes<SVGElement> {}

export default function YellowStar(props: Props) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
            <defs>
                <linearGradient
                    id="starGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                >
                    <stop offset="0%" stopColor="#FFD700" />
                    <stop offset="100%" stopColor="#FFA500" />
                </linearGradient>
            </defs>
            <path
                fill="url(#starGradient)"
                d="M18 2.5c-.9 0-1.7.9-2 2.4L13.4 14H4.2c-1.1 0-2 .8-2.3 1.7-.3 1 .1 2.1.9 2.7l7.4 5.2-2.8 9c-.3 1-.1 2.1.9 2.7.9.6 2.2.6 3.1 0l6.6-4.7 6.6 4.7c.9.6 2.2.6 3.1 0 1-.6 1.2-1.7.9-2.7l-2.8-9 7.4-5.2c.8-.6 1.2-1.7.9-2.7-.3-.9-1.2-1.7-2.3-1.7h-9.2L20 4.9c-.3-1.5-1.1-2.4-2-2.4z"
            />
        </svg>
    )
}
