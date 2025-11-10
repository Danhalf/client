import { ReactElement, useEffect, useRef, useState } from "react";
import { DataTable, DataTablePageEvent, DataTableSortEvent } from "primereact/datatable";
import { getUserRoles } from "http/services/users";
import { UserRole } from "common/models/users";
import { QueryParams } from "common/models/query-params";
import { Column } from "primereact/column";
import { DatatableQueries, initialDataTableQueries } from "common/models/datatable-queries";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "store/hooks";
import { Button } from "primereact/button";
import { ROWS_PER_PAGE } from "common/settings";
import { useToastMessage } from "common/hooks";
import { Loader } from "dashboard/common/loader";
import "./index.css";
import { ConfirmModal } from "dashboard/common/dialog/confirm";
import { DataTableColumnResizeEndEvent } from "primereact/datatable";
import { useUserProfileSettings } from "common/hooks/useUserProfileSettings";
import { USERS_PAGE } from "common/constants/links";
import { UsersUserSettings } from "common/models/user";
import { TruncatedText } from "dashboard/common/display";

const PAGINATOR_HEIGHT = 86;
const TABLE_HEIGHT = `calc(100% - ${PAGINATOR_HEIGHT}px)`;

enum USER_ROLE_MODAL_MESSAGE {
    COPY_ROLE = "Are you sure you want to copy this role?",
    DELETE_ROLE = "Are you sure you want to delete this role?",
}

