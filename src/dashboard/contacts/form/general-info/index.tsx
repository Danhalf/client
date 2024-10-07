import { ContactAccordionItems } from "dashboard/contacts/common/step-navigation";
import { Inventory } from "dashboard/inventory/common";
import { lazy } from "react";

const ContactsBuyerInfo = lazy(() =>
    import("./buyer-info").then((module) => ({ default: module.ContactsBuyerInfo }))
);
const ContactsCoBuyerInfo = lazy(() =>
    import("./co-buyer-info").then((module) => ({ default: module.ContactsCoBuyerInfo }))
);

export enum GENERAL_CONTACT_TYPE {
    BUYER = "buyer",
    CO_BUYER = "co-buyer",
}

export const GeneralInfoData: Pick<Inventory, "label" | "items"> = {
    label: "General information",
    items: [
        { itemLabel: ContactAccordionItems.BUYER, component: <ContactsBuyerInfo /> },
        { itemLabel: ContactAccordionItems.CO_BUYER, component: <ContactsCoBuyerInfo /> },
    ],
};
