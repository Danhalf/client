import { Dropdown } from "primereact/dropdown";
import { ReactElement } from "react";

export const VehicleDescription = (): ReactElement => {
    return (
        <div className='grid vehicle-description row-gap-2'>
            <div className='col-6'>
                <Dropdown
                    optionLabel='name'
                    placeholder='Transmission'
                    className='w-full vehicle-description__dropdown'
                />
            </div>

            <div className='col-6 flex justify-content-between gap-2'>
                <Dropdown
                    optionLabel='name'
                    placeholder='Type of Fuel (required)'
                    className='w-6 vehicle-description__dropdown'
                />
                <Dropdown
                    optionLabel='name'
                    placeholder='Drive Line'
                    className='w-6 vehicle-description__dropdown'
                />
            </div>

            <div className='col-4'>
                <Dropdown
                    optionLabel='name'
                    placeholder='Drive Line'
                    className='w-full vehicle-description__dropdown'
                />
            </div>

            <div className='col-8'>
                <Dropdown
                    optionLabel='name'
                    placeholder='Interior color'
                    className='w-full vehicle-description__dropdown'
                />
            </div>
        </div>
    );
};
