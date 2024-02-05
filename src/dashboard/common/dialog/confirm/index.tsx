import { useEffect, useRef } from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";

export const ConfirmModal = ({ message, active }: { message?: string; active: boolean }) => {
    const toast = useRef<Toast>(null);

    useEffect(() => {
        active && showTemplate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active]);

    const accept = () => {
        toast.current &&
            toast.current.show({
                severity: "info",
                summary: "Confirmed",
                detail: "You have accepted",
                life: 3000,
            });
    };

    const reject = () => {
        toast.current &&
            toast.current.show({
                severity: "warn",
                summary: "Rejected",
                detail: "You have rejected",
                life: 3000,
            });
    };

    const showTemplate = () => {
        confirmDialog({
            header: "Confirmation",
            message: (
                <div className='flex flex-column align-items-center w-full gap-3 border-bottom-1 surface-border'>
                    <i className='pi pi-exclamation-circle text-6xl text-primary-500'></i>
                    <span>{message || "Please confirm to proceed moving forward."}</span>
                </div>
            ),

            accept,
            reject,
        });
    };

    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog />
        </>
    );
};
