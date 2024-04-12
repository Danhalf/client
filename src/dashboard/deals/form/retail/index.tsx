import { Inventory } from "dashboard/inventory/common";
import { lazy } from "react";

const DealRetailLiens = lazy(() =>
    import("./liens").then((module) => ({ default: module.DealRetailLiens }))
);
const DealRetailTradeFirst = lazy(() =>
    import("./trade-first").then((module) => ({ default: module.DealRetailTradeFirst }))
);
const DealRetailTradeSecond = lazy(() =>
    import("./trade-second").then((module) => ({ default: module.DealRetailTradeSecond }))
);
const DealRetailTag = lazy(() =>
    import("./tag").then((module) => ({ default: module.DealRetailTag }))
);

export const DealRetail: Pick<Inventory, "label" | "items"> = {
    label: "General information",
    items: [
        { itemLabel: "Liens", component: <DealRetailLiens /> },
        { itemLabel: "Trade 1", component: <DealRetailTradeFirst /> },
        { itemLabel: "Trade 2", component: <DealRetailTradeSecond /> },
        { itemLabel: "Tag", component: <DealRetailTag /> },
    ],
};
