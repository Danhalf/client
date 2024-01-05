import { Inventory } from "dashboard/inventory/common";
import { PropsWithChildren } from "react";

export const InventoryMediaData: Pick<Inventory, "label" | "items"> = {
    label: "Media data",
    items: [
        { itemLabel: "Images" },
        { itemLabel: "Video" },
        { itemLabel: "Audio" },
        { itemLabel: "Documents" },
    ],
};

export const InventoryMedia = ({ children }: PropsWithChildren<{}>): JSX.Element => {
    return (
        <>
            <div className='flex flex-grow-1 inventory-media'>{children}</div>
        </>
    );
};
