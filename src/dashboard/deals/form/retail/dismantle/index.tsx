import { BorderedCheckbox, DateInput } from "dashboard/common/form/inputs";
import { observer } from "mobx-react-lite";
import { InputText } from "primereact/inputtext";
import { ReactElement } from "react";

export const DealDismantle = observer((): ReactElement => {
    return (
        <div className='grid deal-dismantle row-gap-2'>
            <div className='col-3'>
                <DateInput name='Dismantled Date' />
            </div>

            <div className='splitter col-12'>
                <h3 className='splitter__title m-0 pr-3'>Components sold</h3>
                <hr className='splitter__line flex-1' />
            </div>

            <div className='col-3'>
                <BorderedCheckbox checked name='Engine' />
            </div>
            <div className='col-9'>
                <span className='p-float-label'>
                    <InputText />
                    <label className='float-label'>Comment</label>
                </span>
            </div>
            <div className='col-3'>
                <BorderedCheckbox checked name='Transmission' />
            </div>
            <div className='col-9'>
                <span className='p-float-label'>
                    <InputText />
                    <label className='float-label'>Comment</label>
                </span>
            </div>
            <div className='col-3'>
                <BorderedCheckbox checked name='Body' />
            </div>
            <div className='col-9'>
                <span className='p-float-label'>
                    <InputText />
                    <label className='float-label'>Comment</label>
                </span>
            </div>
            <div className='col-3'>
                <BorderedCheckbox checked name='Frame' />
            </div>
            <div className='col-9'>
                <span className='p-float-label'>
                    <InputText />
                    <label className='float-label'>Comment</label>
                </span>
            </div>
            <div className='col-3'>
                <BorderedCheckbox checked name='Other' />
            </div>
            <div className='col-9'>
                <span className='p-float-label'>
                    <InputText />
                    <label className='float-label'>Comment</label>
                </span>
            </div>
        </div>
    );
});
