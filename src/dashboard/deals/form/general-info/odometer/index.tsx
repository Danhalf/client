import { observer } from "mobx-react-lite";
import { ReactElement } from "react";
import "./index.css";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";

export const DealGeneralOdometer = observer((): ReactElement => {
    return (
        <div className='grid deal-general-odometer row-gap-2'>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText className='deal-odometer__text-input w-full' />
                    <label className='float-label'>Reading ar Time of Sale (r.)</label>
                </span>
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <Dropdown
                        optionLabel='name'
                        optionValue='name'
                        filter
                        required
                        className='w-full deal-odometer__dropdown'
                    />
                    <label className='float-label'>Number of Digits (req.)</label>
                </span>
            </div>
            <div className='col-3'>
                <div className='deal-odometer__checkbox flex'>
                    <Checkbox
                        inputId='deal-odometer-reflects'
                        className='mt-1'
                        name='deal-odometer-reflects'
                        checked={false}
                    />
                    <label htmlFor='deal-odometer-reflects' className='ml-2'>
                        Odometer reflects the amount of mileage IN EXCESS of its mechanical limits
                    </label>
                </div>
            </div>
            <div className='col-3'>
                <div className='deal-odometer__checkbox flex'>
                    <Checkbox
                        inputId='deal-odometer-not-actual'
                        className='mt-1'
                        name='deal-odometer-not-actual'
                        checked={false}
                    />
                    <label htmlFor='deal-odometer-not-actual' className='ml-2'>
                        Odometer is NOT the actual mileage
                    </label>
                </div>
            </div>
        </div>
    );
});