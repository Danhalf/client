import { CurrencyInput, PercentInput } from "dashboard/common/form/inputs";
import { InputText } from "primereact/inputtext";
import { Slider, SliderChangeEvent } from "primereact/slider";
import { useState, ChangeEvent } from "react";
import "./index.css";

interface SettingsAccountProps {
    settings?: any;
}

export const SettingsAccount = ({ settings }: SettingsAccountProps) => {
    const [value, setValue] = useState<number>(5);
    return (
        <div className='account flex flex-column gap-4'>
            <div className='text-lg pb-4 font-semibold'>Account Settings</div>
            <div className='flex justify-content-between align-items-center'>
                <label htmlFor='account-start-number' className='start-number__label ml-2 wrap'>
                    Start number (starts from 0 by default)
                </label>
                <InputText
                    value={String(value)}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {}}
                    id='account-start-number'
                    className='start-number__input'
                />
            </div>
            <div className='flex'>
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
                <span className='p-float-label'>
                    <InputText id='account-prefix' className='account__input' />
                    <label htmlFor='account-prefix'>Prefix</label>
                </span>
                <span className='p-float-label'>
                    <InputText id='account-suffix' className='account__input' />
                    <label htmlFor='account-suffix'>Suffix</label>
                </span>
            </div>
            <div className='flex align-items-center justify-content-between'>
                <CurrencyInput title='Late fee (min)' />
                <CurrencyInput title='Late fee (max)' />
            </div>
            <div className='flex'>
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
