import { ReactElement } from "react";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { ROWS_PER_PAGE } from "common/settings";

export const ExportHistory = (): ReactElement => {
    return (
        <div className='card'>
            <div className='card-header'>
                <h2 className='card-header__title uppercase m-0'>History</h2>
            </div>
            <div className='card-content'>
                <div className='grid datatable-controls'>
                    <div className='col-12 export-web-controls'>
                        <Button
                            className='export-web-controls__button px-6 uppercase'
                            severity='success'
                            type='button'
                        >
                            Export now
                        </Button>
                        <Button
                            className='export-web-controls__button px-6 uppercase'
                            severity='success'
                            type='button'
                            tooltip='Add to history'
                        >
                            Add to
                            <i className='icon adms-calendar export-web-controls__button-icon' />
                        </Button>

                        <Button
                            severity='success'
                            type='button'
                            icon='icon adms-print'
                            tooltip='Print export to web form'
                        />
                        <Button
                            severity='success'
                            type='button'
                            icon='icon adms-blank'
                            tooltip='Download export to web form'
                        />
                    </div>
                </div>
                <div className='grid'>
                    <div className='col-12'>
                        <DataTable
                            showGridlines
                            lazy
                            paginator
                            scrollable
                            scrollHeight='70vh'
                            rowsPerPageOptions={ROWS_PER_PAGE}
                            reorderableColumns
                            resizableColumns
                            className='export-web-table'
                        >
                            <Column
                                bodyStyle={{ textAlign: "center" }}
                                reorderable={false}
                                pt={{
                                    root: {
                                        style: {
                                            width: "100px",
                                        },
                                    },
                                }}
                            />
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    );
};
