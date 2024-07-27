import { TestDrive } from "common/models/test-drive";

export type TestDriver = Pick<TestDrive, "dlNumber" | "dlExpirationDate" | "homePhone"> & {
    firstName: string;
    lastName: string;
    dlState: string;
    dlStartDate: string;
};

export type TestVehicle = Pick<TestDrive, "vclVIN" | "vclMake" | "vclModel"> & {
    vclYear: string;
};

export type TestDealer = Pick<TestDrive, "dealersName" | "outOdometer" | "comments"> & {
    issueDateTime: string;
};

export const driverState: TestDriver = {
    firstName: "",
    lastName: "",
    homePhone: "",
    dlNumber: "",
    dlState: "",
    dlStartDate: "",
    dlExpirationDate: "",
};

export const vehicleState: TestVehicle = {
    vclVIN: "",
    vclMake: "",
    vclModel: "",
    vclYear: "",
};

export const dealerState: TestDealer = {
    dealersName: "",
    issueDateTime: "",
    outOdometer: "",
    comments: "",
};
