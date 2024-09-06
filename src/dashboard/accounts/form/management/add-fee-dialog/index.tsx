import { DashboardDialog, DashboardDialogProps } from "dashboard/common/dialog";
import "./index.css";
import { CurrencyInput } from "dashboard/common/form/inputs";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

interface AddFeeDialogProps extends DashboardDialogProps {}
type AddFeeInfo = {
    type: string;
    other: string;
    amount: number;
    reason: string;
    description: string;
};

const initialAddFee: AddFeeInfo = {
    type: "",
    other: "",
    amount: 0,
    reason: "",
    description: "",
};

const dropdownOptions = [
    "Late Fee",
    "NSF Charge",
    "Returned Check Fee",
    "Mechanical Repair Fee",
    "Repo Fee",
];

export const AddFeeDialog = ({ onHide, action, visible }: AddFeeDialogProps) => {
    const [addFee, setAddFee] = useState<AddFeeInfo>(initialAddFee);

    const handleSaveAddFee = () => {
        onHide();
    };

    return (
        <DashboardDialog
            className='dialog__add-fee add-fee'
            footer='Save'
            header='Add Fee'
            visible={visible}
            onHide={onHide}
            action={handleSaveAddFee}
            cancelButton
        >
            <span className='p-float-label'>
                <Dropdown
                    className='w-full'
                    options={dropdownOptions}
                    pt={{
                        wrapper: {
                            style: { minHeight: "235px" },
                        },
                    }}
                />
                <label className='float-label'>Type</label>
            </span>
            <span className='p-float-label'>
                <InputText
                    className='w-full'
                    value={addFee.other}
                    onChange={({ target: { value } }) => {
                        setAddFee({ ...addFee, other: value });
                    }}
                />
                <label className='float-label'>Other</label>
            </span>

            <div className='splitter my-3'>
                <hr className='splitter__line flex-1' />
            </div>

            <div className='add-fee__control'>
                <CurrencyInput
                    className='add-fee__input'
                    value={addFee.amount}
                    onChange={({ value }) => setAddFee({ ...addFee, amount: value || 0 })}
                    title='Principal'
                    labelPosition='top'
                />
            </div>

            <span className='p-float-label'>
                <InputText
                    className='w-full'
                    value={addFee.reason}
                    onChange={({ target: { value } }) => {
                        setAddFee({ ...addFee, reason: value });
                    }}
                />
                <label className='float-label'>Reason</label>
            </span>

            <span className='p-float-label'>
                <InputTextarea
                    className='w-full add-fee__area'
                    value={addFee.description}
                    onChange={({ target: { value } }) => {
                        setAddFee({ ...addFee, description: value });
                    }}
                />
                <label className='float-label'>Description</label>
            </span>

            <p className='add-fee__remember'>
                <span className='add-fee__remember--bold'>REMEMBER!</span> Crediting fees is not the
                same as taking a payment. Use this screen to add or remove a charge. If you are
                taking a payment, use the "Take Payment" Screen, and select "Misc / Fee Payment" as
                the payment type.
            </p>
        </DashboardDialog>
    );
};