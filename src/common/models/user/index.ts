import { FilterOptions, TableColumnsList } from "dashboard/inventory/common/data-table";
import { DataTableState } from "primereact/datatable";

interface ColumnWidth {
    [key: string]: number;
}

interface TableState extends DataTableState {
    page: number;
    column: string;
}

export interface InventoryUserSettings {
    activeColumns?: TableColumnsList[];
    columnWidth?: ColumnWidth;
    selectedFilterOptions?: FilterOptions[];
    table?: TableState;
}

export interface ServerUserSettings {
    inventory: InventoryUserSettings;
}
