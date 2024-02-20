import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { ReactElement } from "react";

export const PrintForms = (): ReactElement => {
    return (
        <div className='grid export-web-history row-gap-2'>
            <div className='col-12'>
                <DataTable
                    className='mt-6 export-web-history__table'
                    value={[]}
                    emptyMessage='No exports yet.'
                >
                    <Column field='created' header='' />
                    <Column field='servicetype' header='Form' />
                    <Column field='listprice' header='Action' />
                </DataTable>
            </div>
        </div>
    );
};
