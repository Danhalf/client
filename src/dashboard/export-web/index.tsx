import { useEffect, useState } from "react";
import { AuthUser } from "http/services/auth.service";
import { DatatableQueries, initialDataTableQueries } from "common/models/datatable-queries";
import { DataTable, DataTablePageEvent, DataTableSortEvent } from "primereact/datatable";
import { getKeyValue } from "services/local-storage.service";
import { QueryParams } from "common/models/query-params";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Column, ColumnEditorOptions, ColumnProps } from "primereact/column";
import { LS_APP_USER } from "common/constants/localStorage";
import { ROWS_PER_PAGE } from "common/settings";
import { getExportToWebList } from "http/services/export-to-web.service";
import { ExportWebList } from "common/models/export-web";

export const ExportToWeb = () => {
    const [exportsToWeb, setExportsToWeb] = useState<ExportWebList[]>([]);
    const [authUser, setUser] = useState<AuthUser | null>(null);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [globalSearch, setGlobalSearch] = useState<string>("");
    const [lazyState, setLazyState] = useState<DatatableQueries>(initialDataTableQueries);

    const pageChanged = (event: DataTablePageEvent) => {
        setLazyState(event);
    };

    const sortData = (event: DataTableSortEvent) => {
        setLazyState(event);
    };

    useEffect(() => {
        const authUser: AuthUser = getKeyValue(LS_APP_USER);
        if (authUser) {
            setUser(authUser);
            getExportToWebList(authUser.useruid, { total: 1 }).then((response) => {
                response && !Array.isArray(response) && setTotalRecords(response.total ?? 0);
            });
        }
    }, []);

    useEffect(() => {
        const params: QueryParams = {
            ...(lazyState.sortOrder === 1 && { type: "asc" }),
            ...(lazyState.sortOrder === -1 && { type: "desc" }),
            ...(globalSearch && { qry: globalSearch }),
            ...(lazyState.sortField && { column: lazyState.sortField }),
            skip: lazyState.first,
            top: lazyState.rows,
        };
        if (authUser) {
            getExportToWebList(authUser.useruid, params).then((response) => {
                if (Array.isArray(response)) {
                    setExportsToWeb(response);
                } else {
                    setExportsToWeb([]);
                }
            });
        }
    }, [lazyState, authUser, globalSearch]);

    interface TableColumnProps extends ColumnProps {
        field: keyof ExportWebList | "media";
    }

    const cellEditor = (options: ColumnEditorOptions) => {};

    const renderColumnsData: Pick<TableColumnProps, "header" | "field">[] = [
        { field: "Make", header: "Make" },
        { field: "Model", header: "Model" },
        { field: "Year", header: "Year" },
        { field: "StockNo", header: "StockNo" },
        { field: "media", header: "Media" },
        { field: "Status", header: "Status" },
        { field: "lastexportdate", header: "Last Export Date" },
    ];

    return (
        <div className='grid'>
            <div className='col-12'>
                <div className='card'>
                    <div className='card-header'>
                        <h2 className='card-header__title uppercase m-0'>Export to web</h2>
                    </div>
                    <div className='card-content'>
                        <div className='grid datatable-controls'>
                            <div className='col-6'>
                                <div className='contact-top-controls'>
                                    <Button
                                        className='contact-top-controls__button m-r-20px px-6 uppercase'
                                        severity='success'
                                        type='button'
                                    >
                                        Export
                                    </Button>
                                </div>
                            </div>
                            <div className='col-6 text-right'>
                                <span className='p-input-icon-right'>
                                    <i className='pi pi-search' />
                                    <InputText
                                        value={globalSearch}
                                        placeholder='Search'
                                        onChange={(e) => setGlobalSearch(e.target.value)}
                                    />
                                </span>
                            </div>
                        </div>
                        <div className='grid'>
                            <div className='col-12'>
                                <DataTable
                                    showGridlines
                                    value={exportsToWeb}
                                    lazy
                                    paginator
                                    first={lazyState.first}
                                    rows={lazyState.rows}
                                    rowsPerPageOptions={ROWS_PER_PAGE}
                                    totalRecords={totalRecords}
                                    onPage={pageChanged}
                                    onSort={sortData}
                                    reorderableColumns
                                    resizableColumns
                                    sortOrder={lazyState.sortOrder}
                                    sortField={lazyState.sortField}
                                >
                                    {renderColumnsData.map(({ field, header }) => (
                                        <Column
                                            field={field}
                                            header={header}
                                            key={field}
                                            sortable
                                            editor={(data: any) => {
                                                // eslint-disable-next-line no-console
                                                console.log(data);
                                                return <></>;
                                            }}
                                            headerClassName='cursor-move'
                                        />
                                    ))}
                                </DataTable>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
