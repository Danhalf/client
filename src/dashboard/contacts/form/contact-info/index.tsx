import { Inventory } from "dashboard/inventory/common";
import { lazy } from "react";

const ContactsSocialInfo = lazy(() =>
    import("./contacts").then((module) => ({ default: module.ContactsSocialInfo }))
);

export const ContactInfoData: Pick<Inventory, "label" | "items"> = {
    label: "Contact Information",
    items: [
        { itemLabel: "Contacts", component: <ContactsSocialInfo /> },
        { itemLabel: "Company/Workplace" },
        { itemLabel: "Prospecting and notes" },
    ],
};
