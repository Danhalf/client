import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Column, ColumnProps } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { ReactElement, useEffect, useState } from "react";
import "./index.css";
import { useNavigate, useParams } from "react-router-dom";
import { listAccountActivity } from "http/services/accounts.service";
import { ACCOUNT_ACTIVITY_LIST } from "common/constants/account-options";
import { AccountListActivity } from "common/models/accounts";
import { AccountTakePaymentTabs } from "dashboard/accounts/take-payment-form";
import { useToast } from "dashboard/common/toast";
import { SplitButton } from "primereact/splitbutton";
import { AddFeeDialog } from "./add-fee-dialog";

interface TableColumnProps extends ColumnProps {
    field: keyof AccountListActivity;
}

const renderColumnsData: Pick<TableColumnProps, "header" | "field">[] = [
    { field: "Date", header: "Date" },
    { field: "Description", header: "Description" },
    { field: "Debit", header: "Debit" },
    { field: "Credit", header: "Credit" },
];

const quickPayPath = `take-payment?tab=${AccountTakePaymentTabs.QUICK_PAY}`;

export const AccountManagement = (): ReactElement => {
    const { id } = useParams();
    const toast = useToast();
    const navigate = useNavigate();
    const [activityList, setActivityList] = useState<AccountListActivity[]>([]);
    const [isDialogActive, setIsDialogActive] = useState<boolean>(false);
    const [selectedActivity, setSelectedActivity] = useState<string>(ACCOUNT_ACTIVITY_LIST[0].name);

    const printItems = [
        {
            label: "Print receipt",
            icon: "icon adms-blank",
            command: () => {
                toast.current?.show({
                    severity: "success",
                    summary: "Updated",
                    detail: "Data Updated",
                });
            },
        },
    ];

    const downloadItems = [
        {
            label: "Download receipt",
            icon: "icon adms-blank",
            command: () => {
                toast.current?.show({
                    severity: "success",
                    summary: "Updated",
                    detail: "Data Updated",
                });
            },
        },
    ];

    useEffect(() => {
        if (id) {
            listAccountActivity(id).then((res) => {
                if (Array.isArray(res) && res.length) setActivityList(res);
            });
        }
    }, [id]);
    return (
        <div className='account-management account-card'>
            <h3 className='account-management__title account-title'>Account Management</h3>
            <div className='grid account__body'>
                <div className='col-12 account__control'>
                    <Dropdown
                        className='account__dropdown'
                        options={ACCOUNT_ACTIVITY_LIST}
                        value={selectedActivity}
                        onChange={({ target: { value } }) => setSelectedActivity(value)}
                        optionValue='name'
                        optionLabel='name'
                    />
                    <Button
                        className='account-management__button ml-auto'
                        label='Add Fee'
                        onClick={() => setIsDialogActive(true)}
                        outlined
                    />
                    <Button
                        className='account-management__button'
                        label='Take Payment'
                        outlined
                        onClick={() => navigate(quickPayPath)}
                    />
                </div>
                <div className='col-12 account__table'>
                    <DataTable
                        showGridlines
                        value={activityList}
                        emptyMessage='No activity yet.'
                        reorderableColumns
                        resizableColumns
                        scrollable
                    >
                        <Column
                            bodyStyle={{ textAlign: "center" }}
                            body={() => {
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
                {!!activityList.length && (
                    <div className='col-12 flex gap-3 align-items-end justify-content-start account-management__actions'>
                        <SplitButton
                            model={printItems}
                            className='account-management__button'
                            label='Print'
                            icon='pi pi-table'
                            tooltip='Print table'
                            tooltipOptions={{
                                position: "bottom",
                            }}
                            outlined
                        />
                        <SplitButton
                            model={downloadItems}
                            className='account-management__button'
                            label='Download'
                            icon='pi pi-table'
                            tooltip='Download table'
                            tooltipOptions={{
                                position: "bottom",
                            }}
                            outlined
                        />
                    </div>
                )}
            </div>
            <AddFeeDialog visible={isDialogActive} onHide={() => setIsDialogActive(false)} />
        </div>
    );
};
