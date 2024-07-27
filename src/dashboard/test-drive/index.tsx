import { CompanySearch } from "dashboard/contacts/common/company-search";
import { Button } from "primereact/button";
import { ReactElement, Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./index.css";
import { DateInput, StateDropdown, TextInput } from "dashboard/common/form/inputs";
import { InventorySearch } from "dashboard/inventory/common/inventory-search";
import { InputTextarea } from "primereact/inputtextarea";
import {
    TestDriver,
    TestVehicle,
    TestDealer,
    driverState,
    vehicleState,
    dealerState,
} from "./form-data";

const isFormComplete = (obj: object): boolean => {
    return Object.values(obj).every((value) => value !== "");
};

export const PrintForTestDrive = (): ReactElement => {
    const [driver, setDriver] = useState<TestDriver>(driverState);
    const [vehicle, setVehicle] = useState<TestVehicle>(vehicleState);
    const [dealer, setDealer] = useState<TestDealer>(dealerState);
    const [isComplete, setIsComplete] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsComplete(isFormComplete(driver) && isFormComplete(vehicle) && isFormComplete(dealer));
    }, [driver, vehicle, dealer]);

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
                                    <CompanySearch
                                        name='First Name'
                                        value={driver.firstName}
                                        returnedField='firstName'
                                        onRowClick={(firstName) =>
                                            setDriver({ ...driver, firstName })
                                        }
                                        onChange={({ target: { value } }) => {
                                            return setDriver({ ...driver, firstName: value });
                                        }}
                                    />
                                </div>
                                <div className='col-6'>
                                    <CompanySearch
                                        name='Last Name'
                                        value={driver.lastName}
                                        returnedField='lastName'
                                        onRowClick={(lastName) =>
                                            setDriver({ ...driver, lastName })
                                        }
                                        onChange={({ target: { value } }) =>
                                            setDriver({ ...driver, lastName: value })
                                        }
                                    />
                                </div>
                                <TextInput
                                    name='Phone Number'
                                    value={driver.homePhone}
                                    onChange={({ target: { value } }) =>
                                        setDriver({ ...driver, homePhone: value })
                                    }
                                    colWidth={4}
                                />
                                <TextInput
                                    name='Driver License’s Number'
                                    value={driver.dlNumber}
                                    onChange={({ target: { value } }) =>
                                        setDriver({ ...driver, dlNumber: value })
                                    }
                                    colWidth={4}
                                />
                                <StateDropdown
                                    name='DL’s State'
                                    value={driver.dlState}
                                    onChange={({ target: { value } }) =>
                                        setDriver({ ...driver, dlState: value })
                                    }
                                    colWidth={4}
                                />
                                <DateInput
                                    name='DL’s Start Date'
                                    value={driver.dlStartDate}
                                    onChange={({ target: { value } }) =>
                                        setDriver({ ...driver, dlStartDate: value as string })
                                    }
                                    colWidth={6}
                                />
                                <DateInput
                                    name='DL’s Exp. Date'
                                    value={driver.dlExpirationDate}
                                    onChange={({ target: { value } }) =>
                                        setDriver({ ...driver, dlExpirationDate: value as string })
                                    }
                                    colWidth={6}
                                />

                                <div className='col-12 test-drive__subtitle'>Vehicle</div>

                                <div className='col-6'>
                                    <InventorySearch
                                        name='VIN'
                                        value={vehicle.vclVIN}
                                        returnedField='VIN'
                                        onChange={({ target: { value } }) => {
                                            setVehicle({ ...vehicle, vclVIN: value });
                                        }}
                                        onRowClick={(vclVIN) => setVehicle({ ...vehicle, vclVIN })}
                                    />
                                </div>
                                <div className='col-6'>
                                    <InventorySearch
                                        name='Make'
                                        value={vehicle.vclMake}
                                        returnedField='Make'
                                        onRowClick={(vclMake) =>
                                            setVehicle({ ...vehicle, vclMake })
                                        }
                                        onChange={({ target: { value } }) => {
                                            setVehicle({ ...vehicle, vclMake: value });
                                        }}
                                    />
                                </div>
                                <div className='col-6'>
                                    <InventorySearch
                                        name='Model'
                                        value={vehicle.vclModel}
                                        returnedField='Model'
                                        onRowClick={(vclModel) =>
                                            setVehicle({ ...vehicle, vclModel })
                                        }
                                        onChange={({ target: { value } }) => {
                                            setVehicle({ ...vehicle, vclModel: value });
                                        }}
                                    />
                                </div>
                                <TextInput
                                    name='Year'
                                    value={vehicle.vclYear}
                                    onChange={({ target: { value } }) =>
                                        setVehicle({ ...vehicle, vclYear: value })
                                    }
                                    colWidth={6}
                                />

                                <div className='col-12 test-drive__subtitle'>Dealer</div>

                                <div className='col-4'>
                                    <CompanySearch
                                        name='Manager'
                                        value={dealer.dealersName}
                                        onRowClick={(dealersName) =>
                                            setDealer({ ...dealer, dealersName })
                                        }
                                        onChange={({ target: { value } }) =>
                                            setDealer({ ...dealer, dealersName: value })
                                        }
                                    />
                                </div>
                                <DateInput
                                    name='Issue Date/Time'
                                    value={dealer.issueDateTime}
                                    onChange={({ target: { value } }) =>
                                        setDealer({ ...dealer, issueDateTime: value as string })
                                    }
                                    colWidth={4}
                                />
                                <TextInput
                                    name='Odometer'
                                    value={dealer.outOdometer}
                                    onChange={({ target: { value } }) =>
                                        setDealer({ ...dealer, outOdometer: value })
                                    }
                                    colWidth={4}
                                />
                                <div className='col-12'>
                                    <span className='p-float-label'>
                                        <InputTextarea
                                            name='Comment'
                                            value={dealer.comments}
                                            onChange={({ target: { value } }) => {
                                                setDealer({ ...dealer, comments: value });
                                            }}
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
                                <Button
                                    className='test-drive__button'
                                    disabled={!isComplete}
                                    severity={!isComplete ? "secondary" : "success"}
                                    label='Preview'
                                />
                                <Button
                                    className='test-drive__button'
                                    disabled={!isComplete}
                                    severity={!isComplete ? "secondary" : "success"}
                                    label='Print'
                                />
                                <Button
                                    className='test-drive__button'
                                    disabled={!isComplete}
                                    severity={!isComplete ? "secondary" : "success"}
                                    label='Download'
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Suspense>
    );
};
