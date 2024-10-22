import { Contact, ContactAccordionItems } from "dashboard/contacts/common/step-navigation";
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

export const BUYER_ID = 1;

export const getGeneralInfoData = (clientId: number): Pick<Contact, "label" | "items"> => {
    const items = [
        {
            itemLabel: ContactAccordionItems.BUYER,
            component: <ContactsBuyerInfo />,
        },
        ...(clientId === BUYER_ID
            ? [{ itemLabel: ContactAccordionItems.CO_BUYER, component: <ContactsCoBuyerInfo /> }]
            : []),
    ];

    return {
        label: "General information",
        items,
    };
};
