import { Button } from "primereact/button";
import { Column, ColumnBodyOptions, ColumnProps } from "primereact/column";
import { DataTable, DataTableRowClickEvent, DataTableValue } from "primereact/datatable";
import { ReactElement, useEffect, useState } from "react";
import "./index.css";
import { listAccountPromises, updateAccountPromise } from "http/services/accounts.service";
import { useParams } from "react-router-dom";
import { AccountPromise } from "common/models/accounts";
import { SplitButton } from "primereact/splitbutton";
import { useStore } from "store/hooks";
import { makeShortReports } from "http/services/reports.service";
import { AddPromiseDialog } from "dashboard/accounts/form/promise-to-pay/add-promise";
import { Checkbox } from "primereact/checkbox";
import { Status } from "common/models/base-response";
import { useToast } from "dashboard/common/toast";
import { TOAST_LIFETIME } from "common/settings";
import { ACCOUNT_PROMISE_STATUS } from "common/constants/account-options";
import { ConfirmModal } from "dashboard/common/dialog/confirm";

interface TableColumnProps extends ColumnProps {
    field: keyof AccountPromise | "";
}

export type TableColumnsList = Pick<TableColumnProps, "header" | "field"> & { checked: boolean };

const renderColumnsData: Pick<TableColumnsList, "header" | "field">[] = [
    { field: "paydate", header: "Pay Date" },
    { field: "username", header: "Note Taker" },
    { field: "amount", header: "Amount" },
];

enum PAID_STATUS {
    LATE = "Late",
    BROKEN = "Broken",
    OUTSTANDING = "Outstanding",
}

enum PAID_COLOR {
    LATE = "yellow",
    BROKEN = "red",
    OUTSTANDING = "blue",
    DISABLED = "grey",
}

