interface Props {
    className: string
}
export default function MessengerIcon(props: Props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="63"
            viewBox="0 0 64 63"
            fill="none"
        >
            <path
                d="M32 63C49.397 63 63.5 48.897 63.5 31.5C63.5 14.103 49.397 0 32 0C14.603 0 0.5 14.103 0.5 31.5C0.5 48.897 14.603 63 32 63Z"
                fill="white"
            ></path>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M32.0002 8.16699C18.5929 8.16699 8.2002 17.9857 8.2002 31.253C8.2002 38.1923 11.0422 44.189 15.6762 48.3283C16.0635 48.6783 16.3015 49.1637 16.3155 49.6863L16.4462 53.919C16.4882 55.2677 17.8835 56.1497 19.1202 55.6037L23.8429 53.5177C24.2442 53.3403 24.6922 53.3077 25.1122 53.4243C27.2822 54.0217 29.5922 54.339 32.0002 54.339C45.4075 54.339 55.8002 44.5203 55.8002 31.253C55.8002 17.9857 45.4075 8.16699 32.0002 8.16699Z"
                fill="url(#paint0_radial_2428_72315)"
            ></path>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.7061 38.0055L24.6968 26.9129C25.8075 25.1489 28.1921 24.7102 29.8581 25.9609L35.4208 30.1329C35.9295 30.5155 36.6341 30.5155 37.1428 30.1282L44.6515 24.4302C45.6548 23.6695 46.9615 24.8689 46.2895 25.9329L39.2988 37.0209C38.1881 38.7849 35.8035 39.2235 34.1375 37.9729L28.5748 33.8009C28.0661 33.4182 27.3615 33.4182 26.8528 33.8055L19.3488 39.5082C18.3455 40.2689 17.0388 39.0695 17.7061 38.0055Z"
                fill="white"
            ></path>
            <defs>
                <radialGradient
                    id="paint0_radial_2428_72315"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(17.3488 55.5079) scale(51.856 51.856)"
                >
                    <stop stopColor="#5697FB"></stop>
                    <stop offset="0.6098" stopColor="#8936F9"></stop>
                    <stop offset="0.9348" stopColor="#DD537E"></stop>
                    <stop offset="1" stopColor="#E06F62"></stop>
                </radialGradient>
            </defs>
        </svg>
    )
}
