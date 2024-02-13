import { ReactElement, useState } from "react";
import "./index.css";

import { useRef } from "react";
import { OverlayPanel, OverlayPanelProps } from "primereact/overlaypanel";

interface InfoOverlayPanelProps extends OverlayPanelProps {
    panelTitle?: string;
}
export const InfoOverlayPanel = ({ panelTitle, ...props }: InfoOverlayPanelProps): ReactElement => {
    const [panelShow, setPanelShow] = useState<boolean>(false);
    return (
        <div className='info-panel'>
            <i
                onClick={() => setPanelShow((prev) => !prev)}
                className='icon adms-help p-text-secondary p-overlay-badge info-panel__icon'
            />
            {panelShow && (
                <div className='info-panel__panel shadow-3'>
                    <div className='info-panel__title'>{panelTitle}</div>
                    <div className='info-panel__body'>{props.children}</div>
                </div>
            )}
        </div>
    );
};
