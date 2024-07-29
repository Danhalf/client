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
import { useStore } from "store/hooks";
import { printTestDrive } from "http/services/print";
import { useToast } from "dashboard/common/toast";
import { Status } from "common/models/base-response";
import { TOAST_LIFETIME } from "common/settings";

const isFormComplete = (obj: object): boolean => {
    return Object.values(obj).every((value) => value !== "");
};

export const PrintForTestDrive = (): ReactElement => {
    const store = useStore().userStore;
    const { authUser } = store;
    const toast = useToast();
    const [driver, setDriver] = useState<TestDriver>(driverState);
    const [vehicle, setVehicle] = useState<TestVehicle>(vehicleState);
    const [dealer, setDealer] = useState<TestDealer>(dealerState);
    const [isComplete, setIsComplete] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const isAllFormFilled =
            isFormComplete(driver) && isFormComplete(vehicle) && isFormComplete(dealer);
        setIsComplete(isAllFormFilled);
    }, [driver, vehicle, dealer]);

    const handlePrintForm = async (print: boolean = false) => {
        if (authUser && authUser.useruid) {
            const response = await printTestDrive(authUser.useruid, {
                ...driver,
                ...vehicle,
                ...dealer,
            });
            if (response.status === Status.ERROR) {
                const { error } = response;
                return toast.current?.show({
                    severity: "error",
                    summary: Status.ERROR,
                    life: TOAST_LIFETIME,
                    detail: error || "Error while print for test drive",
                    sticky: true,
                });
            }
            setTimeout(() => {
                const url = new Blob([response], { type: "application/pdf" });
                let link = document.createElement("a");
                link.href = window.URL.createObjectURL(url);
                if (!print) {
                    link.download = `test_drive_print_form_${authUser.username}.pdf`;
                    link.click();
                } else {
                    window.open(
                        link.href,
                        "_blank",
                        "toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=100,width=1280,height=720"
                    );
                }
            }, 3000);
        }
    };

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
                                        value={driver.customerName}
                                        returnedField='firstName'
                                        getFullInfo={({ firstName, lastName, phone1 }) =>
                                            setDriver({
                                                ...driver,
                                                customerName: firstName,
                                                customerLastName: lastName,
                                                homePhone: phone1,
                                            })
                                        }
                                        onChange={({ target: { value } }) => {
                                            return setDriver({ ...driver, customerName: value });
                                        }}
                                    />
                                </div>
                                <div className='col-6'>
                                    <CompanySearch
                                        name='Last Name'
                                        value={driver.customerLastName}
                                        returnedField='lastName'
                                        getFullInfo={({ firstName, lastName, phone1 }) =>
                                            setDriver({
                                                ...driver,
                                                customerName: firstName,
                                                customerLastName: lastName,
                                                homePhone: phone1,
                                            })
                                        }
                                        onChange={({ target: { value } }) =>
                                            setDriver({ ...driver, customerLastName: value })
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
                                    value={driver.dlIssuingDate}
                                    onChange={({ target: { value } }) =>
                                        setDriver({ ...driver, dlIssuingDate: value as string })
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
                                    value={dealer.outDate}
                                    onChange={({ target: { value } }) =>
                                        setDealer({ ...dealer, outDate: value as string })
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
                                    onClick={() => handlePrintForm()}
                                    label='Preview'
                                />
                                <Button
                                    className='test-drive__button'
                                    disabled={!isComplete}
                                    severity={!isComplete ? "secondary" : "success"}
                                    onClick={() => handlePrintForm(true)}
                                    label='Print'
                                />
                                <Button
                                    className='test-drive__button'
                                    disabled={!isComplete}
                                    severity={!isComplete ? "secondary" : "success"}
                                    onClick={() => handlePrintForm()}
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
