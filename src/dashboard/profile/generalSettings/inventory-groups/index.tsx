import { Column, ColumnEditorOptions, ColumnProps } from "primereact/column";
import "./index.css";
import { DataTable, DataTableRowEditCompleteEvent } from "primereact/datatable";
import { Button } from "primereact/button";
import { useState } from "react";
import { InputText } from "primereact/inputtext";

const renderColumnsData: Pick<ColumnProps, "header" | "field">[] = [
    { field: "group", header: "Group" },
];

interface SettingsInventoryData {
    id: number;
    group: string;
}
const inventoryData: SettingsInventoryData[] = [
    { id: 1, group: "Cars" },
    { id: 2, group: "The Internet" },
    { id: 3, group: "Local advertisement" },
    { id: 4, group: "Direct mail" },
];

export const SettingsInventoryGroups = () => {
    const [inventorySettings, setInventorySettings] =
        useState<SettingsInventoryData[]>(inventoryData);
    const [selectedInventory, setSelectedInventory] = useState<SettingsInventoryData[] | null>(
        null
    );

    const handleEdit = (e: any, o: any) => {
        // eslint-disable-next-line no-console
        // console.log(dataTableRef.current.getElement());
    };

    const handleDelete = (e: any, o: any) => {
        if (selectedInventory) {
            // eslint-disable-next-line no-console
            console.log(e);
        }
    };

    const onRowEditComplete = (e: DataTableRowEditCompleteEvent) => {
        let editedData = [...inventorySettings];
        let { newData, index } = e;

        editedData[index] = newData as SettingsInventoryData;

        setInventorySettings(editedData);
    };

    const textEditor = (options: ColumnEditorOptions) => {
        return (
            <div className='flex row-edit'>
                <InputText
                    type='text'
                    value={options.value}
                    className='row-edit__input'
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        options.editorCallback!(e.target.value)
                    }
                />
                <Button className='p-button row-edit__button' onClick={() => {}}>
                    Save
                </Button>
            </div>
        );
    };

    return (
        <div className='settings-form'>
            <div className='settings-form__title'>Inventory groups</div>
            <div className='flex justify-content-end mb-4'>
                <Button className='settings-form__button' outlined>
                    New Group
                </Button>
            </div>
            <div className='grid settings-inventory'>
                <div className='col-12'>
                    <DataTable
                        value={inventorySettings}
                        selectionMode={"checkbox"}
                        selection={selectedInventory!}
                        onRowEditComplete={onRowEditComplete}
                        editMode='row'
                        onSelectionChange={(e) => setSelectedInventory(e.value)}
                    >
                        <Column selectionMode='multiple' headerStyle={{ width: "3rem" }}></Column>
                        {renderColumnsData.map(({ field, header }) => (
                            <Column
                                field={field}
                                bodyStyle={{ height: "30px" }}
                                header={header}
                                key={field}
                                editor={(options) => textEditor(options)}
                            />
                        ))}
                        <Column
                            headerStyle={{ width: "6rem" }}
                            header={"Actions"}
                            rowEditor
                            body={(rowData, options, ...rest) => {
                                return (
                                    <div className='flex gap-3'>
                                        <Button
                                            className='p-button p-button-outlined'
                                            severity={
                                                options.rowEditor?.editing ? "secondary" : "success"
                                            }
                                            onClick={(event) => {
                                                options.rowEditor?.onInitClick!(event);
                                            }}
                                            disabled={options.rowEditor?.editing}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            className='p-button p-button-outlined'
                                            severity='secondary'
                                            onClick={() => {}}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                );
                            }}
                        />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};
