import { CompanySearch } from "dashboard/contacts/common/company-search";
import { Button } from "primereact/button";
import { ReactElement, Suspense } from "react";
import { useNavigate } from "react-router-dom";

import "./index.css";
import { DateInput, StateDropdown, TextInput } from "dashboard/common/form/inputs";
import { InventorySearch } from "dashboard/inventory/common/inventory-search";
import { InputTextarea } from "primereact/inputtextarea";

export const PrintForTestDrive = (): ReactElement => {
    const navigate = useNavigate();
    return (
        <Suspense>
            <div className='grid relative'>
                <Button
                    icon='pi pi-times'
                    className='p-button close-button'
                    onClick={() => navigate("/dashboard")}
                />
                <div className='col-12'>
                    <div className='card test-drive'>
                        <div className='card-header flex'>
                            <h2 className='card-header__title uppercase w-full m-0'>
                                Print (for test drive)
                            </h2>
                        </div>
                        <div className='card-content test-drive__card'>
                            <div className='grid test-drive__card-content row-gap-2'>
                                <div className='col-12 test-drive__subtitle'>Driver</div>

                                <div className='col-6'>
                                    <CompanySearch name='First Name' />
                                </div>
                                <div className='col-6'>
                                    <CompanySearch name='Last Name' />
                                </div>
                                <TextInput name='Phone Number' colWidth={4} />
                                <TextInput name='Driver License’s Number' colWidth={4} />
                                <StateDropdown name='DL’s State' colWidth={4} />
                                <DateInput name='DL’s Start Date' colWidth={6} />
                                <DateInput name='DL’s Exp. Date' colWidth={6} />

                                <div className='col-12 test-drive__subtitle'>Vehicle</div>

                                <div className='col-6'>
                                    <InventorySearch name='VIN' />
                                </div>
                                <div className='col-6'>
                                    <InventorySearch name='Make' />
                                </div>
                                <div className='col-6'>
                                    <InventorySearch name='Model' />
                                </div>
                                <TextInput name='Year' colWidth={6} />

                                <div className='col-12 test-drive__subtitle'>Dealer</div>

                                <div className='col-4'>
                                    <CompanySearch name='Manager' />
                                </div>
                                <DateInput name='Issue Date/Time' colWidth={4} />
                                <TextInput name='Odometer' colWidth={4} />
                                <div className='col-12'>
                                    <span className='p-float-label'>
                                        <InputTextarea
                                            name='Comment'
                                            className='test-drive__text-area'
                                        />
                                        <label className='float-label'>Comment</label>
                                    </span>
                                </div>
                            </div>
                            <div className='test-drive__card-control'>
                                <Button
                                    className='test-drive__button'
                                    label='Add to contacts'
                                    outlined
                                />
                                <Button className='test-drive__button' label='Preview' />
                                <Button className='test-drive__button' label='Print' />
                                <Button className='test-drive__button' label='Download' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Suspense>
    );
};
