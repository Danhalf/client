import { Steps } from "primereact/steps";
import { MenuItem, MenuItemOptions } from "primereact/menuitem";
import "./index.css";
import { useState } from "react";
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

const items: MenuItem[] = [
    {
        label: "General",
    },
    {
        label: "Description",
    },
    {
        label: "Options",
    },
    {
        label: "Checks",
    },
    {
        label: "Inspections",
    },
    {
        label: "Keys",
    },
    {
        label: "Disclosures",
    },
    {
        label: "Other",
    },
];

const itemsWithTemplate = items.map((item: MenuItem) => ({
    ...item,
    template: (item: MenuItem, options: MenuItemOptions) => newTemplate(item, options),
}));

export const CreateInventory = () => {
    const [stepActiveIndex, setStepActiveIndex] = useState<number>(0);
    const [accordionActiveIndex, setAccordionActiveIndex] = useState<number>(0);

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
                                    className='create-inventory__accordion'
                                >
                                    <AccordionTab pt={{}} header='Vehicle'>
                                        <Steps
                                            model={itemsWithTemplate}
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
                                    <AccordionTab header='Purchase'></AccordionTab>
                                    <AccordionTab header='Media data'></AccordionTab>
                                </Accordion>
                            </div>
                            <div className='col-8 flex flex-column'>
                                <InventoryVehicle />
                            </div>
                        </div>
                        <div className='flex justify-content-end gap-3'>
                            <Button
                                onClick={() => setStepActiveIndex((prev) => --prev)}
                                disabled={!stepActiveIndex}
                                className='uppercase  px-6'
                                outlined
                            >
                                Back
                            </Button>
                            <Button
                                onClick={() => setStepActiveIndex((prev) => ++prev)}
                                disabled={stepActiveIndex >= items.length - 1}
                                className='uppercase px-6'
                                outlined
                            >
                                Next
                            </Button>
                            <Button
                                onClick={() => setStepActiveIndex((prev) => ++prev)}
                                disabled={stepActiveIndex !== items.length - 1}
                                className='uppercase px-6'
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
