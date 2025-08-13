import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { useState } from "react";
import { Button } from "primereact/button";
import { useStore } from "store/hooks";
import { observer } from "mobx-react-lite";
import { SalesmanSelectDialog } from "dashboard/deals/form/washout/deal-profit/commission/salesman-select-dialog";
import { DealProfitItem, INCLUDE_OPTIONS } from "dashboard/deals/form/washout/deal-profit/index";
import { DashboardRadio } from "dashboard/common/form/inputs";
import { RadioButtonProps } from "primereact/radiobutton";

const COMMISSION_2_OPTIONS: RadioButtonProps[] = [
    { name: "figureAfterCommission", title: "Figure After Commission", value: 0 },
    { name: "splitCommission1InHalf", title: "Split Commission 1 in half", value: 1 },
    { name: "figureSeparately", title: "Figure Separately", value: 2 },
];

export const DealProfitCommission = observer(() => {
    const { dealWashout, changeDealWashout } = useStore().dealStore;

    const [defaultCommission, setDefaultCommission] = useState<boolean>(false);

    const [salesmanSelectDialogVisible, setSalesmanSelectDialogVisible] = useState<boolean>(false);
    const [manager, setManager] = useState<string>("");
    const [salesmanFirst, setSalesmanFirst] = useState<string>("");
    const [salesmanSecond, setSalesmanSecond] = useState<string>("");
    const [managerOverride, setManagerOverride] = useState<boolean>(false);
    const [s1, setS1] = useState<boolean>(false);
    const [s2, setS2] = useState<boolean>(false);
    const [includeManagerOverride, setIncludeManagerOverride] = useState<INCLUDE_OPTIONS | null>(
        null
    );

    return (
        <Card className='profit-card profit-commission'>
            <div className='profit-card__header profit-commission__header'>
                <div className='profit-commission__header-title'>Commission Settings</div>
            </div>
            <div className='profit-card__body profit-commission__body'>
                <div className='profit-commission__settings commission-settings'>
                    <div className='commission-settings__label'>Commission 2 Options:</div>

                    <DashboardRadio
                        radioArray={COMMISSION_2_OPTIONS}
                        wrapperClassName='commission-settings__radio'
                        initialValue={dealWashout.Comm2Options}
                        onChange={(value) => {
                            changeDealWashout("Comm2Options", String(value));
                        }}
                        children={
                            <div className='commission-settings__checkbox'>
                                <Checkbox
                                    inputId='set-default'
                                    checked={defaultCommission}
                                    onChange={({ checked }) => {
                                        setDefaultCommission(!!checked);
                                    }}
                                />
                                <label htmlFor='set-default'>Set this as the Default</label>
                            </div>
                        }
                    />
                </div>
            </div>
            <Button
                icon='pi pi-user-plus'
                tooltip='Select Salesman'
                className='profit-commission__salesman-button'
                onClick={() => setSalesmanSelectDialogVisible(true)}
            />

            <div className='profit-card__header profit-commission__header'>
                <div className='profit-commission__header-subtitle'>Commission Worksheet</div>
            </div>

            <div className='profit-card__body profit-commission__body'>
                <div className='profit-commission__worksheet'>
                    <DealProfitItem
                        title='Commission Base:'
                        className='profit-commission__item--blue'
                        value={Number(dealWashout.CommissionBase) || 0}
                        currency='$'
                        justify='start'
                        fieldName='commissionBase'
                        onChange={({ value }) => {
                            changeDealWashout("CommissionBase", String(value));
                        }}
                    />
                    <DealProfitItem
                        title='Manager Override:'
                        value={Number(dealWashout.CommissionMgr) || 0}
                        withInput
                        justify='start'
                        includes
                        includeCheckbox={includeManagerOverride}
                        includeCheckboxOnChange={setIncludeManagerOverride}
                        checkboxValue={managerOverride}
                        checkboxOnChange={setManagerOverride}
                        fieldName='managerOverride'
                        onChange={({ value }) => {
                            changeDealWashout("CommissionMgr", String(value));
                        }}
                    />
                    <DealProfitItem
                        title='S1: (None Selected)'
                        value={Number(dealWashout.Commission1) || 0}
                        withInput
                        justify='start'
                        includes
                        checkboxValue={s1}
                        checkboxOnChange={setS1}
                        fieldName='s1'
                        onChange={({ value }) => {
                            changeDealWashout("Commission1", String(value));
                        }}
                    />
                    <DealProfitItem
                        title='S2: (None Selected)'
                        value={Number(dealWashout.Commission2) || 0}
                        withInput
                        justify='start'
                        includes
                        checkboxValue={s2}
                        checkboxOnChange={setS2}
                        fieldName='s2'
                        onChange={({ value }) => {
                            changeDealWashout("Commission2", String(value));
                        }}
                    />

                    <div className='splitter my-0'>
                        <hr className='splitter__line flex-1' />
                    </div>

                    <DealProfitItem
                        title='(=) Commission Profit:'
                        value={Number(dealWashout.CommissionTotal) || 0}
                        currency='$'
                        justify='start'
                        className='profit-commission__item--blue'
                        fieldName='commissionProfit'
                        onChange={({ value }) => {
                            changeDealWashout("CommissionTotal", String(value));
                        }}
                    />
                </div>
            </div>

            {salesmanSelectDialogVisible && (
                <SalesmanSelectDialog
                    manager={manager}
                    salesmanFirst={salesmanFirst}
                    salesmanSecond={salesmanSecond}
                    onManagerChange={setManager}
                    onSalesmanFirstChange={setSalesmanFirst}
                    onSalesmanSecondChange={setSalesmanSecond}
                    visible={salesmanSelectDialogVisible}
                    onHide={() => setSalesmanSelectDialogVisible(false)}
                />
            )}
        </Card>
    );
});
