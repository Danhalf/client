import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import "./index.css";
import { DashboardRadio } from "dashboard/common/form/inputs";

interface SettingsStockNewProps {
    settings?: any;
    radioSettings: {
        name: string;
        title: string;
        value: number;
    }[];
}

export const SettingsStockNew = ({ settings, radioSettings }: SettingsStockNewProps) => {
    return (
        <div className='stock-new'>
            <div className='text-lg pb-4 font-semibold'>Stock# for new inventory</div>
            <div className='flex align-items-center'>
                <Checkbox inputId={settings} name={settings} value={settings} checked />
                <label htmlFor={settings} className='ml-2'>
                    Sequental
                </label>
            </div>
            <div className='flex align-items-center justify-content-between'>
                <InputText placeholder='Prefix' className='stock-new__input' />
                <InputText placeholder='Suffix' className='stock-new__input' />
            </div>
            <DashboardRadio radioArray={radioSettings} />
        </div>
    );
};
