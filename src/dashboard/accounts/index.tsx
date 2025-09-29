import { ReactElement, useEffect, useState } from "react";
import { DatatableQueries, initialDataTableQueries } from "common/models/datatable-queries";

import {
    DataTable,
    DataTablePageEvent,
    DataTableRowClickEvent,
    DataTableSortEvent,
} from "primereact/datatable";
import { getAccountsList, TotalAccountList } from "http/services/accounts.service";
import { Column, ColumnProps } from "primereact/column";
import { QueryParams } from "common/models/query-params";
import { ROWS_PER_PAGE } from "common/settings";
import { makeShortReports } from "http/services/reports.service";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { ReportsColumn } from "common/models/reports";
import { Loader } from "dashboard/common/loader";
import { observer } from "mobx-react-lite";
import { useStore } from "store/hooks";
import { AccountInfo } from "common/models/accounts";
import AccountsHeader from "dashboard/accounts/components/AccountsHeader";
import AccountsAdvancedSearch from "dashboard/accounts/components/AccountsAdvancedSearch";

const renderColumnsData: Pick<ColumnProps, "header" | "field">[] = [
    { field: "accountnumber", header: "Account" },
    { field: "accounttype", header: "Type" },
    { field: "name", header: "Name" },
    { field: "created", header: "Date" },
];

interface AccountsDataTableProps {
    onRowClick?: (accountName: string) => void;
    returnedField?: keyof AccountInfo;
    getFullInfo?: (account: AccountInfo) => void;
}

export const AccountsDataTable = observer(
    ({ onRowClick, returnedField, getFullInfo }: AccountsDataTableProps): ReactElement => {
        const [accounts, setAccounts] = useState<AccountInfo[]>([]);
        const userStore = useStore().userStore;
        const { authUser } = userStore;
        const [totalRecords, setTotalRecords] = useState<number>(0);
        const [globalSearch, setGlobalSearch] = useState<string>("");
        const [lazyState, setLazyState] = useState<DatatableQueries>(initialDataTableQueries);
        const [dialogVisible, setDialogVisible] = useState<boolean>(false);
        const [isLoading, setIsLoading] = useState<boolean>(false);
        const navigate = useNavigate();

        const printTableData = async (print: boolean = false) => {
            setIsLoading(true);
            const columns: ReportsColumn[] = renderColumnsData.map((column) => ({
                name: column.header as string,
                data: column.field as string,
            }));
            const date = new Date();
            const name = `accounts_${
                date.getMonth() + 1
            }-${date.getDate()}-${date.getFullYear()}_${date.getHours()}-${date.getMinutes()}`;

            if (authUser) {
                const data = accounts.map((item) => {
                    const filteredItem: Record<string, any> = {};
                    columns.forEach((column) => {
                        if (item.hasOwnProperty(column.data)) {
                            filteredItem[column.data] = item[column.data as keyof typeof item];
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
            setIsLoading(false);
        };

        const pageChanged = (event: DataTablePageEvent) => {
            setLazyState(event);
        };

        const sortData = (event: DataTableSortEvent) => {
            setLazyState(event);
        };

        useEffect(() => {
            getAccountsList(authUser!.useruid, { total: 1 }).then((response) => {
                if (response && !Array.isArray(response)) {
                    const { total } = response as TotalAccountList;
                    setTotalRecords(total ?? 0);
                }
            });
        }, []);

        useEffect(() => {
            const params: QueryParams = {
                ...(globalSearch && { qry: globalSearch }),
                ...(lazyState.sortField && { column: lazyState.sortField }),
                skip: lazyState.first,
                top: lazyState.rows,
            };
            if (authUser) {
                getAccountsList(authUser.useruid, params).then((response) => {
                    if (Array.isArray(response)) {
                        setAccounts(response);
                    } else {
                        setAccounts([]);
                    }
                });
            }
        }, [lazyState, authUser, globalSearch]);

        const handleOnRowClick = ({ data }: DataTableRowClickEvent): void => {
            const selectedText = window.getSelection()?.toString();

            if (!!selectedText?.length) {
                return;
            }
            if (getFullInfo) {
                getFullInfo(data as AccountInfo);
            }
            if (onRowClick) {
                const value = returnedField ? data[returnedField] : data.name;
                onRowClick(value);
            } else {
                navigate(data.accountuid);
            }
        };

        return (
            <div className='card-content'>
                <AccountsHeader
                    searchValue={globalSearch}
                    onSearchChange={setGlobalSearch}
                    onAdvancedSearch={() => setDialogVisible(true)}
                    onPrint={() => printTableData(true)}
                    onDownload={() => printTableData()}
                    isLoading={isLoading}
                />
                <div className='grid'>
                    <div className='col-12'>
                        {isLoading ? (
                            <div className='dashboard-loader__wrapper'>
                                <Loader overlay />
                            </div>
                        ) : (
                            <DataTable
                                showGridlines
                                value={accounts}
                                lazy
                                paginator
                                first={lazyState.first}
                                rows={lazyState.rows}
                                rowsPerPageOptions={ROWS_PER_PAGE}
                                totalRecords={totalRecords || 1}
                                onPage={pageChanged}
                                onSort={sortData}
                                reorderableColumns
                                resizableColumns
                                sortOrder={lazyState.sortOrder}
                                sortField={lazyState.sortField}
                                rowClassName={() => "hover:text-primary cursor-pointer"}
                                onRowClick={handleOnRowClick}
                            >
                                {renderColumnsData.map(({ field, header }) => (
                                    <Column
                                        field={field}
                                        header={header}
                                        key={field}
                                        sortable
                                        headerClassName='cursor-move'
                                    />
                                ))}
                            </DataTable>
                        )}
                    </div>
                </div>
                <AccountsAdvancedSearch
                    visible={dialogVisible}
                    onClose={() => setDialogVisible(false)}
                    onAccountsUpdate={setAccounts}
                    lazyState={lazyState}
                />
            </div>
        );
    }
);

export const Accounts = () => {
    return (
        <div className='card accounts'>
            <div className='card-header'>
                <h2 className='card-header__title uppercase m-0'>Accounts</h2>
            </div>
            <AccountsDataTable />
        </div>
    );
};
