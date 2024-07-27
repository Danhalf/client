import { Contact } from "common/models/contact";
import { Inventory } from "./../../../common/models/inventory/index";
export type TestDriver = Pick<Contact, "firstName" | "lastName" | "dl_number" | "dl_expiration"> & {
    phoneNumber: string;
    dlState: string;
    dlStartDate: string;
};

export type TestVehicle = Pick<Inventory, "VIN" | "Make" | "Model" | "Year">;

export interface TestDealer {
    manager: string;
    issueDateTime: string;
    odometer: string;
    comment: string;
}

export const driverState: TestDriver = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    dl_number: "",
    dlState: "",
    dlStartDate: "",
    dl_expiration: "",
};

export const vehicleState: TestVehicle = {
    VIN: "",
    Make: "",
    Model: "",
    Year: "",
};

export const dealerState: TestDealer = {
    manager: "",
    issueDateTime: "",
    odometer: "",
    comment: "",
};
