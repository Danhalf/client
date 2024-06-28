import { ReactElement, useEffect, useState } from "react";
import { DataTable, DataTablePageEvent, DataTableSortEvent } from "primereact/datatable";
import { Button } from "primereact/button";
import { Column, ColumnProps } from "primereact/column";
import { ROWS_PER_PAGE } from "common/settings";
import { store } from "store";
import { getExportScheduleList } from "http/services/export-to-web.service";
import "./index.css";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { Checkbox } from "primereact/checkbox";
import { ExportWebScheduleList } from "common/models/export-web";
import { DatatableQueries, initialDataTableQueries } from "common/models/datatable-queries";
import { QueryParams } from "common/models/query-params";
import { ExportWebUserSettings, ServerUserSettings, TableState } from "common/models/user";
import { getUserSettings, setUserSettings } from "http/services/auth-user.service";

interface ScheduleColumnProps extends ColumnProps {
    field: keyof ExportWebScheduleList;
}

type ScheduleColumnsList = Pick<ScheduleColumnProps, "header" | "field"> & { checked: boolean };

const scheduleColumns: ScheduleColumnsList[] = [
    { field: "id", header: "#", checked: true },
    { field: "lasttatus", header: "Status", checked: true },
    { field: "created", header: "Created", checked: true },
    { field: "tasktype", header: "Type", checked: true },
    { field: "lasttrun", header: "Last Run", checked: true },
    { field: "nextrun", header: "Next Run", checked: true },
];

