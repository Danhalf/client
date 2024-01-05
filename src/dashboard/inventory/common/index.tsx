import { MenuItem, MenuItemOptions } from "primereact/menuitem";

/* eslint-disable jsx-a11y/anchor-is-valid */
interface InventoryMenuItem extends MenuItem {
    itemIndex: number;
}

interface Inventory {
    label: string;
    items: InventoryMenuItem[];
    sectionId?: number;
    startIndex: number;
    getLength?: () => number;
}

class InventorySection implements Inventory {
    static instancesCount: number = 0;
    static itemIndex: number = 0;
    sectionId: number;
    label: string;
    startIndex: number = 0;
    items: InventoryMenuItem[];

    constructor({ label, items }: { label: string; items: string[] }) {
        this.sectionId = ++InventorySection.instancesCount;
        this.label = label;
        this.items = items.map((label) => ({
            label,
            itemIndex: InventorySection.itemIndex++,
            template: (item: MenuItem, options: MenuItemOptions) => this.newTemplate(item, options),
        }));
        this.startIndex = InventorySection.itemIndex - this.items.length;
    }

    private newTemplate(item: MenuItem, options: MenuItemOptions): JSX.Element {
        return (
            <a
                href='#'
                className={`${options.className} vertical-nav flex-row align-items-center justify-content-start w-full`}
                role='presentation'
                data-pc-section='action'
            >
                <label
                    className={"vertical-nav__icon p-steps-number border-circle "}
                    data-pc-section='step'
                />
                <span
                    className={`${options.labelClassName} vertical-nav__label`}
                    data-pc-section='label'
                >
                    {item.label}
                </span>
            </a>
        );
    }

    public getLength(): number {
        return this.items.length;
    }
}

const sections = [
    {
        label: "Vehicle",
        items: [
            "General",
            "Description",
            "Options",
            "Checks",
            "Inspections",
            "Keys",
            "Disclosures",
            "Other",
        ],
    },
    {
        label: "Purchase",
        items: ["Floorplan", "Consign", "Title", "Purchases", "Expenses", "Payments"],
    },
    { label: "Media data", items: ["Images", "Video", "Audio", "Documents"] },
];

export const inventorySections: InventorySection[] = sections.map(
    (sectionData) => new InventorySection(sectionData)
);
