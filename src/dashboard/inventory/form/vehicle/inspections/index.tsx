import { ReactElement } from "react";
import { InputText } from "primereact/inputtext";
import { BorderedCheckbox, DateInput } from "dashboard/common/form/inputs";
import { observer } from "mobx-react-lite";
import { useStore } from "store/hooks";

export const VehicleInspections = observer((): ReactElement => {
    const store = useStore().inventoryStore;
    const { intentoryExtData } = store;
    return (
        <div className='grid vehicle-inspections row-gap-2'>
            <div className='col-6'>
                <InputText
                    value={intentoryExtData.inspNumber}
                    placeholder='Inspection Number'
                    className='w-full vehicle-inspections__dropdown'
                />
            </div>

            <div className='col-3'>
                <DateInput value={new Date(intentoryExtData.inspDate)} name='Date' />
            </div>
            <div className='col-3'>
                <BorderedCheckbox name='Emissions Check' checked={false} />
            </div>

            <div className='col-3'>
                <BorderedCheckbox name='Safety Check' checked={false} />
            </div>
            <div className='col-3'>
                <DateInput name='Sticker Exp. Date' />
            </div>
        </div>
    );
});
