import { BorderedCheckbox, CurrencyInput } from "dashboard/common/form/inputs";
import { ReactElement, useEffect, useState } from "react";
import "./index.css";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column, ColumnProps } from "primereact/column";
import { observer } from "mobx-react-lite";
import { getAccountPaymentsList } from "http/services/accounts.service";
import { AccountPayment } from "common/models/accounts";
import { useParams } from "react-router-dom";
import { getInventoryPaymentBack, setInventoryPaymentBack } from "http/services/inventory-service";
import { InventoryPaymentBack } from "common/models/inventory";
import { getExpensesList } from "http/services/expenses.service";
import { Expenses } from "common/models/expenses";

interface TableColumnProps extends ColumnProps {
    field: keyof AccountPayment;
}

type TableColumnsList = Pick<TableColumnProps, "header" | "field">;

export const PurchasePayments = observer((): ReactElement => {
    const { id } = useParams();
    const [expensesList, setExpensesList] = useState<Expenses[]>([]);
    const [packsForVehicle, setPacksForVehicle] = useState<number>(0);
    const [defaultExpenses, setDefaultExpenses] = useState<0 | 1>(0);
    const [paid, setPaid] = useState<0 | 1>(0);
    const [salesTaxPaid, setSalesTaxPaid] = useState<0 | 1>(0);
    const [description, setDescription] = useState<string>("");

    const fetchInventoryPaymentBack = async () => {
        if (id) {
            const response = await getInventoryPaymentBack(id);
            if (response) {
                const { payPack, payDefaultExpAdded, payPaid, paySalesTaxPaid, payRemarks } =
                    response as InventoryPaymentBack;
                setPacksForVehicle(payPack);
                setDefaultExpenses(payDefaultExpAdded);
                setPaid(payPaid);
                setSalesTaxPaid(paySalesTaxPaid);
                setDescription(payRemarks);
            }
        }
    };

    const fetchInventoryExpenses = async () => {
        if (id) {
            const response = await getExpensesList(id);
            if (response) {
                setExpensesList(response);
            }
        }
    };

    useEffect(() => {
        fetchInventoryExpenses();
        fetchInventoryPaymentBack();
    }, [id]);

    const renderColumnsData: TableColumnsList[] = [
        { field: "ACCT_NUM", header: "Pack for this Vehicle" },
        { field: "Status", header: "Default Expenses" },
        { field: "Amount", header: "Paid" },
        { field: "PTPDate", header: "Sales Tax Paid" },
    ];

    const handleSavePayment = () => {
        setInventoryPaymentBack(id || "0", {
            payPack: packsForVehicle || 0,
            payDefaultExpAdded: defaultExpenses || 0,
            payPaid: paid || 0,
            paySalesTaxPaid: salesTaxPaid || 0,
            payRemarks: description,
        }).then(() => {
            if (id) {
                getAccountPaymentsList(id);
            }
        });
    };

    return (
        <>
            <div className='grid purchase-payments row-gap-2'>
                <div className='col-3'>
                    <CurrencyInput
                        labelPosition='top'
                        title='Pack for this Vehicle'
                        value={packsForVehicle}
                        onChange={({ value }) => {
                            setPacksForVehicle(Number(value));
                        }}
                    />
                </div>
                <div className='col-3'>
                    <BorderedCheckbox
                        checked={!!defaultExpenses}
                        onChange={() => setDefaultExpenses(!!defaultExpenses ? 0 : 1)}
                        name='Default Expenses'
                    />
                </div>
                <div className='col-3'>
                    <BorderedCheckbox
                        checked={!!paid}
                        onChange={() => setPaid(!!paid ? 0 : 1)}
                        name='Paid'
                    />
                </div>
                <div className='col-3'>
                    <BorderedCheckbox
                        checked={!!salesTaxPaid}
                        onChange={() => setSalesTaxPaid(!!salesTaxPaid ? 0 : 1)}
                        name='Sales Tax Paid'
                    />
                </div>

                <div className='col-12'>
                    <span className='p-float-label'>
                        <InputTextarea
                            className='purchase-payments__text-area'
                            value={description}
                            onChange={({ target: { value } }) => setDescription(value)}
                        />
                        <label className='float-label'>Description</label>
                    </span>
                </div>

                <Button
                    className='purchase-payments__button'
                    type='button'
                    onClick={handleSavePayment}
                >
                    Save
                </Button>
            </div>
            <div className='grid'>
                <div className='col-12'>
                    <DataTable
                        showGridlines
                        className='mt-6 purchase-payments__table'
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
                <div className='total-sum'>
                    <span className='total-sum__label'>Total expenses:</span>
                    <span className='total-sum__value'> $ 0.00</span>
                </div>
            </div>
        </>
    );
});
