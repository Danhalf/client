import { ReactElement, ReactNode, useState } from "react";
import "./index.css";
import { Button } from "primereact/button";

interface InfoOverlayPanelProps {
    panelTitle?: string;
    children: ReactNode;
    className?: string;
}
export const InfoOverlayPanel = ({
    panelTitle,
    children,
    className,
}: InfoOverlayPanelProps): ReactElement => {
    const [panelShow, setPanelShow] = useState<boolean>(true);
    return (
        <div className={`info-panel ${className ?? ""}`}>
            <Button
                type='button'
                className='info-panel__button'
                onClick={() => setPanelShow((prev) => !prev)}
            >
                <i className='icon adms-question-mark p-text-secondary p-overlay-badge info-panel__icon' />
            </Button>
            {panelShow && (
                <div className='info-panel__panel shadow-3'>
                    <div className='info-panel__title'>{panelTitle}</div>
                    <div className='info-panel__body'>{children}</div>
                </div>
            )}
        </div>
    );
};
