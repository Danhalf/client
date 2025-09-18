import { ReactElement, useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column, ColumnBodyOptions, ColumnProps } from "primereact/column";
import { Loader } from "dashboard/common/loader";
import { useStore } from "store/hooks";
import { getUserExportWebList } from "http/services/settings.service";
import { useToastMessage } from "common/hooks";
import { BaseResponseError } from "common/models/base-response";
import { GeneralSettingsWebExport } from "common/models/general-settings";
import { Checkbox } from "primereact/checkbox";

const mockExportWebList: GeneralSettingsWebExport[] = [
    {
        id: 1,
        name: "AutoTrader",
        service_name: "autotrader",
    },
    {
        id: 2,
        name: "Cars.com",
        service_name: "cars_com",
    },
    {
        id: 3,
        name: "CarGurus",
        service_name: "cargurus",
    },
    {
        id: 4,
        name: "AutoList",
        service_name: "autolist",
    },
    {
        id: 5,
        name: "CarMax",
        service_name: "carmax",
    },
    {
        id: 6,
        name: "Vroom",
        service_name: "vroom",
    },
    {
        id: 7,
        name: "Carvana",
        service_name: "carvana",
    },
    {
        id: 8,
        name: "TrueCar",
        service_name: "truecar",
    },
];

interface TableColumnProps extends ColumnProps {
    field: keyof GeneralSettingsWebExport | "";
}

const renderColumnsData: TableColumnProps[] = [
    { field: "name", header: "Service" },
    { field: "service_name", header: "Key" },
];

export const SettingsExportWeb = (): ReactElement => {
    const store = useStore().userStore;
    const { authUser } = store;
    const { showError } = useToastMessage();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedRows, setSelectedRows] = useState<boolean[]>([]);
    const [exportWebList, setExportWebList] = useState<GeneralSettingsWebExport[]>([]);

    const isErrorResponse = (
        response: GeneralSettingsWebExport[] | BaseResponseError | undefined
    ): response is BaseResponseError => {
        return Boolean(response && "error" in response);
    };

    const handleGetUserExportWebList = async () => {
        setIsLoading(true);

        const response = await getUserExportWebList(authUser?.useruid);
        if (response && Array.isArray(response) && response.length) {
            setExportWebList(response);
            setSelectedRows(Array(response.length).fill(false));
            setIsLoading(false);
            return;
        }

        if (isErrorResponse(response)) {
            showError(response.error || "Unknown error occurred");
            setIsLoading(false);
            return;
        }

        const defaultExportWebList = await getUserExportWebList();
        if (
            defaultExportWebList &&
            Array.isArray(defaultExportWebList) &&
            defaultExportWebList.length
        ) {
            setExportWebList(defaultExportWebList);
            setSelectedRows(Array(defaultExportWebList.length).fill(false));
        } else if (isErrorResponse(defaultExportWebList)) {
            showError(defaultExportWebList.error || "Unknown error occurred");
        } else {
            setExportWebList(mockExportWebList);
            setSelectedRows(Array(mockExportWebList.length).fill(false));
        }

        setIsLoading(false);
    };

    useEffect(() => {
        handleGetUserExportWebList();
    }, [authUser]);

    const controlColumnHeader = (): ReactElement => (
        <Checkbox
            checked={selectedRows.length > 0 && selectedRows.every((checkbox) => !!checkbox)}
            onClick={({ checked }) => {
                setSelectedRows(selectedRows.map(() => !!checked));
            }}
        />
    );

    const controlColumnBody = (
        _: GeneralSettingsWebExport,
        { rowIndex }: ColumnBodyOptions
    ): ReactElement => {
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
            </div>
        );
    };

    const dataColumnBody = (value: string | number, rowIndex: number, selectedRows: boolean[]) => {
        const isSelected = selectedRows[rowIndex];
        return <div className={`${isSelected && "row--selected"}`}>{value}</div>;
    };

    return (
        <div className='settings-form'>
            {isLoading && <Loader overlay />}
            <div className='settings-form__title'>Export to Web</div>
            <div className='grid settings-export-web p-2'>
                <div className='col-12'>
                    <DataTable
                        showGridlines
                        className='settings-export-web__table'
                        value={exportWebList}
                        emptyMessage='No export web services configured.'
                        reorderableColumns
                        resizableColumns
                        scrollable
                    >
                        <Column
                            bodyStyle={{ textAlign: "center" }}
                            className='account__table-checkbox'
                            header={exportWebList.length ? controlColumnHeader : ""}
                            body={controlColumnBody}
                            pt={{
                                root: {
                                    style: {
                                        width: exportWebList.length ? "60px" : 0,
                                    },
                                },
                            }}
                        />
                        {renderColumnsData.map(({ field, header }) => (
                            <Column
                                field={field}
                                header={header}
                                key={field}
                                body={({ [field]: value }, { rowIndex }) =>
                                    dataColumnBody(value, rowIndex, selectedRows)
                                }
                            />
                        ))}
                    </DataTable>
                </div>
            </div>
        </div>
    );
};
