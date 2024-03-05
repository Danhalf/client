import { ReactElement, useEffect, useState } from "react";
import { RadioButton, RadioButtonChangeEvent, RadioButtonProps } from "primereact/radiobutton";
import "./index.css";
import { InputNumber, InputNumberChangeEvent, InputNumberProps } from "primereact/inputnumber";
import { Checkbox, CheckboxProps } from "primereact/checkbox";
import { InputText, InputTextProps } from "primereact/inputtext";
import { Calendar, CalendarProps } from "primereact/calendar";

type LabelPosition = "left" | "right" | "top";

interface DashboardRadioProps {
    radioArray: RadioButtonProps[];
}

interface CurrencyInputProps extends InputNumberProps {
    labelPosition?: LabelPosition;
}

interface PercentInputProps extends InputNumberProps {
    labelPosition?: LabelPosition;
}

export const DashboardRadio = ({ radioArray }: DashboardRadioProps): ReactElement => {
    const [radioValue, setRadioValue] = useState<string | number>("" || 0);

    return (
        <div className='flex flex-wrap gap-3 justify-content-between radio'>
            {radioArray.map(({ name, title, value }) => (
                <div
                    key={name}
                    className='flex align-items-center justify-content-between radio__item radio-item border-round'
                >
                    <div className='radio-item__input flex align-items-center justify-content-center'>
                        <RadioButton
                            inputId={name}
                            name={name}
                            value={value}
                            onChange={(e: RadioButtonChangeEvent) => setRadioValue(e.value)}
                            checked={radioValue === value}
                        />
                    </div>

                    <label htmlFor={name} className='radio-item__label'>
                        {title}
                    </label>
                </div>
            ))}
        </div>
    );
};

export const CurrencyInput = ({
    name,
    value,
    title,
    labelPosition = "left",
    ...props
}: CurrencyInputProps): ReactElement => {
    return (
        <div
            key={name}
            className={"flex align-items-center justify-content-between currency-item relative"}
        >
            <label className={`currency-item__label ${labelPosition === "top" && "label-top"}`}>
                {title}
            </label>
            <div className='currency-item__input flex justify-content-center'>
                <div className='currency-item__icon input-icon input-icon-left'>$</div>
                <InputNumber minFractionDigits={2} locale='en-US' value={value} {...props} />
            </div>
        </div>
    );
};

export const PercentInput = ({
    name,
    value,
    title,
    labelPosition = "left",
    ...props
}: PercentInputProps): ReactElement => {
    const [inputValue, setInputValue] = useState<number | null>(value || 0);
    return (
        <div
            key={name}
            className='flex align-items-center justify-content-between percent-item relative'
        >
            <label
                htmlFor={name}
                className={`percent-item__label ${labelPosition === "top" && "label-top"}`}
            >
                {title}
            </label>
            <div className='percent-item__input flex justify-content-center'>
                <InputNumber
                    {...props}
                    inputId={name}
                    minFractionDigits={2}
                    name={name}
                    value={inputValue}
                    onChange={(e: InputNumberChangeEvent) => setInputValue(e.value)}
                />
                <div className='percent-item__icon input-icon input-icon-right'>%</div>
            </div>
        </div>
    );
};

export const BorderedCheckbox = ({
    name,
    height = "50px",
    ...props
}: CheckboxProps): ReactElement => {
    return (
        <div
            style={{
                height,
            }}
            className='p-inputgroup flex-1 w-full align-items-center justify-content-between bordered-checkbox'
        >
            <label>{name}</label>
            <span className='p-inputgroup-addon'>
                <Checkbox {...props} />
            </span>
        </div>
    );
};

export const SearchInput = ({
    name,
    height = "50px",
    title,
    ...props
}: InputTextProps): ReactElement => {
    return (
        <div
            key={name}
            style={{
                height,
            }}
            className='flex align-items-center search-input'
        >
            <span className='p-float-label search-input__wrapper'>
                <InputText {...props} />
                <label className='float-label search-input__label'>{title}</label>
            </span>
            <div className='search-input__icon input-icon input-icon-right'>
                <i className='adms-search' />
            </div>
        </div>
    );
};

interface DateInputProps extends CalendarProps {
    date?: number;
}

export const DateInput = ({ date, name, value, ...props }: DateInputProps): ReactElement => {
    const [innerDate, setInnerDate] = useState<Date>(new Date());

    useEffect(() => {
        if (!!date) {
            const currentDate = new Date(Number(date));
            setInnerDate(currentDate);
        }
    }, [date]);

    const dateToNumber = (selectedDate: Date) => setInnerDate(selectedDate);
    return (
        <div
            key={name}
            className='flex align-items-center justify-content-between date-item relative'
        >
            <label htmlFor={name} className='date-item__label label-top'>
                {name}
            </label>
            <div className='date-item__input flex justify-content-center'>
                <Calendar
                    inputId={name}
                    value={innerDate}
                    onChange={(e) => dateToNumber(e.value as Date)}
                    {...props}
                />
                <div className='date-item__icon input-icon input-icon-right'>
                    <i className='adms-calendar' />
                </div>
            </div>
        </div>
    );
};
