import { BorderedCheckbox, CurrencyInput } from "dashboard/common/form/inputs";
import { ReactElement, useEffect, useState } from "react";
import "./index.css";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { DataTable, DataTableRowClickEvent } from "primereact/datatable";
import { Column, ColumnProps } from "primereact/column";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { getInventoryPaymentBack, setInventoryPaymentBack } from "http/services/inventory-service";
import { InventoryPaymentBack } from "common/models/inventory";
import { Status } from "common/models/base-response";
import { useToast } from "dashboard/common/toast";
import { usePermissions } from "common/hooks/usePermissions";

interface TableColumnProps extends ColumnProps {
    field: keyof InventoryPaymentBack;
    body?: (rowData: InventoryPaymentBack) => ReactElement;
}

type TableColumnsList = Pick<TableColumnProps, "header" | "field" | "body">;

const parseBoolean = (value: unknown): boolean => {
    if (typeof value === "boolean") return value;
    const n = Number(value);
    if (!Number.isNaN(n)) return n !== 0;
    if (typeof value === "string") return value.toLowerCase() === "true";
    return false;
};

export const PurchasePayments = observer((): ReactElement => {
    const { id } = useParams();
    const { inventoryPermissions } = usePermissions();
    const { canDeletePayments, canEditPayments } = inventoryPermissions;
    const [expensesList, setExpensesList] = useState<InventoryPaymentBack[]>([]);
    const [packsForVehicle, setPacksForVehicle] = useState<number>(0);
    const [defaultExpenses, setDefaultExpenses] = useState<0 | 1>(0);
    const [paid, setPaid] = useState<0 | 1>(0);
    const [salesTaxPaid, setSalesTaxPaid] = useState<0 | 1>(0);
    const [description, setDescription] = useState<string>("");
    const [expandedRows, setExpandedRows] = useState<Record<string, any>[]>([]);
    const toast = useToast();

    const fetchInventoryPaymentBack = async () => {
        if (!id) return;
        const response = await getInventoryPaymentBack(id);
        if (Array.isArray(response)) {
            setExpensesList(response);
        }
    };

    useEffect(() => {
        fetchInventoryPaymentBack();
    }, [id]);

    const renderColumnsData: TableColumnsList[] = [
        { field: "payPack", header: "Pack for this Vehicle" },
        { field: "payDefaultExpAdded", header: "Default Expenses" },
        { field: "payPaid", header: "Paid" },
        { field: "paySalesTaxPaid", header: "Sales Tax Paid" },
    ];

    const handleSavePayment = async () => {
        const response = await setInventoryPaymentBack(id || "0", {
            payPack: packsForVehicle || 0,
            payDefaultExpAdded: defaultExpenses || 0,
            payPaid: paid || 0,
            paySalesTaxPaid: salesTaxPaid || 0,
            payRemarks: description,
        });
        if (response?.status === Status.OK) {
            await fetchInventoryPaymentBack();
            setPacksForVehicle(0);
            setDefaultExpenses(0);
            setPaid(0);
            setSalesTaxPaid(0);
            setDescription("");
            setExpandedRows([]);
        } else {
            toast?.current?.show({
                severity: "error",
                summary: "Error",
                detail: response?.error,
            });
        }
    };

    const rowExpansionTemplate = (data: InventoryPaymentBack) => {
        return (
            <div className='expanded-row'>
                <div className='expanded-row__label'>Description: </div>
                <div className='expanded-row__text'>{data.payRemarks}</div>
            </div>
        );
    };

    const handleRowExpansionClick = (data: InventoryPaymentBack) => {
        if (expandedRows.includes(data)) {
            setExpandedRows(expandedRows.filter((item) => item !== data));
            return;
        }
        setExpandedRows([...expandedRows, data]);
    };

    const deleteTemplate = () => {
        return (
            <Button
                type='button'
                icon='icon adms-trash-can'
                tooltip='Delete'
                tooltipOptions={{ showDelay: 300 }}
                className='purchase-payments__delete-button p-button-text'
            />
        );
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
                        emptyMessage='No payments yet.'
                        reorderableColumns
                        resizableColumns
                        rowExpansionTemplate={rowExpansionTemplate}
                        expandedRows={expandedRows}
                        onRowToggle={(e: DataTableRowClickEvent) => setExpandedRows([e.data])}
                        scrollable
                        pt={{
                            wrapper: {
                                className: "thin-scrollbar",
                                style: {
                                    height: "205px",
                                },
                            },
                        }}
                    >
                        <Column
                            bodyStyle={{ textAlign: "center" }}
                            bodyClassName='purchase-payments__table-controls'
                            body={(options) => {
                                const isRowExpanded = expandedRows.some((item) => {
                                    return item === options;
                                });
                                return (
                                    <div className='purchase-payments__table-controls-container'>
                                        {canEditPayments() && (
                                            <Button
                                                type='button'
                                                icon='icon adms-edit-item'
                                                tooltip='Edit'
                                                tooltipOptions={{ showDelay: 300 }}
                                                className='purchase-payments__table-button p-button-text'
                                            />
                                        )}
                                        <Button
                                            type='button'
                                            icon='adms-arrow-bottom'
                                            tooltip={
                                                isRowExpanded
                                                    ? "Hide description"
                                                    : "Show description"
                                            }
                                            tooltipOptions={{ showDelay: 300 }}
                                            disabled={!options?.payRemarks}
                                            className={`purchase-payments__table-button p-button-text ${
                                                isRowExpanded && "table-button-active"
                                            }`}
                                            onClick={() => handleRowExpansionClick(options)}
                                        />
                                    </div>
                                );
                            }}
                            pt={{
                                root: {
                                    style: {
                                        width: `${canEditPayments() ? "70px" : "30px"}`,
                                        padding: "0",
                                    },
                                },
                            }}
                        />
                        {renderColumnsData.map(({ field, header }) =>
                            field === "payPack" ? (
                                <Column
                                    field={field}
                                    header={header}
                                    key={field}
                                    headerClassName='cursor-move'
                                    className='max-w-16rem overflow-hidden text-overflow-ellipsis'
                                    body={(options) => (
                                        <>{`$ ${Number(options[field] || 0).toFixed(2)}`}</>
                                    )}
                                />
                            ) : field === "payDefaultExpAdded" ? (
                                <Column
                                    field={field}
                                    header={header}
                                    key={field}
                                    headerClassName='cursor-move'
                                    className='max-w-16rem overflow-hidden text-overflow-ellipsis'
                                    body={(options) => (
                                        <>
                                            {parseBoolean(options[field])
                                                ? "Data from database"
                                                : ""}
                                        </>
                                    )}
                                />
                            ) : (
                                <Column
                                    field={field}
                                    header={header}
                                    key={field}
                                    headerClassName='cursor-move'
                                    className='max-w-16rem overflow-hidden text-overflow-ellipsis'
                                    body={(options) => (
                                        <>{parseBoolean(options[field]) ? "Yes" : "No"}</>
                                    )}
                                />
                            )
                        )}
                        {canDeletePayments() && (
                            <Column
                                body={deleteTemplate}
                                frozen
                                alignFrozen='right'
                                pt={{
                                    root: {
                                        style: {
                                            width: "20px",
                                        },
                                    },
                                }}
                            />
                        )}
                    </DataTable>
                </div>
            </div>
        </>
    );
});