export const ExportSchedule = (): ReactElement => {
    const userStore = store.userStore;
    const { authUser } = userStore;
    const [scheduleList, setScheduleList] = useState<ExportWebScheduleList[]>([]);
    const [activeScheduleColumns, setActiveScheduleColumns] =
        useState<ScheduleColumnsList[]>(scheduleColumns);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [lazyState, setLazyState] = useState<DatatableQueries>(initialDataTableQueries);
    const [serverSettings, setServerSettings] = useState<ServerUserSettings>();

    const handleGetExportScheduleList = async (params: QueryParams, total?: boolean) => {
        if (authUser) {
            if (total) {
                getExportScheduleList(authUser.useruid, { ...params, total: 1 }).then(
                    (response) => {
                        if (response && !Array.isArray(response)) {
                            setTotalRecords(response.total ?? 0);
                        }
                    }
                );
            }
            getExportScheduleList(authUser.useruid, params).then((response) => {
                if (Array.isArray(response)) {
                    setScheduleList(response);
                } else {
                    setScheduleList([]);
                }
            });
        }
    };

    const pageChanged = (event: DataTablePageEvent) => {
        setLazyState(event);
        changeSettings({ table: event as TableState });
    };

    const sortData = (event: DataTableSortEvent) => {
        setLazyState(event);
        changeSettings({ table: event as TableState });
    };

    const changeSettings = (settings: Partial<ExportWebUserSettings>) => {
        if (authUser) {
            const newSettings = {
                ...serverSettings,
                exportSchedule: { ...serverSettings?.exportSchedule, ...settings },
            } as ServerUserSettings;
            setServerSettings(newSettings);
            setUserSettings(authUser.useruid, newSettings);
        }
    };

    useEffect(() => {
        if (authUser) {
            getUserSettings(authUser.useruid).then((response) => {
                if (response?.profile.length) {
                    let allSettings: ServerUserSettings = {} as ServerUserSettings;
                    if (response.profile) {
                        try {
                            allSettings = JSON.parse(response.profile);
                        } catch (error) {
                            allSettings = {} as ServerUserSettings;
                        }
                    }
                    setServerSettings(allSettings);
                    const { exportSchedule: settings } = allSettings;
                    if (settings?.activeColumns?.length) {
                        const uniqueColumns = Array.from(new Set(settings?.activeColumns));
                        const serverColumns = scheduleColumns.filter((column) =>
                            uniqueColumns.find((col) => col === column.field)
                        );
                        setActiveScheduleColumns(serverColumns);
                    } else {
                        setActiveScheduleColumns(scheduleColumns.filter(({ checked }) => checked));
                    }
                    settings?.table &&
                        setLazyState({
                            first: settings.table.first || initialDataTableQueries.first,
                            rows: settings.table.rows || initialDataTableQueries.rows,
                            page: settings.table.page || initialDataTableQueries.page,
                            column: settings.table.column || initialDataTableQueries.column,
                            sortField:
                                settings.table.sortField || initialDataTableQueries.sortField,
                            sortOrder:
                                settings.table.sortOrder || initialDataTableQueries.sortOrder,
                        });
                }
            });
        }
    }, [authUser]);

    useEffect(() => {
        let qry: string = "";

        const params: QueryParams = {
            ...(lazyState.sortOrder === 1 && { type: "asc" }),
            ...(lazyState.sortOrder === -1 && { type: "desc" }),
            ...(lazyState.sortField && { column: lazyState.sortField }),
            qry,
            skip: lazyState.first,
            top: lazyState.rows,
        };

        handleGetExportScheduleList(params, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lazyState, authUser]);

    const dropdownHeaderPanel = (
        <div className='dropdown-header flex pb-1'>
            <label className='cursor-pointer dropdown-header__label'>
                <Checkbox
                    checked={scheduleColumns.length === activeScheduleColumns.length}
                    onChange={() => {
                        if (scheduleColumns.length === activeScheduleColumns.length) {
                            setActiveScheduleColumns(
                                scheduleColumns.filter(({ checked }) => checked)
                            );
                            changeSettings({ activeColumns: [] });
                        } else {
                            setActiveScheduleColumns(scheduleColumns);
                            changeSettings({
                                activeColumns: scheduleColumns.map(({ field }) => field),
                            });
                        }
                    }}
                    className='dropdown-header__checkbox mr-2'
                />
                Select All
            </label>
            <button
                className='p-multiselect-close p-link'
                onClick={() => {
                    changeSettings({ activeColumns: [] });
                    return setActiveScheduleColumns(
                        scheduleColumns.filter(({ checked }) => checked)
                    );
                }}
            >
                <i className='pi pi-times' />
            </button>
        </div>
    );

    return (
        <div className='card-content schedule'>
            <div className='grid datatable-controls'>
                <div className='col-12 export-web-controls'>
                    <div className='export-web-controls__input'>
                        <MultiSelect
                            showSelectAll={false}
                            value={activeScheduleColumns}
                            optionLabel='header'
                            options={scheduleColumns}
                            onChange={({ value, stopPropagation }: MultiSelectChangeEvent) => {
                                stopPropagation();
                                const sortedValue = value.sort(
                                    (a: ScheduleColumnsList, b: ScheduleColumnsList) => {
                                        const firstIndex = scheduleColumns.findIndex(
                                            (col) => col.field === a.field
                                        );
                                        const secondIndex = scheduleColumns.findIndex(
                                            (col) => col.field === b.field
                                        );
                                        return firstIndex - secondIndex;
                                    }
                                );
                                changeSettings({
                                    activeColumns: value.map(
                                        ({ field }: { field: string }) => field
                                    ),
                                });
                                setActiveScheduleColumns(sortedValue);
                            }}
                            className='w-full pb-0 h-full flex align-items-center column-picker'
                            panelHeaderTemplate={dropdownHeaderPanel}
                            display='chip'
                            pt={{
                                header: {
                                    className: "column-picker__header",
                                },
                                wrapper: {
                                    className: "column-picker__wrapper",
                                    style: {
                                        maxHeight: "500px",
                                    },
                                },
                            }}
                        />
                    </div>
                    <Button
                        severity='success'
                        type='button'
                        icon='icon adms-print'
                        tooltip='Print export to web form'
                    />
                    <Button
                        severity='success'
                        type='button'
                        icon='icon adms-blank'
                        tooltip='Download export to web form'
                    />
                </div>
            </div>
            <div className='grid'>
                <div className='col-12'>
                    <DataTable
                        showGridlines
                        lazy
                        value={scheduleList}
                        scrollable
                        scrollHeight='70vh'
                        rowsPerPageOptions={ROWS_PER_PAGE}
                        reorderableColumns
                        resizableColumns
                        className='export-web-table'
                        paginator
                        first={lazyState.first}
                        rows={lazyState.rows}
                        totalRecords={totalRecords}
                        onPage={pageChanged}
                        onSort={sortData}
                        sortOrder={lazyState.sortOrder}
                        sortField={lazyState.sortField}
                    >
                        {activeScheduleColumns.map(({ field, header }) => {
                            return (
                                <Column
                                    field={field}
                                    sortable
                                    header={header}
                                    reorderable={false}
                                    pt={{
                                        root: {
                                            style: {
                                                width: "100px",
                                            },
                                        },
                                    }}
                                />
                            );
                        })}
                        <Column
                            bodyStyle={{ textAlign: "center" }}
                            reorderable={false}
                            body={() => {
                                return (
                                    <div className='schedule-control'>
                                        <Button
                                            outlined
                                            className='text schedule-button'
                                            icon='icon adms-pause'
                                        />
                                        <Button
                                            outlined
                                            className='text schedule-button'
                                            icon='icon adms-play-prev'
                                        />
                                        <Button
                                            outlined
                                            className='text schedule-button'
                                            icon='icon adms-trash-can'
                                        />
                                    </div>
                                );
                            }}
                            pt={{
                                root: {
                                    style: {
                                        width: "100px",
                                        padding: "0 15px",
                                    },
                                },
                            }}
                        />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};
