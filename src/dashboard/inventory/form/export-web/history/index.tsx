import { observer } from "mobx-react-lite";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { ReactElement, useEffect } from "react";
import "./index.css";
import { getInventoryWebInfo } from "http/services/inventory-service";
import { useParams } from "react-router-dom";

export const ExportWebHistory = observer((): ReactElement => {
    const { id } = useParams();

    useEffect(() => {
        id && getInventoryWebInfo(id);
    }, [id]);
    return (
        <div className='grid export-web-history row-gap-2'>
            <div className='col-12'>
                <DataTable
                    className='mt-6 export-web-history__table'
                    value={[]}
                    emptyMessage='No exports yet.'
                >
                    <Column header='Date' />
                    <Column header='Service' />
                    <Column header='List price' />
                    <Column header='Status' />
                </DataTable>
            </div>
        </div>
    );
});
