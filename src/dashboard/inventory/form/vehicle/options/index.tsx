import { Checkbox } from "primereact/checkbox";
import { ReactElement, useEffect, useState } from "react";
import "./index.css";
import { ListData, getInventoryOptionsList } from "http/services/inventory-service";
import { useStore } from "store/hooks";
import { observer } from "mobx-react-lite";

export const VehicleOptions = observer((): ReactElement => {
    const store = useStore().inventoryStore;

    const { intentoryOptions, changeInventoryOptions } = store;
    const [options, setOptions] = useState<ListData[]>([]);

    useEffect(() => {
        getInventoryOptionsList().then((response) => {
            response && setOptions(response);
        });
    }, []);

    // const [selectedOptions, setSelectedOptions] = useState(
    //     options.filter((option) => option.value === 1)
    // );

    // const onOptionsChange = (e: any) => {
    //     const updatedOptions = selectedOptions.includes(e.value)
    //         ? selectedOptions.filter((option) => option !== e.value)
    //         : [...selectedOptions, e.value];

    //     setSelectedOptions(updatedOptions);
    // };

    return (
        <>
            <div className='grid flex-column vehicle-options'>
                {options.map((option) => (
                    <div
                        key={option.name}
                        className='vehicle-options__checkbox flex align-items-center'
                    >
                        <Checkbox
                            inputId={option.name}
                            name={option.name}
                            onChange={() => changeInventoryOptions(option.name)}
                            checked={intentoryOptions.includes(option.name)}
                        />
                        <label htmlFor={option.name} className='ml-2'>
                            {option.name}
                        </label>
                    </div>
                ))}
            </div>
        </>
    );
});
