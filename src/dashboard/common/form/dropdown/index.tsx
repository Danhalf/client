import { DEFAULT_FILTER_THRESHOLD } from "common/settings";
import { Dropdown, DropdownProps } from "primereact/dropdown";
import "./index.css";

interface CustomDropdownProps extends DropdownProps {
    filterThreshold?: number;
    label?: string;
}

export const ComboBox = ({
    options,
    filter,
    filterThreshold = DEFAULT_FILTER_THRESHOLD,
    label,
    ...props
}: CustomDropdownProps) => {
    const shouldEnableFilter = options && options.length > filterThreshold;

    const dropdown = (
        <Dropdown
            {...props}
            className={`${props.className} combo-box`}
            options={options}
            filter={filter ?? shouldEnableFilter}
        />
    );

    return label ? (
        <span className='p-float-label'>
            {dropdown}
            <label className='float-label'>{label}</label>
        </span>
    ) : (
        dropdown
    );
};
