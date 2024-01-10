import { Inventory } from "dashboard/inventory/common";
import { PurchaseFloorplan } from "./froorplan";
import { PurchaseConsign } from "./consign";
import { PurchaseTitle } from "./title";

export const InventoryPurchaseData: Pick<Inventory, "label" | "items"> = {
    label: "Purchase",
    items: [
        { itemLabel: "Floorplan", component: <PurchaseFloorplan /> },
        { itemLabel: "Consign", component: <PurchaseConsign /> },
        { itemLabel: "Title", component: <PurchaseTitle /> },
        { itemLabel: "Purchases" },
        { itemLabel: "Expenses" },
        { itemLabel: "Payments" },
    ],
};
