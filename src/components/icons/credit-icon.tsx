interface Props {
    className?: string
}
export default function CreditIcon(props: Props) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
            <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                <circle
                    cx="32"
                    cy="33"
                    fill="#ffce56"
                    r="23"
                    stroke="#4c241d"
                />
                <path
                    d="m19.551 20a18 18 0 1 0 24.9 0"
                    fill="none"
                    stroke="#fc8c29"
                />
                <path
                    d="m26.613 26.076 4.982 1.78a1.211 1.211 0 0 0 .81 0l4.982-1.78a1.2 1.2 0 0 1 1.537 1.537l-1.78 4.987a1.211 1.211 0 0 0 0 .81l1.78 4.982a1.2 1.2 0 0 1 -1.537 1.537l-4.982-1.78a1.211 1.211 0 0 0 -.81 0l-4.982 1.78a1.2 1.2 0 0 1 -1.537-1.537l1.78-4.982a1.211 1.211 0 0 0 0-.81l-1.78-4.982a1.2 1.2 0 0 1 1.537-1.542z"
                    fill="#fff"
                    stroke="#4c241d"
                />
            </g>
        </svg>
    )
}
