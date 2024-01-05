import { Inventory } from "dashboard/inventory/common";
import { PropsWithChildren } from "react";

export const InventoryPurchaseData: Pick<Inventory, "label" | "items"> = {
    label: "Purchase",
    items: [
        { itemLabel: "Floorplan" },
        { itemLabel: "Consign" },
        { itemLabel: "Title" },
        { itemLabel: "Purchases" },
        { itemLabel: "Expenses" },
        { itemLabel: "Payments" },
    ],
};

export const InventoryPurchase = ({ children }: PropsWithChildren<{}>): JSX.Element => {
    return (
        <>
            <div className='flex flex-grow-1 inventory-purchase'>{children}</div>
        </>
    );
};
