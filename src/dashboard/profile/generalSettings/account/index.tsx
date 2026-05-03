import { CurrencyInput, DashboardRadio, PercentInput } from "dashboard/common/form/inputs";
import { InputText } from "primereact/inputtext";
import { Slider, SliderChangeEvent } from "primereact/slider";
import { useState } from "react";
import "./index.css";
import { InputNumber, InputNumberChangeEvent } from "primereact/inputnumber";
import { SettingsSection } from "dashboard/profile/generalSettings/common/section";
import { TabPanel, TabView } from "primereact/tabview";
import { RadioButtonProps } from "primereact/radiobutton";
import { observer } from "mobx-react-lite";
import { useStore } from "store/hooks";

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

export const SettingsAccount = observer(() => {
    const store = useStore().generalSettingsStore;
    const { settings, changeSettings } = store;
    const [activeTab, setActiveTab] = useState(0);

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
                                initialValue={settings.accountNumberStrategy ?? 0}
                                onChange={(v) => {
                                    if (v !== null) {
                                        changeSettings("accountNumberStrategy", Number(v));
                                    }
                                }}
                            />
                        </div>
                        <div className='col-12 py-0'>
                            <hr className='form-line' />
                        </div>
                        <div className='col-3'>
                            <span className='p-float-label'>
                                <InputText
                                    className='settings-account__input'
                                    value={settings.accountPrefix || ""}
                                    onChange={(e) =>
                                        changeSettings("accountPrefix", e.target.value)
                                    }
                                />
                                <label className='float-label'>Prefix</label>
                            </span>
                        </div>
                        <div className='col-3'>
                            <span className='p-float-label'>
                                <InputNumber
                                    value={settings.accountFixedDigits ?? 0}
                                    min={0}
                                    max={10}
                                    onChange={(e: InputNumberChangeEvent) =>
                                        changeSettings("accountFixedDigits", Number(e.value))
                                    }
                                    className='w-full'
                                />
                                <Slider
                                    value={settings.accountFixedDigits ?? 0}
                                    onChange={(e: SliderChangeEvent) =>
                                        changeSettings("accountFixedDigits", Number(e.value))
                                    }
                                    min={0}
                                    max={10}
                                    className='w-full'
                                />
                                <label className='float-label'>Fixed digits</label>
                            </span>
                        </div>
                        <div className='col-3'>
                            <span className='p-float-label'>
                                <InputText
                                    className='settings-account__input'
                                    value={settings.accountSuffix || ""}
                                    onChange={(e) =>
                                        changeSettings("accountSuffix", e.target.value)
                                    }
                                />
                                <label className='float-label'>Suffix</label>
                            </span>
                        </div>
                        <div className='col-3'>
                            <span className='p-float-label'>
                                <InputNumber
                                    value={settings.accountStartNumber ?? 0}
                                    min={0}
                                    onChange={(e: InputNumberChangeEvent) =>
                                        changeSettings("accountStartNumber", Number(e.value))
                                    }
                                    className='w-full'
                                />
                                <label className='settings-account__label float-label'>
                                    Start number
                                </label>
                            </span>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel header='Late fee options'>
                    <div className='grid settings-account__late-fee-row'>
                        <div className='col-3'>
                            <CurrencyInput
                                title='Late fee (min)'
                                labelPosition='top'
                                value={settings.accountLateFeeMin}
                                onChange={(e: InputNumberChangeEvent) =>
                                    changeSettings("accountLateFeeMin", Number(e.value))
                                }
                            />
                        </div>
                        <div className='col-3'>
                            <CurrencyInput
                                title='Late fee (max)'
                                labelPosition='top'
                                value={settings.accountLateFeeMax}
                                onChange={(e: InputNumberChangeEvent) =>
                                    changeSettings("accountLateFeeMax", Number(e.value))
                                }
                            />
                        </div>
                        <div className='col-3'>
                            <span className='p-float-label settings-account__grace-period'>
                                <InputNumber
                                    className='settings-account__input'
                                    min={0}
                                    max={10}
                                    value={settings.accountLateFeeGracePeriod ?? 0}
                                    onChange={(e: InputNumberChangeEvent) =>
                                        changeSettings("accountLateFeeGracePeriod", Number(e.value))
                                    }
                                />
                                <Slider
                                    value={settings.accountLateFeeGracePeriod ?? 0}
                                    onChange={(e: SliderChangeEvent) =>
                                        changeSettings("accountLateFeeGracePeriod", Number(e.value))
                                    }
                                    min={0}
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
                                value={settings.accountLateFeePercentage}
                                onChange={(e: InputNumberChangeEvent) =>
                                    changeSettings("accountLateFeePercentage", Number(e.value))
                                }
                            />
                        </div>
                    </div>
                </TabPanel>
            </TabView>
        </SettingsSection>
    );
});
