import { DashboardDialog } from "dashboard/common/dialog";
import { DialogProps } from "primereact/dialog";
import "./index.css";
import { useEffect, useState } from "react";
import { DataTable, DataTableExpandedRows, DataTableRowClickEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { getSupportMessages } from "http/services/support.service";
import { LS_APP_USER } from "common/constants/localStorage";
import { AuthUser } from "http/services/auth.service";
import { getKeyValue } from "services/local-storage.service";

const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
};

interface SupportHistory {
    from: string;
    theme: string;
    date: string;
    body: string;
}

interface SupportContactDialogProps extends DialogProps {
    useruid: string;
}

export const SupportHistoryDialog = ({
    visible,
    onHide,
    useruid,
}: SupportContactDialogProps): JSX.Element => {
    const [supportHistoryData, setSupportHistoryData] = useState<SupportHistory[]>([]);
    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows[]>([]);

    useEffect(() => {
        const authUser: AuthUser = getKeyValue(LS_APP_USER);
        if (authUser && visible) {
            getSupportMessages(useruid).then((response) => {
                // eslint-disable-next-line no-console
                console.log(response);
                response && setSupportHistoryData(response);
            });
        }
    }, [useruid, visible]);

    const rowExpansionTemplate = (data: SupportHistory) => {
        return <div className='datatable-hidden'>{data.body}</div>;
    };

    const handleRowClick = (e: DataTableRowClickEvent) => {
        setExpandedRows([e.data]);
    };

    return (
        <DashboardDialog
            className='dialog__contact-support history-support'
            header='Support history'
            visible={visible}
            onHide={onHide}
        >
            <DataTable
                value={supportHistoryData}
                rowExpansionTemplate={rowExpansionTemplate}
                expandedRows={expandedRows}
                onRowToggle={(e: DataTableRowClickEvent) => setExpandedRows([e.data])}
                onRowClick={handleRowClick}
                rowHover
            >
                <Column header='From' field='from' />
                <Column header='Theme' field='theme' />
                <Column header='Date' field='date' />
            </DataTable>
        </DashboardDialog>
    );
};
