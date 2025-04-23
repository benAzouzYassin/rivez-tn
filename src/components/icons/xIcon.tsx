import { HTMLAttributes } from "react"

type Props = HTMLAttributes<SVGElement>
export default function XIcon(props: Props) {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <g clipPath="url(#clip0_4_3277)">
                <path
                    d="M2 2L14 14M14 2L2 14"
                    stroke="#B1B1B1"
                    strokeWidth="3"
                    strokeLinecap="round"
                />
            </g>
            <defs>
                <clipPath id="clip0_4_3277">
                    <rect width="16" height="16" fill="white" />
                </clipPath>
            </defs>
        </svg>
    )
}
