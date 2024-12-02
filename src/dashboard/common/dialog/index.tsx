import { Dialog, DialogProps } from "primereact/dialog";
import { Button } from "primereact/button";
import "./index.css";

export interface DashboardDialogProps extends DialogProps {
    action?: () => void;
    buttonDisabled?: boolean;
    cancelButton?: boolean;
}

export const DashboardDialog = ({
    visible,
    onHide,
    header,
    children,
    footer,
    className,
    action,
    buttonDisabled,
    cancelButton,
    ...props
}: DashboardDialogProps) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter") {
            if (action && !buttonDisabled) {
                action();
            } else if (onHide) {
                onHide();
            }
        }
    };

    return (
        <Dialog
            draggable={false}
            header={header}
            className={`dialog ${className}`}
            visible={visible}
            onHide={onHide}
            {...props}
        >
            <div className='p-dialog-content-body' onKeyDown={handleKeyDown} tabIndex={0}>
                {children}
            </div>

            <div className='p-dialog-footer flex justify-content-center'>
                {cancelButton && (
                    <Button
                        label='Cancel'
                        className='dialog__cancel-button'
                        onClick={onHide}
                        severity='danger'
                        outlined
                    />
                )}
                {footer && (
                    <Button label={`${footer}`} disabled={buttonDisabled} onClick={action} />
                )}
            </div>
        </Dialog>
    );
};
