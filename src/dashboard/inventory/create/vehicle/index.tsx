import { Button } from "primereact/button";
import "./index.css";

interface InventoryVehicleProps {
    menuIndex: number;
    itemsLength?: number;
    setMenuIndex: (index: number) => void;
}

export const InventoryVehicle = ({
    menuIndex,
    itemsLength,
    setMenuIndex,
}: InventoryVehicleProps): JSX.Element => {
    return (
        <>
            <div className='flex flex-grow-1'>General</div>
        </>
    );
};
