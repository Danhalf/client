import { Dialog, DialogProps } from "primereact/dialog";
import "./index.css";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { InputTextarea } from "primereact/inputtextarea";

export const AddTaskDialog = ({ visible, onHide, header }: DialogProps) => {
    const [assignTo, setAssignTo] = useState<string>("");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [account, setAccount] = useState<string>("");
    const [deal, setDeal] = useState<string>("");
    const [contact, setContact] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const handleSave = () => {
        onHide();
    };

    return (
        <Dialog
            header='Add Task'
            headerClassName='dialog-header'
            className='dialog'
            visible={visible}
            onHide={onHide}
        >
            <div className='flex flex-column row-gap-4 p-4'>
                <InputText
                    placeholder='Assign to'
                    value={assignTo}
                    onChange={(e) => setAssignTo(e.target.value)}
                />
                <div className='flex flex-column md:flex-row column-gap-3'>
                    <div className='p-inputgroup flex-1'>
                        <Calendar
                            placeholder='Start Date'
                            value={startDate}
                            onChange={(e) => setStartDate(e.value as Date)}
                        />
                        <span className='p-inputgroup-addon dialog-icon'>
                            <i className='pi pi-calendar'></i>
                        </span>
                    </div>
                    <div className='p-inputgroup flex-1'>
                        <Calendar
                            placeholder='Due Date'
                            value={dueDate}
                            onChange={(e) => setDueDate(e.value as Date)}
                        />
                        <span className='p-inputgroup-addon dialog-icon'>
                            <i className='pi pi-calendar'></i>
                        </span>
                    </div>
                </div>
                <div className='p-inputgroup flex-1'>
                    <InputText
                        placeholder='Account'
                        value={account}
                        onChange={(e) => setAccount(e.target.value)}
                    />
                    <span className='p-inputgroup-addon dialog-icon'>
                        <i className='pi pi-search'></i>
                    </span>
                </div>
                <div className='p-inputgroup flex-1'>
                    <InputText
                        placeholder='Deal'
                        value={deal}
                        onChange={(e) => setDeal(e.target.value)}
                    />
                    <span className='p-inputgroup-addon dialog-icon'>
                        <i className='pi pi-search'></i>
                    </span>
                </div>
                <div className='p-inputgroup flex-1'>
                    <InputText
                        placeholder='Contact'
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                    />
                    <span className='p-inputgroup-addon dialog-icon'>
                        <i className='pi pi-search'></i>
                    </span>
                </div>
                <InputText
                    placeholder='Phone Number'
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <InputTextarea
                    placeholder='Description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                />
            </div>

            <div className='p-dialog-footer flex justify-content-center'>
                <Button label='Save' className='w-4' onClick={handleSave} />
            </div>
        </Dialog>
    );
};
