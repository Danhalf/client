import { BorderedCheckbox, CurrencyInput, DateInput } from "dashboard/common/form/inputs";
import { ReactElement, useEffect, useState } from "react";
import "./index.css";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column, ColumnProps } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { observer } from "mobx-react-lite";
import { ListData, getInventoryExpenseTypesList } from "http/services/inventory-service";
import { useParams } from "react-router-dom";
import { Expenses } from "common/models/expenses";
import { getExpensesList, getExpensesTotal, setExpensesItem } from "http/services/expenses.service";

export const PurchaseExpenses = observer((): ReactElement => {
    const [expensesTypeList, setExpensesTypeList] = useState<ListData[]>([]);
    const [expensesList, setExpensesList] = useState<Expenses[]>([]);
    const [expenseId, setExpenseId] = useState<number>(0);
    const [expenseDate, setExpenseDate] = useState<string>("");
    const [expenseType, setExpenseType] = useState<number>(0);
    const [expenseAmount, setExpenseAmount] = useState<number>(0);
    const [expenseNotBillable, setExpenseNotBillable] = useState<boolean>(false);
    const [expenseVendor, setExpenseVendor] = useState<string>("");
    const [expenseNotes, setExpenseNotes] = useState<string>("");
    const [expenseTotal, setExpenseTotal] = useState<string>("$ 0.00");

    const { id } = useParams();

    const renderColumnsData: Pick<ColumnProps, "header" | "field">[] = [
        { field: "operationdate", header: "Date" },
        { field: "type_name", header: "Type" },
        { field: "amount_text", header: "Amount" },
        { field: "NotBillable", header: "Not Billable" },
        { field: "vendor", header: "Vendor" },
    ];

    const getExpenses = () => {
        if (id) {
            getExpensesList(id).then((response) => {
                if (response) {
                    setExpensesList(response);
                    setExpenseId(response[0]?.id);
                    setExpenseDate(response[0]?.operationdate);
                    setExpenseType(response[0]?.type);
                    setExpenseAmount(response[0]?.amount);
                    setExpenseVendor(response[0]?.vendor);
                    setExpenseNotes(response[0]?.comment);
                }
            });
            getExpensesTotal(id).then(
                (response) => response?.total && setExpenseTotal(response.total)
            );
        }
    };

    useEffect(() => {
        getInventoryExpenseTypesList().then((data) => data && setExpensesTypeList(data));
        getExpenses();
    }, [id]);

    const handleExpenseSubmit = () => {
        const expenseData: Partial<Expenses> = {
            operationdate: expenseDate,
            type: expenseType,
            amount: expenseAmount,
            vendor: expenseVendor,
            comment: expenseNotes,
        };
        setExpensesItem(expenseId, expenseData).then(() => getExpenses());
    };

    return (
        <>
            <div className='grid purchase-expenses'>
                <div className='col-6 grid row-gap-2'>
                    <div className='col-6'>
                        <DateInput
                            name='Date'
                            date={Date.parse(expenseDate)}
                            onChange={({ value }) =>
                                value && setExpenseDate(String(new Date(`${value}`)))
                            }
                        />
                    </div>
                    <div className='col-6'>
                        <Dropdown
                            placeholder='Type'
                            optionLabel='name'
                            optionValue='id'
                            filter
                            options={expensesTypeList}
                            value={expenseType}
                            onChange={({ value }) => value && setExpenseType(Number(value))}
                            className='w-full'
                        />
                    </div>
                    <div className='col-12'>
                        <Dropdown
                            placeholder='Vendor'
                            filter
                            // options={[expenseVendor]}
                            value={expenseVendor}
                            onChange={({ value }) => value && setExpenseVendor(String(value))}
                            className='w-full'
                        />
                    </div>
                    <div className='col-6'>
                        <CurrencyInput
                            labelPosition='top'
                            title='Amount'
                            value={expenseAmount}
                            onChange={({ value }) => {
                                value && setExpenseAmount(value);
                            }}
                        />
                    </div>
                    <div className='col-6'>
                        <BorderedCheckbox
                            checked={expenseNotBillable}
                            name='Not Billable'
                            onChange={() => {
                                setExpenseNotBillable(!expenseNotBillable);
                            }}
                        />
                    </div>
                </div>
                <div className='col-6'>
                    <InputTextarea
                        className='purchase-expenses__text-area'
                        placeholder='Notes'
                        value={expenseNotes}
                        onChange={({ target: { value } }) => setExpenseNotes(value)}
                    />
                </div>

                <Button className='purchase-expenses__button' onClick={handleExpenseSubmit}>
                    Save
                </Button>
            </div>
            <div className='grid'>
                <div className='col-12'>
                    <DataTable
                        showGridlines
                        className='mt-6 purchase-expenses__table'
                        value={expensesList}
                        emptyMessage='No expenses yet.'
                        reorderableColumns
                        resizableColumns
                    >
                        {renderColumnsData.map(({ field, header }) => (
                            <Column
                                field={field}
                                header={header}
                                key={field}
                                headerClassName='cursor-move'
                            />
                        ))}
                    </DataTable>
                </div>
                <div className='col-12 total-sum'>
                    <span className='total-sum__label'>Total expenses:</span>
                    <span className='total-sum__value'> {expenseTotal}</span>
                </div>
            </div>
        </>
    );
});
