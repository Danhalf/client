import { Steps } from "primereact/steps";
import { MenuItem, MenuItemOptions } from "primereact/menuitem";
import "./index.css";
import { useState } from "react";
import { Button } from "primereact/button";

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
                //  className={`p-steps-number flex-grow-0  bg-white border-circle ${options.iconClassName}`}
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
    const [activeIndex, setActiveIndex] = useState<number>(0);

    return (
        <div className='grid'>
            <div className='col-12'>
                <div className='card create-inventory'>
                    <div className='card-header'>
                        <h2 className='card-header__title uppercase m-0'>Create new inventory</h2>
                    </div>
                    <div className='card-content create-inventory__content'>
                        <div className='grid'>
                            <div className='col-4'>
                                <Steps
                                    model={itemsWithTemplate}
                                    activeIndex={activeIndex}
                                    className='vertical-step-menu'
                                    pt={{
                                        menu: { className: "flex-column w-full" },
                                        step: { className: "border-circle create-inventory-step" },
                                    }}
                                />
                            </div>
                            <div className='col-8 flex flex-column'>
                                <div className='flex flex-grow-1'></div>
                            </div>
                        </div>
                        <div className='flex justify-content-end gap-3'>
                            <Button
                                onClick={() => setActiveIndex((prev) => --prev)}
                                disabled={!activeIndex}
                                className='uppercase  px-6'
                                outlined
                            >
                                Back
                            </Button>
                            <Button
                                onClick={() => setActiveIndex((prev) => ++prev)}
                                disabled={activeIndex >= items.length - 1}
                                className='uppercase px-6'
                                outlined
                            >
                                Next
                            </Button>
                            <Button
                                onClick={() => setActiveIndex((prev) => ++prev)}
                                disabled={activeIndex !== items.length - 1}
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
