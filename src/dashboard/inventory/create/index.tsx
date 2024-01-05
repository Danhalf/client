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
    {
        label: "Media data",
        items: ["Images", "Video", "Audio", "Documents"],
    },
];

interface MenuItemProps extends MenuItem {
    sectionIndex: number;
    index: number;
    startIndex: number;
}

let itemsLength: number = 0;
const allItems: MenuItemProps[] = sections.flatMap((section, index) => {
    const itemIndex = () => itemsLength++;
    return section.items.map((label) => ({
        label,
        template: (item: MenuItem, options: MenuItemOptions) => newTemplate(item, options),
        sectionIndex: index,
        index: itemIndex(),
        startIndex: sections[index].items.length,
    }));
});

// const getStartActiveIndex = (sectionIndex: number): number => {
//     // eslint-disable-next-line no-console
//     console.log(sectionIndex, sections[sectionIndex]);
//     return 0;
//     // return allItems
//     //     .slice(0, sectionIndex)
//     //     .reduce((acc, section) => acc + section.items.length, 0);
// };

// eslint-disable-next-line no-console
console.log(allItems[3].startIndex);

export const CreateInventory = () => {
    const [stepActiveIndex, setStepActiveIndex] = useState<number>(0);
    const [accordionActiveIndex, setAccordionActiveIndex] = useState<number | number[]>([0]);

    // useEffect(() => {
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
    // }, [stepActiveIndex]);

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
                                    {sections.map((section, index) => (
                                        <AccordionTab key={section.label} header={section.label}>
                                            <Steps
                                                model={allItems.filter(
                                                    (item) => item.sectionIndex === index
                                                )}
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
                                    ))}
                                </Accordion>
                            </div>
                            <div className='col-8 flex flex-column'>
                                <InventoryVehicle
                                    // itemsLength={vehicleItems.length - 1}
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
