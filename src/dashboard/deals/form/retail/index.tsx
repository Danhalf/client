import { Inventory } from "dashboard/inventory/common";
import { lazy } from "react";

const DealsSale = lazy(() =>
    import("./liens").then((module) => ({ default: module.DealGeneralSale }))
);
const DealsOdometer = lazy(() =>
    import("./trade-first").then((module) => ({ default: module.DealGeneralOdometer }))
);
const DealsSeller = lazy(() =>
    import("./tag").then((module) => ({ default: module.DealGeneralSeller }))
);

export const DealGeneralInfo: Pick<Inventory, "label" | "items"> = {
    label: "General information",
    items: [
        { itemLabel: "Sale", component: <DealsSale /> },
        { itemLabel: "Odometer", component: <DealsOdometer /> },
        { itemLabel: "Seller", component: <DealsSeller /> },
    ],
};
