import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Column, ColumnProps } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { ReactElement } from "react";

const renderColumnsData: Pick<ColumnProps, "header" | "field">[] = [
    { field: "operationdate", header: "Date" },
    { field: "type_name", header: "Description" },
    { field: "amount_text", header: "Debit" },
    { field: "notbillable", header: "Credit" },
];

export const AccountManagement = (): ReactElement => {
    return (
        <div className='account-management'>
            <h2 className='account-management__title'>Account Management</h2>
            <div className='account-details grid'>
                <div className='col-3'>
                    <Dropdown
                        className='w-full'
                        options={["All Activity", "Edit", "Delete"]}
                        value='All Activity'
                    />
                </div>
                <div className='col-9'>
                    <Button className='account-management__button' label='Take Payment' />
                    <Button className='account-management__button' label='Add Fee' />
                </div>
                <div className='col-12'>
                    <DataTable
                        className='mt-6 account-management__table'
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

                        <Column
                            pt={{
                                root: {
                                    style: {
                                        width: "20px",
                                    },
                                },
                            }}
                        />
                    </DataTable>
                </div>
            </div>
            <div className='col-6'>
                <Button className='account-management__button' outlined>
                    Print
                </Button>
                <Button className='account-management__button' outlined>
                    Download
                </Button>
            </div>
        </div>
    );
};
