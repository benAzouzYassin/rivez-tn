interface Props {
    className?: string
}
export default function SummarizeDocument(props: Props) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
            <circle
                cx="53.5"
                cy="10.5"
                fill="none"
                r="2.5"
                stroke="#4c241d"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
            <circle cx="23.5" cy="26.5" fill="#e5efef" r="21.5" />
            <path
                d="m13.837 5.663-3.674 3.674"
                fill="none"
                stroke="#4c241d"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
            <path
                d="m10.163 5.663 3.674 3.674"
                fill="none"
                stroke="#4c241d"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
            <circle cx="8" cy="13" fill="#4c241d" r="1" />
            <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                <path d="m7 23h54v34h-54z" fill="#6b4f5b" stroke="#4c241d" />
                <path
                    d="m34 55.685v-32.885s7.76-7.893 21.987-5.262v32.885s-12.934-1.316-21.987 5.262z"
                    fill="#fff"
                    stroke="#4c241d"
                />
                <path
                    d="m39 27.483a25.91 25.91 0 0 1 10.916-2.483"
                    fill="#fff"
                    stroke="#b5a19c"
                />
                <path
                    d="m39 31.483a25.91 25.91 0 0 1 10.916-2.483"
                    fill="#fff"
                    stroke="#b5a19c"
                />
                <path
                    d="m39 35.483a25.91 25.91 0 0 1 10.916-2.483"
                    fill="#fff"
                    stroke="#b5a19c"
                />
                <path
                    d="m34 55.685v-32.885s-7.765-7.893-22-5.262v32.885s12.941-1.316 22 5.262z"
                    fill="#fff"
                    stroke="#4c241d"
                />
                <path d="m30 12-3-3" fill="none" stroke="#ffce56" />
                <path d="m38 12 3-3" fill="none" stroke="#ffce56" />
                <path d="m34 12v-4" fill="none" stroke="#ffce56" />
                <path
                    d="m28.916 27.483a25.9 25.9 0 0 0 -10.916-2.483"
                    fill="#fff"
                    stroke="#b5a19c"
                />
                <path
                    d="m28.916 31.483a25.9 25.9 0 0 0 -10.916-2.483"
                    fill="#fff"
                    stroke="#b5a19c"
                />
                <path
                    d="m28.916 35.483a25.9 25.9 0 0 0 -10.916-2.483"
                    fill="#fff"
                    stroke="#b5a19c"
                />
            </g>
        </svg>
    )
}