export const AccountPromiseToPay = (): ReactElement => {
    const { id } = useParams();
    const userStore = useStore().userStore;
    const { authUser } = userStore;
    const [promiseList, setPromiseList] = useState<AccountPromise[]>([]);
    const [addPromiseVisible, setAddPromiseVisible] = useState<boolean>(false);
    const [selectedRows, setSelectedRows] = useState<boolean[]>([]);
    const [expandedRows, setExpandedRows] = useState<DataTableValue[]>([]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [currentPromise, setCurrentPromise] = useState<AccountPromise | null>(null);
    const toast = useToast();

    const getPromiseList = async () => {
        if (id) {
            const res = await listAccountPromises(id);
            if (Array.isArray(res) && res.length) {
                setPromiseList(res);
                setSelectedRows(Array(res.length).fill(false));
            }
        }
    };

    useEffect(() => {
        getPromiseList();
    }, [id]);

    const handleChangePromiseStatus = (status: PAID_STATUS) => {
        if (id && selectedRows.some((isSelected) => isSelected)) {
            const promises = promiseList.filter((_, index) => selectedRows[index]);
            const pstatus = ACCOUNT_PROMISE_STATUS.find((item) => item.name === status);
            promises.forEach(async (promise) => {
                const res = await updateAccountPromise(promise.itemuid, {
                    ...promise,
                    pstatus: pstatus?.id,
                    pstatusname: status,
                });
                if (res && res.status === Status.ERROR) {
                    return toast.current?.show({
                        severity: "error",
                        summary: Status.ERROR,
                        detail: res.error,
                        life: TOAST_LIFETIME,
                    });
                } else {
                    getPromiseList();
                }
            });
        } else {
            setModalVisible(true);
        }
    };

    const promiseItems = [
        {
            label: "Edit Promise",
            icon: `icon adms-edit-item`,
            command: (promise: AccountPromise) => {
                setCurrentPromise(promise);
                setAddPromiseVisible(true);
            },
        },
        {
            label: "Delete Promise",
            icon: `pi pi-times`,
            command: () => {},
        },
    ];

    const paymentItems = [
        {
            label: "Set Paid Late",
            icon: `pi pi-circle pi-circle--${PAID_COLOR.LATE}`,
            command: () => {
                handleChangePromiseStatus(PAID_STATUS.LATE);
            },
        },
        {
            label: "Set Promise Broken",
            icon: `pi pi-circle pi-circle--${PAID_COLOR.BROKEN}`,
            command: () => {
                handleChangePromiseStatus(PAID_STATUS.BROKEN);
            },
        },
        {
            label: "Set Outstanding",
            icon: `pi pi-circle pi-circle--${PAID_COLOR.OUTSTANDING}`,
            command: () => {
                handleChangePromiseStatus(PAID_STATUS.OUTSTANDING);
            },
        },
    ];

    const rowExpansionTemplate = (data: AccountPromise) => {
        return (
            <div className='expanded-row'>
                <div className='expanded-row__label'>Note: </div>
                <div className='expanded-row__text'>{data.notes || ""}</div>
            </div>
        );
    };

    const controlColumnHeader = (): ReactElement => (
        <Checkbox
            checked={selectedRows.every((checkbox) => !!checkbox)}
            onClick={({ checked }) => {
                setSelectedRows(selectedRows.map(() => !!checked));
            }}
        />
    );

    const getPromiseStatusColor = (statusId: number): string => {
        const status = ACCOUNT_PROMISE_STATUS.find((item) => item.id === statusId)?.name;
        switch (status) {
            case PAID_STATUS.LATE:
                return PAID_COLOR.LATE;
            case PAID_STATUS.BROKEN:
                return PAID_COLOR.BROKEN;
            case PAID_STATUS.OUTSTANDING:
                return PAID_COLOR.OUTSTANDING;
            default:
                return PAID_COLOR.DISABLED;
        }
    };

    const controlColumnBody = (
        options: AccountPromise,
        { rowIndex }: ColumnBodyOptions
    ): ReactElement => {
        const color = getPromiseStatusColor(options.pstatus);
        return (
            <div className={`flex gap-3 align-items-center`}>
                <Checkbox
                    checked={selectedRows[rowIndex]}
                    onClick={() => {
                        setSelectedRows(
                            selectedRows.map((state, index) =>
                                index === rowIndex ? !state : state
                            )
                        );
                    }}
                />
                <Button
                    className='text export-web__icon-button'
                    icon='pi pi-angle-down'
                    disabled={!options.notes}
                    onClick={() => handleRowExpansionClick(options)}
                />
                <Button icon={`pi pi-circle pi-circle--${color}`} text />
            </div>
        );
    };

    const handleRowExpansionClick = (data: AccountPromise) => {
        if (expandedRows.includes(data)) {
            setExpandedRows(expandedRows.filter((item) => item !== data));
            return;
        }
        setExpandedRows([...expandedRows, data]);
    };

    const getShortReports = async (currentData: AccountPromise[], print = false) => {
        const columns = renderColumnsData.map((column) => ({
            name: column.header as string,
            data: column.field as string,
        }));
        const date = new Date();
        const name = `account-promise-to-pay_${
            date.getMonth() + 1
        }-${date.getDate()}-${date.getFullYear()}_${date.getHours()}-${date.getMinutes()}`;

        if (authUser) {
            const data = currentData.map((item) => {
                const filteredItem: Record<string, any> = {};
                renderColumnsData.forEach((column) => {
                    if (item.hasOwnProperty(column.field)) {
                        filteredItem[column.field] = item[column.field as keyof typeof item];
                    }
                });
                return filteredItem;
            });
            const JSONreport = {
                name,
                itemUID: "0",
                data,
                columns,
                format: "",
            };
            await makeShortReports(authUser.useruid, JSONreport).then((response) => {
                const url = new Blob([response], { type: "application/pdf" });
                let link = document.createElement("a");
                link.href = window.URL.createObjectURL(url);
                if (!print) {
                    link.download = `Report-${name}.pdf`;
                    link.click();
                }

                if (print) {
                    window.open(
                        link.href,
                        "_blank",
                        "toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=100,width=1280,height=720"
                    );
                }
            });
        }
    };

    return (
        <div className='account-promise account-card'>
            <h3 className='account-promise__title account-title'>Promise to pay</h3>
            <div className='grid account__body'>
                <div className='col-12 account__control'>
                    <SplitButton
                        model={promiseItems as any}
                        className='account__split-button'
                        label='Add Promise'
                        tooltip='Add Promise'
                        tooltipOptions={{
                            position: "bottom",
                        }}
                        onClick={() => {
                            setAddPromiseVisible(true);
                        }}
                        outlined
                    />
                    <SplitButton
                        model={paymentItems}
                        className='account__split-button ml-auto'
                        label='Set Paid As Promised'
                        tooltip='Set Paid As Promised'
                        tooltipOptions={{
                            position: "bottom",
                        }}
                        outlined
                        pt={{
                            root: {
                                style: {
                                    width: "340px",
                                },
                            },
                        }}
                    />
                </div>
                <div className='col-12 account__table'>
                    <DataTable
                        showGridlines
                        className='account-promise__table'
                        value={promiseList}
                        emptyMessage='No promises added yet.'
                        reorderableColumns
                        resizableColumns
                        scrollable
                        rowExpansionTemplate={rowExpansionTemplate}
                        expandedRows={expandedRows}
                        onRowToggle={(e: DataTableRowClickEvent) => setExpandedRows([e.data])}
                    >
                        <Column
                            bodyStyle={{ textAlign: "center" }}
                            header={controlColumnHeader}
                            body={controlColumnBody}
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
                                body={({ [field]: value }, { rowIndex }) => (
                                    <div className={`${selectedRows[rowIndex] && "row--selected"}`}>
                                        {value || "-"}
                                    </div>
                                )}
                                headerClassName='cursor-move'
                                className='max-w-16rem overflow-hidden text-overflow-ellipsis'
                            />
                        ))}
                    </DataTable>
                </div>
                {!!promiseList.length && (
                    <div className='col-12 flex gap-3'>
                        <Button
                            outlined
                            className='account-promise__button'
                            onClick={() => getShortReports(promiseList, true)}
                        >
                            Print
                        </Button>
                        <Button
                            outlined
                            className='account-promise__button'
                            onClick={() => getShortReports(promiseList)}
                        >
                            Download
                        </Button>
                    </div>
                )}
            </div>
            <ConfirmModal
                visible={!!modalVisible}
                title='Promise is not Selected!'
                icon='pi-exclamation-triangle'
                bodyMessage='No promise has been selected for status change. Please select a promise and try again.'
                confirmAction={() => setModalVisible(false)}
                draggable={false}
                acceptLabel='Got It'
                className='promise-to-pay-warning'
                onHide={() => setModalVisible(false)}
            />
            <AddPromiseDialog
                position='top'
                action={() => {
                    setAddPromiseVisible(false);
                    getPromiseList();
                }}
                currentPromise={currentPromise}
                onHide={() => setAddPromiseVisible(false)}
                statusList={Object.values(paymentItems).map((item) => item.label)}
                visible={addPromiseVisible}
                accountuid={id}
            />
        </div>
    );
};
