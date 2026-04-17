import type { ReactNode } from "react";
import { MultiSelect, MultiSelectProps } from "primereact/multiselect";
import "./index.css";

export type ChipMultiSelectProps = MultiSelectProps & {
    overflowCount?: number | null;
    floatLabel?: boolean;
    label?: ReactNode;
    floatClassName?: string;
};

export function ChipMultiSelect({
    overflowCount,
    floatLabel = false,
    label,
    floatClassName,
    className,
    display = "chip",
    value,
    ...rest
}: ChipMultiSelectProps) {
    const showCount = overflowCount != null && overflowCount > 0;
    const hasValue = Array.isArray(value)
        ? value.length > 0
        : value !== undefined && value !== null && value !== "";
    const showFloatLabel = floatLabel && label != null;
    const showPlainLabel = !floatLabel && label != null && !hasValue;
    const msClassName = ["chip-multiselect", className].filter(Boolean).join(" ");
    const shellClassName = [
        "chip-multiselect-shell",
        showFloatLabel ? "p-float-label" : "",
        floatClassName,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <span className={shellClassName}>
            <MultiSelect {...rest} value={value} display={display} className={msClassName} />
            {showCount ? <span className='chip-multiselect__count'>+{overflowCount}</span> : null}
            {showFloatLabel ? <label className='float-label'>{label}</label> : null}
            {showPlainLabel ? <span className='chip-multiselect__label'>{label}</span> : null}
        </span>
    );
}