export const UsersRoles = observer((): ReactElement => {
    const userStore = useStore().userStore;
    const { authUser } = userStore;
    const [userRoles, setUserRoles] = useState<UserRole[]>([]);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [lazyState, setLazyState] = useState<DatatableQueries>(initialDataTableQueries);
    const dataTableRef = useRef<DataTable<UserRole[]>>(null);
    const [columnWidths, setColumnWidths] = useState<{ field: string; width: number }[]>([]);
    const { serverSettings, setModuleSettings } = useUserProfileSettings<
        UsersUserSettings,
        { field: string; header?: unknown }
    >("users", [
        { field: "roleName", header: "Role name" },
        { field: "createdByUsername", header: "Created by" },
        { field: "created", header: "Date" },
    ]);
    const { showError } = useToastMessage();
    const navigate = useNavigate();
    const [confirmVisible, setConfirmVisible] = useState<boolean>(false);
    const [selectedUserRole, setSelectedUserRole] = useState<UserRole | null>(null);

    const handleGetUserRoles = async (params?: QueryParams) => {
        if (!authUser) return;
        setIsLoading(true);
        const response = await getUserRoles(authUser.useruid, params);

        if (response && Array.isArray(response)) {
            setTotalRecords(response.length);
            setUserRoles(response);
        } else {
            showError(response?.error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        handleGetUserRoles();
    }, []);

    useEffect(() => {
        if (dataTableRef.current) {
            const table = dataTableRef.current.getTable();
            const columns = table.querySelectorAll("th");
            const columnWidths = Array.from(columns).map((column, index) => {
                return {
                    field: `column_${index}`,
                    width: column.offsetWidth,
                };
            });
            setColumnWidths(columnWidths);
        }
    }, [userRoles]);

    const pageChanged = (event: DataTablePageEvent) => {
        setLazyState(event);
    };

    const sortData = (event: DataTableSortEvent) => {
        setLazyState(event);
    };

    const handleColumnResize = (event: DataTableColumnResizeEndEvent) => {
        if (event.column.props.field) {
            const newColumnWidth = {
                [event.column.props.field as string]: event.element.offsetWidth,
            };
            setModuleSettings({
                columnWidth: {
                    ...serverSettings?.users?.columnWidth,
                    ...newColumnWidth,
                },
            });
        }
    };

    const handleAddNewUserRole = () => {
        navigate(USERS_PAGE.ROLES_CREATE());
    };

    const roleNameColumn = (data: UserRole) => {
        return (
            <TruncatedText
                withTooltip={true}
                tooltipOptions={{
                    position: "mouse",
                    content: data.rolename,
                }}
                data-field='rolename'
                text={data.rolename}
            />
        );
    };

    return (
        <div className='grid'>
            <div className='col-12'>
                <div className='card roles'>
                    <div className='card-header'>
                        <h2 className='card-header__title roles__title uppercase m-0'>Roles</h2>
                    </div>
                    <div className='card-content'>
                        <div className='grid'>
                            <div className='col-12'>
                                <Button
                                    className='p-button new-role-button ml-auto'
                                    onClick={handleAddNewUserRole}
                                >
                                    New Role
                                </Button>
                            </div>
                            <div className='col-12'>
                                {isLoading ? (
                                    <div className='dashboard-loader__wrapper'>
                                        <Loader />
                                    </div>
                                ) : (
                                    <DataTable
                                        ref={dataTableRef}
                                        showGridlines
                                        value={userRoles}
                                        lazy
                                        paginator
                                        scrollable
                                        scrollHeight='70vh'
                                        first={lazyState.first}
                                        rows={lazyState.rows}
                                        rowsPerPageOptions={ROWS_PER_PAGE}
                                        totalRecords={totalRecords || 1}
                                        onPage={pageChanged}
                                        onSort={sortData}
                                        sortOrder={lazyState.sortOrder}
                                        sortField={lazyState.sortField}
                                        resizableColumns
                                        onColumnResizeEnd={handleColumnResize}
                                        rowClassName={() =>
                                            "hover:text-primary cursor-pointer users-table-row"
                                        }
                                        pt={{
                                            resizeHelper: {
                                                style: {
                                                    maxHeight: TABLE_HEIGHT,
                                                },
                                            },
                                        }}
                                    >
                                        <Column
                                            bodyStyle={{ textAlign: "center" }}
                                            resizeable={false}
                                            body={({ roleuid }: UserRole) => {
                                                return (
                                                    <Button
                                                        text
                                                        className='table-edit-button'
                                                        icon='adms-edit-item'
                                                        tooltip='Edit role'
                                                        tooltipOptions={{ position: "mouse" }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(
                                                                USERS_PAGE.ROLES_EDIT(roleuid)
                                                            );
                                                        }}
                                                    />
                                                );
                                            }}
                                            pt={{
                                                root: {
                                                    style: {
                                                        width: "40px",
                                                    },
                                                },
                                            }}
                                        />
                                        <Column
                                            field='rolename'
                                            header='Role name'
                                            sortable
                                            body={roleNameColumn}
                                            pt={{
                                                root: {
                                                    style: {
                                                        width: serverSettings?.users?.columnWidth?.[
                                                            "rolename"
                                                        ],
                                                        maxWidth:
                                                            serverSettings?.users?.columnWidth?.[
                                                                "rolename"
                                                            ],
                                                    },
                                                },
                                            }}
                                        />
                                        <Column
                                            field='rolename'
                                            header='Role'
                                            sortable
                                            resizeable={false}
                                            body={(data: UserRole) => {
                                                return (
                                                    <span data-field='rolename'>
                                                        {data.rolename}
                                                    </span>
                                                );
                                            }}
                                            pt={{
                                                root: {
                                                    style: {
                                                        width: serverSettings?.users?.columnWidth?.[
                                                            "rolename"
                                                        ],
                                                        maxWidth:
                                                            serverSettings?.users?.columnWidth?.[
                                                                "rolename"
                                                            ],
                                                    },
                                                },
                                            }}
                                        />
                                        <Column
                                            bodyStyle={{ textAlign: "center" }}
                                            body={(data: UserRole) => {
                                                return (
                                                    <>
                                                        <Button
                                                            text
                                                            className='table-copy-button'
                                                            icon='adms-copy-item'
                                                            tooltip='Copy role'
                                                            tooltipOptions={{ position: "mouse" }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                            }}
                                                        />
                                                        <Button
                                                            text
                                                            className='table-delete-button'
                                                            icon='adms-delete-item'
                                                            tooltip='Delete role'
                                                            tooltipOptions={{ position: "mouse" }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                            }}
                                                        />
                                                    </>
                                                );
                                            }}
                                            pt={{
                                                root: {
                                                    className: "border-left-none",
                                                    style: {
                                                        width: "120px",
                                                    },
                                                },
                                            }}
                                        />
                                    </DataTable>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {selectedUserRole ? (
                <ConfirmModal
                    visible={confirmVisible}
                    onHide={() => setConfirmVisible(false)}
                    icon='adms-warning'
                    title={USER_ROLE_MODAL_MESSAGE.COPY_ROLE}
                    bodyMessage={USER_ROLE_MODAL_MESSAGE.COPY_ROLE}
                    confirmAction={() => {}}
                    rejectAction={() => setConfirmVisible(false)}
                    rejectLabel='Cancel'
                    acceptLabel='Confirm'
                    className='users-confirm-dialog'
                />
            ) : null}
        </div>
    );
});
