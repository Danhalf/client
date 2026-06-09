import { ReactElement } from "react";

interface SectionHeaderWithCountProps {
    label: string;
    filledCount: number;
    totalCount: number;
}

export const SectionHeaderWithCount = ({
    label,
    filledCount,
    totalCount,
}: SectionHeaderWithCountProps): ReactElement => {
    const isIndicatorActive = filledCount > 0;

    return (
        <div className='p-0'>
            {label}
            <span className={`ml-2 ${isIndicatorActive ? "text--green" : "text--medium-grey"}`}>
                ({filledCount}/{totalCount})
            </span>
        </div>
    );
};
