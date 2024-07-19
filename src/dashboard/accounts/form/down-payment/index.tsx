import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Column, ColumnProps } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { ReactElement } from "react";
import "./index.css";

const renderColumnsData: Pick<ColumnProps, "header" | "field">[] = [
    { field: "receiptNo", header: "Receipt#" },
    { field: "date", header: "Date" },
    { field: "amount", header: "Amount" },
    { field: "payed", header: "Payed" },
];

export const AccountDownPayment = (): ReactElement => {
    return (
        <div className='down-payment'>
            <h2 className='down-payment__title'>Down Payment</h2>
            <div className='down-payment__header grid'>
                <div className='col-4'>
                    <span className='font-bold'>Contact Cash Down: </span>
                    <span>$0.00</span>
                </div>
                <div className='col-4'>
                    <span className='font-bold'>Cash Down Payment: </span>
                    <span>$0.00</span>
                </div>
                <div className='col-4'>
                    <span className='font-bold'>Cash Dow Balance: </span>
                    <span>$0.00</span>
                </div>
            </div>
            SCHEDULED DOWN PAYMENTS
            <div className='details grid'>
                <div className='col-3'>
                    <Dropdown
                        className='w-full'
                        options={["All Payments", "Sold", "Unsold"]}
                        value='All Payments'
                    />
                </div>
                <div className='col-3 ml-auto'>
                    <Dropdown className='w-full' options={["Take Payment"]} value='Take Payment' />
                </div>
                <div className='col-12'>
                    <DataTable
                        className='mt-6 down-payment__table'
                        value={[]}
                        emptyMessage='No activity yet.'
                        reorderableColumns
                        resizableColumns
                        scrollable
                    >
                        <Column
                            bodyStyle={{ textAlign: "center" }}
                            body={(options) => {
                                return (
                                    <div className='flex gap-3 align-items-center'>
                                        <Checkbox checked={false} />
                                    </div>
                                );
                            }}
                            pt={{
                                root: {
                                    style: {
                                        width: "60px",
                                    },
                                },
                            }}
                        />
                        {renderColumnsData.map(({ field, header }) => (
                            <Column
                                field={field}
                                header={header}
                                alignHeader={"left"}
                                key={field}
                                headerClassName='cursor-move'
                                className='max-w-16rem overflow-hidden text-overflow-ellipsis'
                            />
                        ))}
                    </DataTable>
                </div>
            </div>
            <div className='col-12 flex gap-3'>
                <Button className='down-payment__button'>Print</Button>
                <Button className='down-payment__button'>Download</Button>
            </div>
        </div>
    );
};
