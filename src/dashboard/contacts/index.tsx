import { useEffect, useState } from "react";
import {
    getContacts,
    getContactsAmount,
    getContactsCategories,
} from "http/services/contacts-service";
import { AuthUser } from "http/services/auth.service";
import {
    DataTable,
    DataTablePageEvent,
    DataTableRowClickEvent,
    DataTableSortEvent,
} from "primereact/datatable";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getKeyValue } from "services/local-storage.service";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Column, ColumnProps } from "primereact/column";
import { QueryParams } from "common/models/query-params";
import { DatatableQueries, initialDataTableQueries } from "common/models/datatable-queries";
import { LS_APP_USER } from "common/constants/localStorage";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { ROWS_PER_PAGE } from "common/settings";
import { ContactType, ContactUser } from "common/models/contact";

interface ContactsDataTableProps {
    onRowClick?: (companyName: string) => void;
}

export const ContactsDataTable = ({ onRowClick }: ContactsDataTableProps) => {
    const [categories, setCategories] = useState<ContactType[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<ContactType | null>(null);
    const [authUser, setUser] = useState<AuthUser | null>(null);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [globalSearch, setGlobalSearch] = useState<string>("");
    const [contacts, setUserContacts] = useState<ContactUser[]>([]);
    const [lazyState, setLazyState] = useState<DatatableQueries>(initialDataTableQueries);

    const navigate = useNavigate();

    const printTableData = () => {
        const contactsDoc = new jsPDF();
        autoTable(contactsDoc, { html: ".p-datatable-table" });
        contactsDoc.output("dataurlnewwindow");
    };

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
            getContactsCategories().then((response) => {
                if (response?.contact_types.length) {
                    setCategories(response?.contact_types);
                }
            });
            getContactsAmount(authUser.useruid, { total: 1 }).then((response) => {
                setTotalRecords(response?.total ?? 0);
            });
        }
    }, []);

    useEffect(() => {
        const params: QueryParams = {
            ...(selectedCategory?.id && { param: selectedCategory.id }),
            ...(lazyState.sortOrder === 1 && { type: "asc" }),
            ...(lazyState.sortOrder === -1 && { type: "desc" }),
            ...(globalSearch && { qry: globalSearch }),
            ...(lazyState.sortField && { column: lazyState.sortField }),
            skip: lazyState.first,
            top: lazyState.rows,
        };
        if (authUser) {
            getContacts(authUser.useruid, params).then((response) => {
                if (response?.length) {
                    setUserContacts(response);
                } else {
                    setUserContacts([]);
                }
            });
        }
    }, [selectedCategory, lazyState, authUser, globalSearch]);
    interface TableColumnProps extends ColumnProps {
        field: keyof ContactUser;
    }

    const renderColumnsData: Pick<TableColumnProps, "header" | "field">[] = [
        { field: "userName", header: "Name" },
        { field: "phone1", header: "Work Phone" },
        { field: "phone2", header: "Home Phone" },
        { field: "streetAddress", header: "Address" },
        { field: "email1", header: "Email" },
        { field: "created", header: "Created" },
    ];

    const handleOnRowClick = ({ data: { contactuid, companyName } }: DataTableRowClickEvent) => {
        if (onRowClick) {
            onRowClick(companyName);
        } else {
            navigate(contactuid);
        }
    };

    return (
        <div className='card-content'>
            <div className='grid datatable-controls'>
                <div className='col-6'>
                    <div className='contact-top-controls'>
                        <Dropdown
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.value)}
                            options={categories}
                            optionLabel='name'
                            editable
                            className='m-r-20px'
                            placeholder='Select Category'
                        />
                        <Button
                            className='contact-top-controls__button m-r-20px'
                            icon='pi pi-plus-circle'
                            severity='success'
                            type='button'
                            onClick={() => navigate("create")}
                        />
                        <Button
                            severity='success'
                            type='button'
                            icon='pi pi-print'
                            onClick={printTableData}
                        />
                    </div>
                </div>
                <div className='col-6 text-right'>
                    <Button
                        className='contact-top-controls__button m-r-20px'
                        label='Advanced search'
                        severity='success'
                        type='button'
                    />
                    <span className='p-input-icon-right'>
                        <i className='pi pi-search' />
                        <InputText
                            value={globalSearch}
                            onChange={(e) => setGlobalSearch(e.target.value)}
                        />
                    </span>
                </div>
            </div>
            <div className='grid'>
                <div className='col-12'>
                    <DataTable
                        showGridlines
                        value={contacts}
                        lazy
                        scrollable
                        scrollHeight='70vh'
                        paginator
                        first={lazyState.first}
                        rows={lazyState.rows}
                        rowsPerPageOptions={ROWS_PER_PAGE}
                        totalRecords={totalRecords}
                        onPage={pageChanged}
                        onSort={sortData}
                        sortOrder={lazyState.sortOrder}
                        sortField={lazyState.sortField}
                        resizableColumns
                        reorderableColumns
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
                </div>
            </div>
        </div>
    );
};

export default function Contacts() {
    return (
        <div className='grid'>
            <div className='col-12'>
                <div className='card'>
                    <div className='card-header'>
                        <h2 className='card-header__title uppercase m-0'>Contacts</h2>
                    </div>
                    <ContactsDataTable />
                </div>
            </div>
        </div>
    );
}
