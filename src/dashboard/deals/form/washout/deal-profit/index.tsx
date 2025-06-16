import { DealTotalsProfit } from "./totals-profit";
import { DealProfitCommission } from "./commission";
import { DealFIProfit } from "./FI-profit";
import { DealVehicleProfit } from "./vehicle-profit";
import "./index.css";
import { observer } from "mobx-react-lite";
import { InputNumberProps } from "primereact/inputnumber";
import { ReactElement, useState } from "react";
import { CurrencyInput } from "dashboard/common/form/inputs";

interface DealProfitItemProps extends InputNumberProps {
    numberSign?: "+" | "-";
    withInput?: boolean;
    fieldName: string;
}

export const DealProfitItem = observer(
    ({
        title,
        numberSign,
        fieldName,
        withInput = false,
        ...props
    }: DealProfitItemProps): ReactElement => {
        const [fieldChanged, setFieldChanged] = useState(false);

        const handleChange = (event: any) => {
            setFieldChanged(true);
            props.onChange?.(event);
        };

        return (
            <div className='deal-profit__item'>
                <label className='deal-profit__label'>
                    {numberSign && <span className='deal-profit__sign'>({numberSign})</span>}
                    &nbsp;{title}
                </label>
                {withInput ? (
                    <CurrencyInput
                        className={`deal-profit__input ${fieldChanged ? "input-change" : ""}`}
                        {...props}
                        onChange={handleChange}
                    />
                ) : (
                    <div className='deal-profit__value'>{props.value}</div>
                )}
            </div>
        );
    }
);

export const DealProfit = () => {
    return (
        <div className='deal-profit grid'>
            <div className='col-6'>
                <DealVehicleProfit />
            </div>
            <div className='col-6'>
                <DealProfitCommission />
            </div>
            <div className='col-9'>
                <DealFIProfit />
            </div>
            <div className='col-3'>
                <DealTotalsProfit />
            </div>
        </div>
    );
};
