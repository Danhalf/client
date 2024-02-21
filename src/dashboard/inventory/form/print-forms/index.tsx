import { observable } from "mobx";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { ReactElement } from "react";
import { useStore } from "store/hooks";

export const PrintForms = observable((): ReactElement => {
    // const store = useStore().inventoryStore;
    // const {} = store;
    return (
        <div className='grid export-web-history row-gap-2'>
            <div className='col-12'>
                <DataTable
                    className='mt-6 export-web-history__table'
                    value={[]}
                    emptyMessage='No exports yet.'
                >
                    <Column field='checked' header='' />
                    <Column field='name' header='Form' />
                    <Column field='action' header='Action' />
                </DataTable>
            </div>
        </div>
    );
});
