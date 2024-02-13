import { ReactElement } from "react";
import "./index.css";

import { useRef } from "react";
import { OverlayPanel, OverlayPanelProps } from "primereact/overlaypanel";

interface InfoOverlayPanelProps extends OverlayPanelProps {
    panelTitle?: string;
}
export const InfoOverlayPanel = ({ panelTitle, ...props }: InfoOverlayPanelProps): ReactElement => {
    const op = useRef<OverlayPanel>(null);
    return (
        <div className='info-panel'>
            <i
                onClick={(e) => {
                    op.current?.toggle(e);
                }}
                className='icon adms-help p-text-secondary p-overlay-badge info-panel__icon'
            />
            <OverlayPanel ref={op} dismissable={false} className='info-panel__panel shadow-3'>
                <div className='info-panel__title'>{panelTitle}</div>
                <div className='info-panel__body'>{props.children}</div>
            </OverlayPanel>
        </div>
    );
};
