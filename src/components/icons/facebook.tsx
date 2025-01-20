import { HTMLAttributes } from "react"

type Props = {} & HTMLAttributes<SVGElement>
export default function Facebook(props: Props) {
    return (
        <svg
            {...props}
            width="12"
            height="22"
            viewBox="0 0 12 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.79551 21.792V11.947H11.1005L11.5955 8.11001H7.79551V5.66001C7.79551 4.54901 8.10451 3.79201 9.69751 3.79201L11.7295 3.79101V0.358008C11.3775 0.312008 10.1705 0.208008 8.76951 0.208008C5.83951 0.208008 3.83351 1.99601 3.83351 5.28001V8.11001H0.520508V11.947H3.83351V21.792H7.79551Z"
                fill="#3C5A99"
            />
        </svg>
    )
}
