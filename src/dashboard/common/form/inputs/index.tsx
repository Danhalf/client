import { useState } from "react";
import { RadioButton, RadioButtonChangeEvent, RadioButtonProps } from "primereact/radiobutton";
import "./index.css";

interface DashboardRadioProps {
    radioArray: RadioButtonProps[];
}

export const DashboardRadio = ({ radioArray }: DashboardRadioProps): JSX.Element => {
    const [radioValue, setRadioValue] = useState<string | number>("" || 0);

    return (
        <div className='flex flex-wrap gap-3 justify-content-between dashboard-radio'>
            {radioArray.map(({ name, title, value }) => (
                <div
                    key={name}
                    className='flex align-items-center justify-content-between dashboard-radio__item radio-item border-round'
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
