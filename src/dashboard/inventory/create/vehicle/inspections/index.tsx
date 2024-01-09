import { ReactElement } from "react";
import { Dropdown } from "primereact/dropdown";

export const VehicleInspections = (): ReactElement => {
    return (
        <div className='grid vehicle-inspections row-gap-2'>
            <div className='col-6'>
                <Dropdown
                    optionLabel='name'
                    placeholder='Inspection Number'
                    className='w-full vehicle-description__dropdown'
                />
            </div>

            <div className='col-3'>
                <Dropdown
                    optionLabel='name'
                    placeholder='Date'
                    className='w-full vehicle-description__dropdown'
                />
            </div>
            <div className='col-3'>
                <Dropdown
                    optionLabel='name'
                    placeholder='Drive Line'
                    className='w-full vehicle-description__dropdown'
                />
            </div>

            <div className='col-4'>
                <Dropdown
                    optionLabel='name'
                    placeholder='Cylinders'
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
