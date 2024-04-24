import { Column, ColumnProps } from "primereact/column";
import "./index.css";
import { DataTable } from "primereact/datatable";

export const SettingsInventoryGroups = () => {
    const renderColumnsData: Pick<ColumnProps, "header" | "field">[] = [
        { field: "", header: "" },
        { field: "group", header: "Group" },
        { field: "action", header: "Action" },
    ];

    const renderRowsData = [
        { id: 1, group: "Cars", action: "Action 1" },
        { id: 2, group: "The Internet", action: "Action 2" },
        { id: 3, group: "Local advertisement", action: "Action 3" },
        { id: 3, group: "Direct mail", action: "Action 3" },
    ];

    return (
        <div className='settings-form'>
            <div className='settings-form__title'>Inventory groups</div>
            <div className='grid settings-inventory'>
                <div className='col-12'>
                    <DataTable showGridlines value={renderRowsData} rowHover resizableColumns>
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
            </div>
        </div>
    );
};
