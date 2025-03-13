interface Props {
    className: string
}
export default function Locked(props: Props) {
    return (
        <svg
            {...props}
            width="24"
            height="26"
            viewBox="0 0 24 26"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M6 10.8333V8.66663C6 5.08079 7 2.16663 12 2.16663C17 2.16663 18 5.08079 18 8.66663V10.8333"
                stroke="currentColor"
                fill="none"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M17 23.8333H7C3 23.8333 2 22.75 2 18.4166V16.25C2 11.9166 3 10.8333 7 10.8333H17C21 10.8333 22 11.9166 22 16.25V18.4166C22 22.75 21 23.8333 17 23.8333Z"
                fill="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}
