import { Tooltip, TooltipProps } from "primereact/tooltip";
import { ReactElement } from "react";
import "./index.css";

interface DashboardTooltipProps extends TooltipProps {}
export const DashboardTooltip = (props: DashboardTooltipProps): ReactElement => {
    return (
        <div className='tooltip'>
            <Tooltip target='.custom-target-icon' {...props} />

            <i
                className='custom-target-icon icon adms-help p-text-secondary p-overlay-badge tooltip__icon'
                data-pr-tooltip='No notifications'
                data-pr-position='right'
                data-pr-at='right+5 top'
                data-pr-my='left center-2'
            />
        </div>
    );
};
