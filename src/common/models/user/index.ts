import { FilterOptions, TableColumnsList } from "dashboard/inventory/common/data-table";
import { DataTableState } from "primereact/datatable";

interface ColumnWidth {
    [key: string]: number;
}

export interface TableState extends DataTableState {
    page: number;
    column: string;
}

interface UserSettings {
    activeColumns?: TableColumnsList[];
    columnWidth?: ColumnWidth;
    table?: TableState;
}

export interface InventoryUserSettings extends UserSettings {
    selectedFilterOptions?: FilterOptions[];
}

export interface ContactsUserSettings extends UserSettings {
    selectedCategoriesOptions?: FilterOptions[];
}

export interface ServerUserSettings {
    inventory: InventoryUserSettings;
    contacts: ContactsUserSettings;
}
