import { Dialog, DialogProps } from "primereact/dialog";

export const AddTaskDialog = ({ visible, onHide }: DialogProps) => {
    return (
        <div className='card flex justify-content-center'>
            <Dialog
                header='Header'
                visible={visible}
                style={{ width: "50vw" }}
                onHide={onHide}
            ></Dialog>
        </div>
    );
};
