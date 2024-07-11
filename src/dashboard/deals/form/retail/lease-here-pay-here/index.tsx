import { observer } from "mobx-react-lite";
import { ReactElement } from "react";
import { InputText } from "primereact/inputtext";
import { CurrencyInput, DateInput } from "dashboard/common/form/inputs";
import { Dropdown } from "primereact/dropdown";
import { useStore } from "store/hooks";
import { InputNumber } from "primereact/inputnumber";
import { PAYMENT_FREQUENCY_LIST, TERM_MONTH_LIST } from "common/constants/contract-options";
import { Checkbox } from "primereact/checkbox";

export const DealLeaseHerePayHere = observer((): ReactElement => {
    const store = useStore().dealStore;
    const {
        dealExtData: { Con_Acct_Num, Con_Pmt_Freq, Con_Term },
        changeDealExtData,
    } = store;
    return (
        <div className='grid deal-lease row-gap-2'>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText
                        value={Con_Acct_Num}
                        onChange={({ target: { value } }) =>
                            changeDealExtData({ key: "Con_Acct_Num", value })
                        }
                        className='deal-lease__text-input w-full'
                    />
                    <label className='float-label'>Account Number</label>
                </span>
            </div>

            <hr className='form-line' />

            <div className='col-3'>
                <CurrencyInput labelPosition='top' title='Depreciation' />
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <Dropdown
                        optionLabel='name'
                        optionValue='id'
                        value={Con_Pmt_Freq}
                        onChange={({ target: { value } }) =>
                            changeDealExtData({ key: "Con_Pmt_Freq", value })
                        }
                        options={PAYMENT_FREQUENCY_LIST}
                        filter
                        required
                        className='w-full deal-lease__dropdown'
                    />
                    <label className='float-label'>Payment Frequency</label>
                </span>
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <Dropdown
                        value={Con_Term}
                        onChange={({ target: { value } }) =>
                            changeDealExtData({ key: "Con_Term", value })
                        }
                        options={TERM_MONTH_LIST}
                        editable
                        filter
                        required
                        className='w-full deal-lease__dropdown'
                    />
                    <label className='float-label'>Term (months)</label>
                </span>
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputNumber min={1} className='deal-lease__text-input w-full' />
                    <label className='float-label'>Money Factor</label>
                </span>
            </div>
            <div className='col-3'>
                <CurrencyInput labelPosition='top' title='Payment' />
            </div>
            <div className='col-3'>
                <CurrencyInput labelPosition='top' title='Monthly Prop. Tax' />
            </div>
            <div className='col-3'>
                <CurrencyInput labelPosition='top' title='Total Payment' />
            </div>
            <div className='col-3'>
                <CurrencyInput labelPosition='top' title='Purchase Option' />
            </div>
            <div className='col-3'>
                <CurrencyInput labelPosition='top' title='Expected Taxes and Fees' />
            </div>
            <div className='col-3'>
                <DateInput name='Sale Date' />
            </div>
            <div className='col-3'>
                <DateInput name='Second Payment Due' />
            </div>
            <div className='col-3'>
                <DateInput name='Final Payment Due' />
            </div>

            <div className='col-4 flex align-items-center'>
                <Checkbox
                    inputId='lease-first-payment'
                    name='lease-first-payment'
                    checked={false}
                />
                <label htmlFor='lease-first-payment' className='ml-2'>
                    First Payment Due on Delivery
                </label>
            </div>

            <hr className='form-line' />

            <div className='col-3'>
                <CurrencyInput labelPosition='top' title='Late Fee' />
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputNumber min={1} className='deal-lease__text-input w-full' />
                    <label className='float-label'>Grace Period</label>
                </span>
            </div>
            <div className='col-3'>
                <DateInput name='Effective Date' />
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputNumber min={1} className='deal-lease__text-input w-full' />
                    <label className='float-label'>Miles per Year</label>
                </span>
            </div>
            <div className='col-3'>
                <CurrencyInput labelPosition='top' title='Overage Cost' />
            </div>
            <div className='col-3'>
                <CurrencyInput labelPosition='top' title='Termination Fee' />
            </div>
        </div>
    );
});
