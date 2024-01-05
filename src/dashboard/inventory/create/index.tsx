/* eslint-disable jsx-a11y/anchor-is-valid */
import { Steps } from "primereact/steps";
import { MenuItem, MenuItemOptions } from "primereact/menuitem";
import "./index.css";
import { useEffect, useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { InventoryVehicle } from "./vehicle";

interface MenuItemProps extends MenuItem {
    itemIndex: number;
}

interface InventorySection {
    label: string;
    items: MenuItemProps[];
    sectionId?: number;
    startIndex: number;
    getLength?: () => number;
}

class AccordionSection implements InventorySection {
    static instancesCount: number = 0;
    static itemIndex: number = 0;
    sectionId: number;
    label: string;
    startIndex: number = 0;
    items: MenuItemProps[];

    constructor({ label, items }: { label: string; items: string[] }) {
        this.sectionId = ++AccordionSection.instancesCount;
        this.label = label;
        this.items = items.map((label) => ({
            label,
            itemIndex: AccordionSection.itemIndex++,
            template: (item: MenuItem, options: MenuItemOptions) => this.newTemplate(item, options),
        }));
        this.startIndex = AccordionSection.itemIndex - this.items.length;
    }

    private newTemplate(item: MenuItem, options: MenuItemOptions): JSX.Element {
        return (
            <a
                href='#'
                className={`${options.className} vertical-nav flex-row align-items-center justify-content-start w-full`}
                role='presentation'
                data-pc-section='action'
            >
                <span
                    className={"vertical-nav__icon p-steps-number border-circle "}
                    data-pc-section='step'
                ></span>
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

const vehicleSection = new AccordionSection({
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
});

const purchaseSection = new AccordionSection({
    label: "Purchase",
    items: ["Floorplan", "Consign", "Title", "Purchases", "Expenses", "Payments"],
});

const mediaSection = new AccordionSection({
    label: "Media data",
    items: ["Images", "Video", "Audio", "Documents"],
});

export const CreateInventory = () => {
    const [stepActiveIndex, setStepActiveIndex] = useState<number>(0);
    const [accordionActiveIndex, setAccordionActiveIndex] = useState<number | number[]>([0]);

    useEffect(() => {
        //     if (Array.isArray(accordionActiveIndex)) {
        //         if (stepActiveIndex > accordionSecondStep - 1) {
        //             return setAccordionActiveIndex((prev) => {
        //                 const updatedArray = [...(prev as number[])];
        //                 updatedArray[2] = 2;
        //                 return updatedArray;
        //             });
        //         }
        //         if (stepActiveIndex > accordionFirstStep - 1) {
        //             return setAccordionActiveIndex((prev) => {
        //                 const updatedArray = [...(prev as number[])];
        //                 updatedArray[1] = 1;
        //                 return updatedArray;
        //             });
        //         }
        //     }
        //     return setAccordionActiveIndex((prev) => {
        //         const updatedArray = [...(prev as number[])];
        //         updatedArray[0] = 0;
        //         return updatedArray;
        //     });
    }, [stepActiveIndex]);

    return (
        <div className='grid'>
            <div className='col-12'>
                <div className='card create-inventory'>
                    <div className='card-header'>
                        <h2 className='card-header__title uppercase m-0'>Create new inventory</h2>
                    </div>
                    <div className='card-content create-inventory__card'>
                        <div className='grid'>
                            <div className='col-4'>
                                <Accordion
                                    activeIndex={accordionActiveIndex}
                                    onTabChange={(e) => setAccordionActiveIndex(e.index)}
                                    className='create-inventory__accordion'
                                    multiple
                                >
                                    <AccordionTab header={vehicleSection.label}>
                                        <Steps
                                            model={vehicleSection.items}
                                            activeIndex={
                                                stepActiveIndex - vehicleSection.startIndex
                                            }
                                            className='vertical-step-menu'
                                            pt={{
                                                menu: { className: "flex-column w-full" },
                                                step: {
                                                    className:
                                                        "border-circle create-inventory-step",
                                                },
                                            }}
                                        />
                                    </AccordionTab>
                                    <AccordionTab header={purchaseSection.label}>
                                        <Steps
                                            model={purchaseSection.items}
                                            activeIndex={
                                                stepActiveIndex - purchaseSection.startIndex
                                            }
                                            className='vertical-step-menu'
                                            pt={{
                                                menu: { className: "flex-column w-full" },
                                                step: {
                                                    className:
                                                        "border-circle create-inventory-step",
                                                },
                                            }}
                                        />
                                    </AccordionTab>
                                    <AccordionTab header={mediaSection.label}>
                                        <Steps
                                            model={mediaSection.items}
                                            activeIndex={stepActiveIndex - mediaSection.startIndex}
                                            className='vertical-step-menu'
                                            pt={{
                                                menu: { className: "flex-column w-full" },
                                                step: {
                                                    className:
                                                        "border-circle create-inventory-step",
                                                },
                                            }}
                                        />
                                    </AccordionTab>
                                </Accordion>
                            </div>
                            <div className='col-8 flex flex-column'>
                                <InventoryVehicle
                                    itemsLength={vehicleSection.getLength() - 1}
                                    menuIndex={stepActiveIndex}
                                    setMenuIndex={setStepActiveIndex}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
