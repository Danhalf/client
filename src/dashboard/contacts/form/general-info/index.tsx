import { Inventory } from "dashboard/inventory/common";
import { lazy } from "react";

const ContactsGeneral = lazy(() =>
    import("./general").then((module) => ({ default: module.ContactsGeneralInfo }))
);
const ContactsGeneralAddress = lazy(() =>
    import("./adress").then((module) => ({ default: module.ContactsAddressInfo }))
);

export const GeneralInfoData: Pick<Inventory, "label" | "items"> = {
    label: "General information",
    items: [
        { itemLabel: "General", component: <ContactsGeneral /> },
        { itemLabel: "Address", component: <ContactsGeneralAddress /> },
        { itemLabel: "Mailing address" },
        { itemLabel: "Identification" },
    ],
};
