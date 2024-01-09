import { Checkbox } from "primereact/checkbox";
import { useState } from "react";
import "./index.css";

export const VehicleChecks = (): JSX.Element => {
    const topChecks = [
        { name: "AutoCheck done", value: 1 },
        { name: "State inspection Performed", value: 1 },
        { name: "Oil and Filter inspected and changed", value: 0 },
    ];
    const bottomChecks = [
        { name: "User defined inspection", value: 1 },
        { name: "User defined inspection", value: 0 },
        { name: "User defined inspection", value: 1 },
        { name: "User defined inspection", value: 0 },
        { name: "User defined inspection", value: 1 },
        { name: "User defined inspection", value: 0 },
        { name: "User defined inspection", value: 1 },
        { name: "User defined inspection", value: 0 },
        { name: "User defined inspection", value: 1 },
        { name: "User defined inspection", value: 0 },
    ];
    const [selectedTopCheck, setSelectedTopCheck] = useState(
        topChecks.filter((topCheck) => topCheck.value === 1)
    );
    const [selectedBottomCheck, setSelectedBottomCheck] = useState(
        bottomChecks.filter((bottomCheck) => bottomCheck.value === 1)
    );

    const onTopCheckChange = (e: any) => {
        const updatedTopCheck = selectedTopCheck.includes(e.value)
            ? selectedTopCheck.filter((option) => option !== e.value)
            : [...selectedTopCheck, e.value];

        setSelectedTopCheck(updatedTopCheck);
    };

    return (
        <div className='grid flex-column vehicle-checks'>
            <div className='grid flex-column vehicle-checks__top'>
                {topChecks.map((topCheck) => (
                    <div
                        key={topCheck.name}
                        className='vehicle-checks__checkbox flex align-items-center'
                    >
                        <Checkbox
                            inputId={topCheck.name}
                            name='topCheck'
                            onChange={onTopCheckChange}
                            checked={selectedTopCheck.includes(topCheck)}
                        />
                        <label htmlFor={topCheck.name} className='ml-2'>
                            {topCheck.name}
                        </label>
                    </div>
                ))}
            </div>
            <div className='grid flex-column vehicle-checks__bottom'>
                {bottomChecks.map((bottomCheck) => (
                    <div
                        key={bottomCheck.name}
                        className='vehicle-checks__checkbox flex align-items-center'
                    >
                        <Checkbox
                            inputId={bottomCheck.name}
                            name='bottomCheck'
                            onChange={onTopCheckChange}
                            checked={selectedBottomCheck.includes(bottomCheck)}
                        />
                        <label htmlFor={bottomCheck.name} className='ml-2'>
                            {bottomCheck.name}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};
