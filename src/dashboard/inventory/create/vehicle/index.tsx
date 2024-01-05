import { Button } from "primereact/button";
import "./index.css";

interface InventoryVehicleProps {
    menuIndex: number;
    itemsLength: number;
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
            <div className='flex justify-content-end gap-3'>
                <Button
                    onClick={() => setMenuIndex(menuIndex - 1)}
                    disabled={!menuIndex}
                    className='uppercase  px-6'
                    outlined
                >
                    Back
                </Button>
                <Button
                    onClick={() => setMenuIndex(menuIndex + 1)}
                    //   disabled={menuIndex >= itemsLength}
                    className='uppercase px-6'
                    outlined
                >
                    Next
                </Button>
                <Button
                    onClick={() => {}}
                    disabled={menuIndex !== itemsLength}
                    className='uppercase px-6'
                >
                    Save
                </Button>
            </div>
        </>
    );
};
