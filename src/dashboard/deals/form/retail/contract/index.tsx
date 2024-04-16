import { observer } from "mobx-react-lite";
import { ReactElement } from "react";
import "./index.css";
import { InputText } from "primereact/inputtext";
import { CurrencyInput, DateInput } from "dashboard/common/form/inputs";
import { Dropdown } from "primereact/dropdown";

export const DealRetailContract = observer((): ReactElement => {
    return (
        <div className='grid deal-retail-contract row-gap-2'>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText className='deal-insurance__text-input w-full' />
                    <label className='float-label'>Account Number</label>
                </span>
            </div>

            <hr className='form-line' />

            <div className='col-3'>
                <CurrencyInput labelPosition='top' title='Amount of Finance' />
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <Dropdown
                        optionLabel='name'
                        optionValue='name'
                        filter
                        required
                        className='w-full deal-sale__dropdown'
                    />
                    <label className='float-label'>Payment Frequency</label>
                </span>
            </div>
            <div className='col-6'>
                <span className='p-float-label'>
                    <Dropdown
                        optionLabel='name'
                        optionValue='name'
                        filter
                        required
                        className='w-full deal-sale__dropdown'
                    />
                    <label className='float-label'>Term (months)</label>
                </span>
            </div>
            <div className='col-3'>
                <CurrencyInput labelPosition='top' title='Payment Amount' />
            </div>
            <div className='col-3'>
                <CurrencyInput labelPosition='top' title='Final Payment' />
            </div>

            <hr className='form-line' />

            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText className='deal-insurance__text-input w-full' />
                    <label className='float-label'>Insurance Co#</label>
                </span>
            </div>

            <div className='col-3'>
                <DateInput name='Effective Date' />
            </div>
            <div className='col-3'>
                <DateInput name='Expiration Date' />
            </div>

            <div className='col-6'>
                <span className='p-float-label'>
                    <InputText className='deal-insurance__text-input w-full' />
                    <label className='float-label'>Agent's Address</label>
                </span>
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText className='deal-insurance__text-input w-full' />
                    <label className='float-label'>Phone Number</label>
                </span>
            </div>

            <hr className='form-line' />

            <div className='col-3'>
                <CurrencyInput labelPosition='top' title='Coverage Collision' />
            </div>
            <div className='col-2'>
                <span className='p-float-label'>
                    <InputText className='deal-insurance__text-input w-full' />
                    <label className='float-label'>Liability Row</label>
                </span>
            </div>
            <div className='col-2'>
                <span className='p-float-label'>
                    <InputText className='deal-insurance__text-input w-full' />
                    <label className='float-label'>Liability Row</label>
                </span>
            </div>
            <div className='col-2'>
                <span className='p-float-label'>
                    <InputText className='deal-insurance__text-input w-full' />
                    <label className='float-label'>Liability Row</label>
                </span>
            </div>
        </div>
    );
});
