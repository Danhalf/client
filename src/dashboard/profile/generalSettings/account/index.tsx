import { CurrencyInput, DashboardRadio, PercentInput } from "dashboard/common/form/inputs";
import { InputText } from "primereact/inputtext";
import { Slider, SliderChangeEvent } from "primereact/slider";
import { useState, ChangeEvent } from "react";
import "./index.css";
import { InputNumber, InputNumberChangeEvent } from "primereact/inputnumber";
import { SettingsSection } from "dashboard/profile/generalSettings/common/section";
import { TabPanel, TabView } from "primereact/tabview";
import { RadioButtonProps } from "primereact/radiobutton";

const ACCOUNT_NUMBER_OPTIONS: RadioButtonProps[] = [
    {
        name: "accountSequentialNumber",
        title: "Sequential Number",
        value: 0,
    },
    {
        name: "accountStockNumber",
        title: "Stock Number",
        value: 1,
    },
];

export const SettingsAccount = () => {
    const [valueDigits, setValueDigits] = useState<number>(2);
    const [value, setValue] = useState<number>(5);
    const [activeTab, setActiveTab] = useState(0);
    const [accountNumberType, setAccountNumberType] = useState(0);

    return (
        <SettingsSection title='Account Settings' className='settings-account'>
            <TabView
                className='settings-account__tabs'
                activeIndex={activeTab}
                onTabChange={(e) => setActiveTab(e.index)}
            >
                <TabPanel header='Account number'>
                    <div className='grid'>
                        <div className='col-12'>
                            <DashboardRadio
                                radioArray={ACCOUNT_NUMBER_OPTIONS}
                                initialValue={accountNumberType}
                                onChange={(v) => {
                                    if (v !== null) {
                                        setAccountNumberType(Number(v));
                                    }
                                }}
                            />
                        </div>
                        <div className='col-12 py-0'>
                            <hr className='form-line' />
                        </div>
                        <div className='col-3'>
                            <span className='p-float-label'>
                                <InputText className='settings-account__input' />
                                <label className='float-label'>Prefix</label>
                            </span>
                        </div>
                        <div className='col-3'>
                            <span className='p-float-label'>
                                <InputNumber
                                    value={valueDigits}
                                    max={10}
                                    onChange={(e: InputNumberChangeEvent) =>
                                        setValueDigits(Number(e.value))
                                    }
                                    className='w-full'
                                />
                                <Slider
                                    value={valueDigits}
                                    onChange={(e: SliderChangeEvent) =>
                                        setValueDigits(Number(e.value))
                                    }
                                    max={10}
                                    className='w-full'
                                />
                                <label className='float-label'>Fixed digits</label>
                            </span>
                        </div>
                        <div className='col-3'>
                            <span className='p-float-label'>
                                <InputText className='settings-account__input' />
                                <label className='float-label'>Suffix</label>
                            </span>
                        </div>
                        <div className='col-3'>
                            <span className='p-float-label'>
                                <InputText
                                    value={"0"}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {}}
                                    className='settings-account__input'
                                />
                                <label className='settings-account__label float-label'>
                                    Start number (starts from 0 by default)
                                </label>
                            </span>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel header='Late fee options'>
                    <div className='grid settings-account__late-fee-row'>
                        <div className='col-3'>
                            <CurrencyInput title='Late fee (min)' labelPosition='top' />
                        </div>
                        <div className='col-3'>
                            <CurrencyInput title='Late fee (max)' labelPosition='top' />
                        </div>
                        <div className='col-3'>
                            <span className='p-float-label settings-account__grace-period'>
                                <InputNumber
                                    className='settings-account__input'
                                    max={10}
                                    value={value}
                                    onChange={(e: InputNumberChangeEvent) =>
                                        setValue(Number(e.value))
                                    }
                                />
                                <Slider
                                    value={value}
                                    onChange={(e: SliderChangeEvent) => setValue(Number(e.value))}
                                    max={10}
                                    className='w-full'
                                />
                                <label className='float-label'>Late fee grace period</label>
                            </span>
                        </div>
                        <div className='col-3'>
                            <PercentInput
                                className='settings-account__input'
                                title='Late fee percentage'
                                labelPosition='top'
                            />
                        </div>
                    </div>
                </TabPanel>
            </TabView>
        </SettingsSection>
    );
};
