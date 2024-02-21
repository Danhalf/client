import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { ReactElement, useState } from "react";
import { useStore } from "store/hooks";
import "./index.css";

export const PrintForms = observer((): ReactElement => {
    const store = useStore().inventoryStore;
    const { printList } = store;

    const [selectedPrints, setSelectedPrints] = useState<any[] | null>(null);

    return (
        <div className='grid inventory-print row-gap-2'>
            <div className='col-12'>
                <DataTable
                    className='mt-6 inventory-print__table'
                    value={printList}
                    emptyMessage='No exports yet.'
                    selectionMode={"checkbox"}
                    selection={selectedPrints!}
                    onSelectionChange={(e: any) => setSelectedPrints(e.value)}
                    dataKey='index'
                >
                    <Column selectionMode='multiple' headerStyle={{ width: "3rem" }}></Column>
                    <Column field='name' header='Form' />
                    <Column
                        body={
                            <Button
                                className='p-button inventory-print__button'
                                outlined
                                icon='icon adms-print'
                            >
                                Print
                            </Button>
                        }
                        header='Action'
                        className='inventory-print__table-action'
                    />
                </DataTable>
            </div>
        </div>
    );
});
