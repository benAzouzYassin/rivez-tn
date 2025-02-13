import { PublishingStatusType } from "@/data-access/types"
import { ComponentProps } from "react"
import SearchSelect from "../ui/search-select"

type Props = Omit<ComponentProps<typeof SearchSelect>, "items"> & {
    onSelect: (opt: OptionType) => void
}
export default function PublishingStatusSelect(props: Props) {
    const options = [
        { label: "Published", id: "PUBLISHED" },
        { label: "Draft", id: "DRAFT" },
    ] satisfies OptionType[]

    return <SearchSelect {...props} items={options} />
}

interface OptionType {
    id: PublishingStatusType
    label: string
}
