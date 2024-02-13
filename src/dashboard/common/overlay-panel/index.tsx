import { ReactElement } from "react";
import "./index.css";

import { useRef } from "react";
import { OverlayPanel, OverlayPanelProps } from "primereact/overlaypanel";
import { Button } from "primereact/button";

interface InfoOverlayPanelProps extends OverlayPanelProps {
    panelTitle?: string;
}
export const InfoOverlayPanel = ({ panelTitle, ...props }: InfoOverlayPanelProps): ReactElement => {
    const op = useRef<OverlayPanel>(null);
    return (
        <div className='info-panel'>
            <Button
                type='button'
                onClick={(e) => {
                    op.current?.toggle(e);
                }}
                className='p-button info-panel__button'
            >
                <i className='custom-target-icon icon adms-help p-text-secondary p-overlay-badge info-panel__icon' />
            </Button>
            <OverlayPanel ref={op} dismissable={false} className='info-panel__panel shadow-3'>
                <div className='info-panel__title'>{panelTitle}</div>
                <div className='info-panel__body'>{props.children}</div>
            </OverlayPanel>
        </div>
    );
};
