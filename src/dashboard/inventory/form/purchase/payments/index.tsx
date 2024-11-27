import { BorderedCheckbox, CurrencyInput } from "dashboard/common/form/inputs";
import { ReactElement, useEffect, useState } from "react";
import "./index.css";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column, ColumnProps } from "primereact/column";
import { observer } from "mobx-react-lite";
import { useStore } from "store/hooks";
import { AuthUser } from "http/services/auth.service";
import { getKeyValue } from "services/local-storage.service";
import { LS_APP_USER } from "common/constants/localStorage";
import { getAccountPaymentsList } from "http/services/accounts.service";
import { AccountPayment } from "common/models/accounts";
import { useParams } from "react-router-dom";
import { setInventoryPaymentBack } from "http/services/inventory-service";

interface TableColumnProps extends ColumnProps {
    field: keyof AccountPayment;
}

type TableColumnsList = Pick<TableColumnProps, "header" | "field">;

export const PurchasePayments = observer((): ReactElement => {
    const { id } = useParams();
    const store = useStore().inventoryStore;
    const [user, setUser] = useState<AuthUser | null>(null);
    const { getInventoryPayments } = store;
    const [packsForVehicle, setPacksForVehicle] = useState<number>(0);
    const [defaultExpenses, setDefaultExpenses] = useState<0 | 1>(0);
    const [paid, setPaid] = useState<0 | 1>(0);
    const [salesTaxPaid, setSalesTaxPaid] = useState<0 | 1>(0);
    const [description, setDescription] = useState<string>("");

    useEffect(() => {
        const authUser: AuthUser = getKeyValue(LS_APP_USER);
        setUser(authUser);
    }, []);

    useEffect(() => {
        if (user) {
            getInventoryPayments(user.useruid);
            getAccountPaymentsList(user.useruid);
        }
    }, [user]);

    const renderColumnsData: TableColumnsList[] = [
        { field: "ACCT_NUM", header: "Pack for this Vehicle" },
        { field: "Status", header: "Default Expenses" },
        { field: "Amount", header: "Paid" },
        { field: "PTPDate", header: "Sales Tax Paid" },
    ];

    const handleSavePayment = () => {
        setInventoryPaymentBack(id || "0", {
            payPack: packsForVehicle,
            payDefaultExpAdded: defaultExpenses,
            payPaid: paid,
            paySalesTaxPaid: salesTaxPaid,
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
                        value={[]}
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
