import { observer } from "mobx-react-lite";
import { ReactElement } from "react";
import "./index.css";
import { DashboardRadio } from "dashboard/common/form/inputs";
import { InputText } from "primereact/inputtext";

const tagTopRadio = [
    { name: "titleonly", title: "Title Only", value: "0" },
    { name: "newplates", title: "New Plates", value: "1" },
];

export const DealRetailTag = observer((): ReactElement => {
    return (
        <div className='grid deal-retail-tag row-gap-2'>
            <div className='col-6'>
                <DashboardRadio radioArray={tagTopRadio} width='200px' />
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText className='deal-odometer__text-input w-full' value={""} />
                    <label className='float-label'>Class of License</label>
                </span>
            </div>
        </div>
    );
});
