import { observer } from "mobx-react-lite";
import { Checkbox } from "primereact/checkbox";
import { ReactElement, useState } from "react";
import "./index.css";
import { CurrencyInput } from "dashboard/common/form/inputs";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useStore } from "store/hooks";

export const ExportWebPrice = observer((): ReactElement => {
    const store = useStore().inventoryStore;
    const {
        inventoryExportWeb: {
            ModelCode,
            CostPrice,
            ListPrice,
            SpecialPrice,
            ExtraPrice1,
            ExtraPrice2,
            ExtraPrice3,
        },
        changeExportWeb,
    } = store;
    const [checked, setChecked] = useState<boolean>(true);
    return (
        <div className='grid export-web-price row-gap-2'>
            <label className='cursor-pointer export-web-price__label'>
                <Checkbox
                    checked={checked}
                    onChange={() => {
                        setChecked(!checked);
                    }}
                    className='export-web-price__checkbox'
                />
                Export to Web
            </label>

            <hr className='form-line' />

            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText
                        className='export-web-price__text-input w-full'
                        value={ModelCode}
                        onChange={({ target: { value } }) =>
                            changeExportWeb({ key: "ModelCode", value })
                        }
                    />
                    <label className='float-label'>Model Code</label>
                </span>
            </div>
            <div className='col-3'>
                <CurrencyInput
                    value={ListPrice}
                    labelPosition='top'
                    title='List price (required)'
                    onChange={({ value }) => value && changeExportWeb({ key: "ListPrice", value })}
                />
            </div>
            <div className='col-3'>
                <CurrencyInput
                    value={SpecialPrice}
                    labelPosition='top'
                    title='Special price'
                    onChange={({ value }) =>
                        value && changeExportWeb({ key: "SpecialPrice", value })
                    }
                />
            </div>
            <div className='col-3'>
                <CurrencyInput
                    value={CostPrice}
                    labelPosition='top'
                    title='Cost price'
                    onChange={({ value }) => value && changeExportWeb({ key: "CostPrice", value })}
                />
            </div>
            <div className='col-3'>
                <CurrencyInput
                    value={ExtraPrice1}
                    labelPosition='top'
                    title='Extra price 1'
                    onChange={({ value }) =>
                        value && changeExportWeb({ key: "ExtraPrice1", value })
                    }
                />
            </div>
            <div className='col-3'>
                <CurrencyInput
                    value={ExtraPrice2}
                    labelPosition='top'
                    title='Extra price 2'
                    onChange={({ value }) =>
                        value && changeExportWeb({ key: "ExtraPrice2", value })
                    }
                />
            </div>
            <div className='col-3'>
                <CurrencyInput
                    value={ExtraPrice3}
                    labelPosition='top'
                    title='Extra price 3'
                    onChange={({ value }) =>
                        value && changeExportWeb({ key: "ExtraPrice3", value })
                    }
                />
            </div>

            <hr className='form-line' />

            <div className='col-12'>
                <InputTextarea
                    placeholder='Dealer comments on vehicle'
                    className='w-full export-web-price__text-area'
                />
            </div>
        </div>
    );
});
