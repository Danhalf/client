import { ReactElement } from "react";
import { observer } from "mobx-react-lite";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputNumber, InputNumberProps } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { CurrencyInput, DateInput } from "dashboard/common/form/inputs";
import "./index.css";

const PayOffItem = observer(({ title, value }: InputNumberProps): ReactElement => {
    return (
        <div className='pay-off__item'>
            <label className='pay-off__label'>{title}</label>
            <CurrencyInput className='pay-off__input' value={value} />
        </div>
    );
});

export const AccountPayOff = observer((): ReactElement => {
    const paymentMethods = [
        { label: "Method 1", value: "method1" },
        { label: "Method 2", value: "method2" },
    ];

    const cashDrawers = [
        { label: "Drawer 1", value: "drawer1" },
        { label: "Drawer 2", value: "drawer2" },
    ];

    return (
        <div className='grid pay-off'>
            <div className='col-12 md:col-4'>
                <div className='take-payment__card'>
                    <h3 className='take-payment__title'>Cash Deal Payoff</h3>
                    <div className='pay-off__item'>
                        <label className='pay-off__label'>Down Payment Balance</label>
                    </div>

                    <div className='pay-off__item'>
                        <label className='pay-off__label'>Amount Financed/Balance</label>
                    </div>

                    <PayOffItem title='(-) Reserve' value={0} />
                    <PayOffItem title='(-) Discount' value={0} />
                    <PayOffItem title='(-) Loan Fees' value={0} />
                    <PayOffItem title='(-) Service Contract Withholding' value={0} />
                    <PayOffItem title='(-) GAP Withholding' value={0} />
                    <PayOffItem title='(-) VSI Withholding' value={0} />
                    <PayOffItem title='(-) Miscellaneous Withholding' value={0} />
                    <PayOffItem title='(+) Miscellaneous Profit/Commission' value={0} />
                    <div className='pay-off__item'>
                        <label className='pay-off__label'>(=) Net Check from Lender</label>
                    </div>
                </div>
            </div>

            <div className='col-12 md:col-4'>
                <div className='take-payment__card'>
                    <h3 className='take-payment__title'>Pay Off Account</h3>
                    <div className='p-fluid'>
                        <div className='pay-off__item'>
                            <label className='pay-off__label'>Payment Date</label>
                            <DateInput />
                        </div>

                        <label className='pay-off__label'>Pmt Method</label>
                        <Dropdown id='pmtMethod' options={paymentMethods} />

                        <label className='pay-off__label'>Check#</label>
                        <InputText id='checkNumber' />

                        <label className='pay-off__label'>Balance Paydown</label>
                        <InputNumber id='balancePaydown' value={0} />

                        <label className='pay-off__label'>Down Payment</label>
                        <InputNumber id='downPayment' value={0} />

                        <label className='pay-off__label'>Fees Payment</label>
                        <InputNumber id='feesPayment' value={0} />

                        <h3>Total Paid: $0.00</h3>

                        <label className='pay-off__label'>Cash Drawer</label>
                        <Dropdown id='cashDrawer' options={cashDrawers} />

                        <label className='pay-off__label'>Payoff Taken By</label>
                        <InputText id='payoffTakenBy' />

                        <Button label='Apply Payment' />
                    </div>
                </div>
            </div>

            <div className='col-12 md:col-4'>
                <div className='take-payment__card'>
                    <h3 className='take-payment__title'>Current Status</h3>
                    {/* Add fields for Current Status and Collection Details */}
                    <label className='pay-off__label'>Unearned Interest</label>
                    <h3 className='take-payment__title'>$0.00</h3>
                    <p>Note: You DO NOT owe this amount to the customer</p>

                    <h3 className='take-payment__title'>White Offs</h3>
                    <Checkbox checked inputId='whiteOffs' />
                    <label className='pay-off__label'>
                        Do not write off these amounts, show them as still owing.
                    </label>

                    <h3 className='take-payment__title'>Principal White Off: $0.00</h3>
                    <h3 className='take-payment__title'>Down Pmt White Off: $0.00</h3>
                    <h3 className='take-payment__title'>Fees White Off: $0.00</h3>

                    <Button label='Save' />
                </div>
            </div>
        </div>
    );
});
