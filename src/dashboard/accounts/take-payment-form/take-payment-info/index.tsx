import { ReactElement } from "react";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { InfoSection } from "dashboard/accounts/form/information/info-section";
import { InputTextarea } from "primereact/inputtextarea";
import { useStore } from "store/hooks";

export const TakePaymentInfo = observer((): ReactElement => {
    const store = useStore().accountStore;
    const {
        accountPaymentsInfo: { CurrentStatus, CollectionDetails },
    } = store;

    return (
        <div className='take-payment__info'>
            <InfoSection
                sectionTitle='Current Status'
                info={[
                    { title: "Past Due Amt", value: `$ ${CurrentStatus?.PastDueAmount || "0.00"}` },
                    { title: "Current Due", value: `$ ${CurrentStatus?.CurrentDue || "0.00"}` },
                    {
                        title: "Down/Pickup Due",
                        value: `$ ${CurrentStatus?.DownPickupDue || "0.00"}`,
                    },
                    { title: "Fees", value: `$ ${CurrentStatus?.Fees || "0.00"}` },
                    { title: "Total Due", value: `$ ${CurrentStatus?.TotalDue || "0.00"}` },
                    {
                        title: "Current Balance",
                        value: `$ ${CurrentStatus?.CurrentBalance || "0.00"}`,
                    },
                ]}
            />

            <InfoSection
                sectionTitle='Collection Details'
                info={[
                    {
                        title: "Regular Pmt",
                        value: `$ ${CollectionDetails?.RegularPayment || "0.00"}`,
                    },
                    {
                        title: "Next Pmt. due",
                        value: `$ ${CollectionDetails?.NextPmtDue || "0.00"}`,
                    },
                    {
                        title: "Days Overdue",
                        value: `$ ${CollectionDetails?.DaysOverdue || "0.00"}`,
                    },
                    { title: "Last Paid", value: `$ ${CollectionDetails?.LastPaid || "0.00"}` },
                    {
                        title: "Last Paid Days",
                        value: `$ ${CollectionDetails?.LastPaidDays || "0.00"}`,
                    },
                    { title: "Last Late", value: `$ ${CollectionDetails?.LastLate || "0.00"}` },
                ]}
            />

            <div className='account-note mt-3'>
                <span className='p-float-label'>
                    <InputTextarea id='account-memo' className='account-note__input' />
                    <label htmlFor='account-memo'>Account Memo</label>
                </span>
                <Button severity='secondary' className='account-note__button' label='Save' />
            </div>
            <div className='account-note mt-3'>
                <span className='p-float-label'>
                    <InputTextarea id='account-payment' className='account-note__input' />
                    <label htmlFor='account-payment'>Payment Alert</label>
                </span>
                <Button severity='secondary' className='account-note__button' label='Save' />
            </div>
        </div>
    );
});
