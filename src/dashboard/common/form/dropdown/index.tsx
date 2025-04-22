import { DEFAULT_FILTER_THRESHOLD } from "common/settings";
import { Dropdown, DropdownProps } from "primereact/dropdown";

interface CustomDropdownProps extends DropdownProps {
    filterThreshold?: number;
}

export const ComboBox = ({
    options,
    filter,
    filterThreshold = DEFAULT_FILTER_THRESHOLD,
    ...props
}: CustomDropdownProps) => {
    const shouldEnableFilter = options && options.length > filterThreshold;

    return <Dropdown {...props} options={options} filter={filter ?? shouldEnableFilter} />;
};
