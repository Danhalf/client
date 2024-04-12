import { Inventory } from "dashboard/inventory/common";
import { lazy } from "react";

const ContactsGeneral = lazy(() =>
    import("./sale").then((module) => ({ default: module.DealGeneralSale }))
);

export const DealGeneralInfo: Pick<Inventory, "label" | "items"> = {
    label: "General information",
    items: [{ itemLabel: "Sale", component: <ContactsGeneral /> }],
};
