import { Checkbox } from "primereact/checkbox";
import { useState } from "react";
import "./index.css";

export const VehicleOptions = (): JSX.Element => {
    const options = [
        { name: "A/C", value: 0 },
        { name: "AM/FM Stereo", value: 0 },
        { name: "All Wheel Drive", value: 0 },
        { name: "Aluminum Alloy Wheels", value: 1 },
        { name: "Android Auto", value: 1 },
        { name: "Anti-Lock Brakes", value: 1 },
        { name: "Anti-Skid Control", value: 1 },
        { name: "Apple Car Play", value: 1 },
        { name: "Automatic Climate Control", value: 1 },
        { name: "CD Changer", value: 1 },
        { name: "Cassette Player", value: 1 },
        { name: "Cruise Control", value: 1 },
        { name: "Fog Lights", value: 1 },
        { name: "Four Wheel Drive", value: 1 },
        { name: "Leather Upholstry", value: 1 },
        { name: "MoonRoof", value: 1 },
        { name: "Navigation System", value: 1 },
        { name: "Overhead Console", value: 1 },
        { name: "Power  Steering", value: 1 },
        { name: "Power Door Locks", value: 1 },
        { name: "Power Seats", value: 1 },
        { name: "Power Windows", value: 1 },
        { name: "Rear Window Defogger", value: 1 },
        { name: "Rear Window Wiper", value: 1 },
        { name: "Remote Keyless Entry", value: 1 },
        { name: "Sun Roof", value: 1 },
        { name: "Sunscreen Glass", value: 1 },
        { name: "Tinted Windows", value: 1 },
        { name: "Convertable Top", value: 1 },
        { name: "User  Defined1", value: 1 },
        { name: "User  Defined2", value: 1 },
        { name: "User  Defined3", value: 1 },
        { name: "User  Defined4", value: 1 },
    ];
    const [selectedOptions, setSelectedOptions] = useState([options[1]]);

    const onCategoryChange = (e: any) => {
        let _selectedOptions = [...selectedOptions];

        if (e.checked) _selectedOptions.push(e.value);
        else _selectedOptions = _selectedOptions.filter((option) => option.value !== e.value.value);

        setSelectedOptions(_selectedOptions);
    };
    return (
        <>
            <div className='grid flex-column vehicle-options'>
                {options.map((option) => {
                    return (
                        <div key={option.name} className='vehicle-options__checkbox'>
                            <Checkbox
                                inputId={option.name}
                                name='option'
                                value={option}
                                onChange={onCategoryChange}
                                checked={selectedOptions.some(
                                    (item: any) => item.key === option.value
                                )}
                            />
                            <label htmlFor={option.name} className='ml-2'>
                                {option.name}
                            </label>
                        </div>
                    );
                })}
            </div>
        </>
    );
};
