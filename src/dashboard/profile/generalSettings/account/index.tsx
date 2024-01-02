import { CurrencyInput, PercentInput } from "dashboard/common/form/inputs";
import { InputText } from "primereact/inputtext";
import { Slider, SliderChangeEvent } from "primereact/slider";
import { useState, ChangeEvent } from "react";

interface SettingsAccountProps {
    settings?: any;
}

export const SettingsAccount = ({ settings }: SettingsAccountProps) => {
    const [value, setValue] = useState<number>(5);
    return (
        <div className='stock-new'>
            <div className='text-lg pb-4 font-semibold'>Account Settings</div>
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
            <div className='flex align-items-center justify-content-between'>
                <InputText placeholder='Prefix' className='stock-new__input' />
                <InputText placeholder='Suffix' className='stock-new__input' />
            </div>
            <div className='flex align-items-center justify-content-between'>
                <CurrencyInput title='Late fee (min)' />
                <CurrencyInput title='Late fee (max)' />
            </div>
            <div className='flex my-4'>
                <label htmlFor={settings} className='ml-2 wrap'>
                    Late fee grace period
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
            <div className='w-6'>
                <PercentInput title='Late fee percentage' />
            </div>
        </div>
    );
};
