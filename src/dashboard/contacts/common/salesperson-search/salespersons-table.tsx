import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { SalespersonsList } from "common/models/contact";
import { DataTableRowClickEvent } from "primereact/datatable";
import { useState, useEffect } from "react";
import { useStore } from "store/hooks";
import { getContactsSalesmanList } from "http/services/contacts-service";
import { ROWS_PER_PAGE } from "common/settings";

interface SalespersonsDataTableProps {
    onRowClick?: (username: string) => void;
    getFullInfo?: (salesperson: SalespersonsList) => void;
}

const renderColumns = [
    { field: "username", header: "Name" },
    { field: "WorkPhone", header: "Work Phone" },
    { field: "HomePhone", header: "Home Phone" },
    { field: "Address", header: "Address" },
    { field: "email", header: "E-mail" },
    { field: "created", header: "Created" },
];

export const SalespersonsDataTable = ({ onRowClick, getFullInfo }: SalespersonsDataTableProps) => {
    const [salespersons, setSalespersons] = useState<SalespersonsList[]>([]);
    const { authUser } = useStore().userStore;

    useEffect(() => {
        if (authUser) {
            getContactsSalesmanList(authUser.useruid).then((response) => {
                if (response && Array.isArray(response)) {
                    setSalespersons(response);
                } else {
                    setSalespersons([]);
                }
            });
        }
    }, [authUser]);

    const handleOnRowClick = ({ data }: DataTableRowClickEvent) => {
        const salesperson = data as SalespersonsList;
        if (onRowClick) {
            onRowClick(salesperson.username);
        }
        if (getFullInfo) {
            getFullInfo(salesperson);
        }
    };

    return (
        <DataTable
            value={salespersons}
            paginator
            rowsPerPageOptions={ROWS_PER_PAGE}
            tableStyle={{ minWidth: "50rem" }}
            onRowClick={handleOnRowClick}
            className='p-datatable-sm'
            showGridlines
            scrollable
            scrollHeight='70vh'
            rowClassName={() => "hover:text-primary cursor-pointer"}
        >
            {renderColumns.map((col) => (
                <Column
                    headerClassName='cursor-move'
                    key={col.field}
                    field={col.field}
                    header={col.header}
                    pt={{
                        root: {
                            style: {
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            },
                        },
                    }}
                />
            ))}
        </DataTable>
    );
};
