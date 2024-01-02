import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import "./index.css";
import { DashboardRadio } from "dashboard/common/form/inputs";
import { Slider, SliderChangeEvent } from "primereact/slider";
import { ChangeEvent, useState } from "react";

interface SettingsStockNewProps {
    settings?: any;
    radioSettings: {
        name: string;
        title: string;
        value: number;
    }[];
}

export const SettingsStockNew = ({ settings, radioSettings }: SettingsStockNewProps) => {
    const [value, setValue] = useState<number>(5);
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
            <div className='flex my-4'>
                <label htmlFor={settings} className='ml-2'>
                    Fixed digits
                </label>
                <div className='flex-1 ml-8'>
                    <InputText
                        value={String(value)}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setValue(Number(e.target.value))
                        }
                        className='w-full'
                    />
                    <Slider
                        value={value}
                        onChange={(e: SliderChangeEvent) => setValue(Number(e.value))}
                        max={10}
                        className='w-full'
                    />
                </div>
            </div>
        </div>
    );
};
