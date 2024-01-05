import { Steps } from "primereact/steps";
import { MenuItem, MenuItemOptions } from "primereact/menuitem";
import "./index.css";
import { useEffect, useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { InventoryVehicle } from "./vehicle";

const newTemplate = (item: MenuItem, options: MenuItemOptions) => {
    return (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
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
};

const vehicleLabels = [
    "General",
    "Description",
    "Options",
    "Checks",
    "Inspections",
    "Keys",
    "Disclosures",
    "Other",
];
const purchaseLabels = ["Floorplan", "Consign", "Title", "Purchases", "Expenses", "Payments"];
const mediaDataLabels = ["Images", "Video", "Audio", "Documents"];

const vehicleItems: MenuItem[] = vehicleLabels.map((label) => {
    return {
        label,
        template: (item: MenuItem, options: MenuItemOptions) => newTemplate(item, options),
    };
});
const purchaseItems: MenuItem[] = purchaseLabels.map((label) => {
    return {
        label,
        template: (item: MenuItem, options: MenuItemOptions) => newTemplate(item, options),
    };
});
const mediaDataItems: MenuItem[] = mediaDataLabels.map((label) => {
    return {
        label,
        template: (item: MenuItem, options: MenuItemOptions) => newTemplate(item, options),
    };
});

const accordionFirstStep = vehicleItems.length;
const accordionSecondStep = accordionFirstStep + purchaseItems.length;

export const CreateInventory = () => {
    const [stepActiveIndex, setStepActiveIndex] = useState<number>(0);
    const [accordionActiveIndex, setAccordionActiveIndex] = useState<number | number[]>([0]);

    useEffect(() => {
        if (Array.isArray(accordionActiveIndex)) {
            if (stepActiveIndex > accordionSecondStep - 1) {
                return setAccordionActiveIndex((prev) => {
                    const updatedArray = [...(prev as number[])];
                    updatedArray[2] = 2;
                    return updatedArray;
                });
            }
            if (stepActiveIndex > accordionFirstStep - 1) {
                return setAccordionActiveIndex((prev) => {
                    const updatedArray = [...(prev as number[])];
                    updatedArray[1] = 1;
                    return updatedArray;
                });
            }
        }
        return setAccordionActiveIndex((prev) => {
            const updatedArray = [...(prev as number[])];
            updatedArray[0] = 0;
            return updatedArray;
        });
    }, [stepActiveIndex]);

    // eslint-disable-next-line no-console
    console.log(accordionActiveIndex);

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
                                    <AccordionTab pt={{}} header='Vehicle'>
                                        <Steps
                                            model={vehicleItems}
                                            activeIndex={stepActiveIndex}
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
                                    <AccordionTab header='Purchase'>
                                        <Steps
                                            model={purchaseItems}
                                            activeIndex={stepActiveIndex - accordionFirstStep}
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
                                    <AccordionTab header='Media data'>
                                        <Steps
                                            model={mediaDataItems}
                                            activeIndex={stepActiveIndex - accordionSecondStep}
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
                                    itemsLength={vehicleItems.length - 1}
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
