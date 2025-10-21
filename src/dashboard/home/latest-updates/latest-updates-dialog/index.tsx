import { useToastMessage } from "common/hooks";
import { News } from "common/models/tasks";
import { DashboardDialog } from "dashboard/common/dialog";
import { getLatestNews } from "http/services/tasks.service";
import { Column, ColumnProps } from "primereact/column";
import { DataTableExpandedRows, DataTableRowClickEvent, DataTable } from "primereact/datatable";
import { DialogProps } from "primereact/dialog";
import { ReactElement, useState, useEffect } from "react";
import { useStore } from "store/hooks";

const MAX_NEWS_COUNT_ON_PAGE = 10;

interface TableColumnProps extends ColumnProps {
    field: keyof News;
}

const renderColumnsData: Pick<TableColumnProps, "header" | "field">[] = [
    { field: "description", header: "Title" },
    { field: "created", header: "Date" },
];

interface LatestUpdatesDialogProps extends DialogProps {
    totalCount: number;
}

export const LatestUpdatesDialog = ({
    visible,
    onHide,
    totalCount,
}: LatestUpdatesDialogProps): ReactElement => {
    const store = useStore().userStore;
    const { authUser } = store;
    const [newsData, setNewsData] = useState<News[]>([]);
    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows[]>([]);
    const { showError } = useToastMessage();

    const handleGetNews = async () => {
        if (!authUser) return;
        try {
            const newsResponse = await getLatestNews(authUser.useruid, {
                top: MAX_NEWS_COUNT_ON_PAGE,
            });

            if (newsResponse && Array.isArray(newsResponse)) {
                setNewsData(newsResponse);
            }
        } catch (error) {
            showError(error as any);
        }
    };

    useEffect(() => {
        handleGetNews();
    }, []);

    const rowExpansionTemplate = (data: News) => {
        return <div className='datatable-hidden'>{data.description}</div>;
    };

    const handleRowClick = (e: DataTableRowClickEvent) => {
        const rowData = e.data;
        const isRowExpanded = expandedRows.some((row) => row === rowData);

        if (isRowExpanded) {
            setExpandedRows(expandedRows.filter((row) => row !== rowData));
        } else {
            setExpandedRows([...expandedRows, rowData]);
        }
    };

    return (
        <DashboardDialog
            className='dialog-news'
            header='Latest updates'
            visible={visible}
            onHide={onHide}
        >
            <DataTable
                showGridlines
                value={newsData}
                rowExpansionTemplate={rowExpansionTemplate}
                expandedRows={expandedRows}
                onRowToggle={(e: DataTableRowClickEvent) => setExpandedRows([e.data])}
                onRowClick={handleRowClick}
                rowHover
                reorderableColumns
                resizableColumns
            >
                {renderColumnsData?.map(({ field, header }) => (
                    <Column field={field} header={header} key={field} />
                ))}
            </DataTable>
        </DashboardDialog>
    );
};
