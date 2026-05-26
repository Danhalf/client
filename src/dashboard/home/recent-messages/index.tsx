import { Status, TotalListCount } from "common/models/base-response";
import { TOAST_LIFETIME } from "common/settings";
import { useToast } from "dashboard/common/toast";
import { SupportHistoryDialog } from "dashboard/profile/supportHistory";
import { getSupportMessages, SupportHistory } from "http/services/support.service";
import { Button } from "primereact/button";
import { Column, ColumnProps } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { ReactElement, useCallback, useEffect, useState } from "react";
import { useStore } from "store/hooks";
import "./index.css";

interface TableColumnProps extends ColumnProps {
    field: keyof SupportHistory;
}

const renderColumnsData: Pick<TableColumnProps, "header" | "field">[] = [
    { field: "username", header: "From" },
    { field: "topic", header: "Theme" },
    { field: "created", header: "Date" },
];

interface RecentMessagesProps {
    messagesShowCount?: number;
}

export const RecentMessages = ({ messagesShowCount = 2 }: RecentMessagesProps): ReactElement => {
    const store = useStore().userStore;
    const { authUser } = store;
    const toast = useToast();
    const [dialogActive, setDialogActive] = useState<boolean>(false);
    const [supportHistoryData, setSupportHistoryData] = useState<SupportHistory[]>([]);
    const [allMessagesCount, setAllMessagesCount] = useState<number>(0);

    const handleGetRecentMessages = useCallback(async () => {
        if (!authUser) return;

        const [totalCountResponse, messagesResponse] = await Promise.all([
            getSupportMessages(authUser.useruid, { total: 1 }),
            getSupportMessages(authUser.useruid, { top: messagesShowCount, type: "desc" }),
        ]);

        if (totalCountResponse && !Array.isArray(totalCountResponse)) {
            setAllMessagesCount((totalCountResponse as TotalListCount).total ?? 0);
        }

        if (Array.isArray(messagesResponse)) {
            setSupportHistoryData(messagesResponse);
        } else {
            messagesResponse?.error &&
                toast.current?.show({
                    severity: "error",
                    summary: Status.ERROR,
                    detail: messagesResponse.error,
                    life: TOAST_LIFETIME,
                });
        }
    }, [authUser, messagesShowCount, toast]);

    useEffect(() => {
        handleGetRecentMessages();
    }, [handleGetRecentMessages]);

    return (
        <div className='card h-full'>
            <div className='card-header'>
                <h2
                    className='card-header__title uppercase m-0 recent-messages__title'
                    onClick={() => setDialogActive(true)}
                >
                    Recent messages
                </h2>
            </div>
            <div className='card-content'>
                <DataTable
                    value={supportHistoryData}
                    emptyMessage='No messages found'
                    className='table-message'
                >
                    {renderColumnsData?.map(({ field, header }) => (
                        <Column
                            field={field}
                            header={header}
                            key={field}
                            body={(data: SupportHistory) => {
                                if (field === "topic") {
                                    return (
                                        <div
                                            className='white-space-nowrap 
                                            overflow-hidden 
                                            text-overflow-ellipsis 
                                            max-w-8rem'
                                        >
                                            {data[field]}
                                        </div>
                                    );
                                }
                                return data[field];
                            }}
                            headerClassName='cursor-default'
                        />
                    ))}
                </DataTable>
                {allMessagesCount > messagesShowCount && (
                    <div className='card-content__footer recent-messages__footer'>
                        <Button
                            onClick={() => setDialogActive(true)}
                            className='recent-messages__button messages-more'
                            label='See more...'
                            text
                        />
                    </div>
                )}
            </div>
            {authUser && (
                <SupportHistoryDialog
                    onHide={() => setDialogActive(false)}
                    visible={dialogActive}
                />
            )}
        </div>
    );
};
