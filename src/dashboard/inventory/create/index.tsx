/* eslint-disable jsx-a11y/anchor-is-valid */
import { Steps } from "primereact/steps";
import "./index.css";
import { useEffect, useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { InventoryVehicle, InventoryVehicleData } from "./vehicle";
// import { inventorySections } from "../common";
import { Button } from "primereact/button";
import { InventorySection } from "../common";
import React from "react";

export const inventorySections = [InventoryVehicleData].map(
    (sectionData) => new InventorySection(sectionData)
);

export const CreateInventory = () => {
    const [stepActiveIndex, setStepActiveIndex] = useState<number>(6);
    const [accordionActiveIndex, setAccordionActiveIndex] = useState<number | number[]>([0]);
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const [isValidData, setIsValidData] = useState<boolean>(false);

    const accordionSteps = inventorySections.map((item) => item.startIndex);
    const itemsMenuCount = inventorySections.reduce(
        (acc, current) => acc + current.getLength(),
        -1
    );

    useEffect(() => {
        accordionSteps.forEach((step, index) => {
            if (step - 1 < stepActiveIndex) {
                return setAccordionActiveIndex((prev) => {
                    const updatedArray = Array.isArray(prev) ? [...prev] : [0];
                    updatedArray[index] = index;
                    return updatedArray;
                });
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                                    {inventorySections.map((section) => (
                                        <AccordionTab
                                            key={section.sectionId}
                                            header={section.label}
                                        >
                                            <Steps
                                                model={section.items.map(
                                                    ({ itemLabel, template }) => ({
                                                        label: itemLabel,
                                                        template,
                                                    })
                                                )}
                                                activeIndex={stepActiveIndex - section.startIndex}
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
                                <InventoryVehicle>
                                    {inventorySections.map((section) => (
                                        <React.Fragment key={section.sectionId}>
                                            {section.items.map((item, index) => (
                                                <div
                                                    key={index}
                                                    style={{
                                                        display:
                                                            stepActiveIndex === index
                                                                ? "block"
                                                                : "none",
                                                    }}
                                                >
                                                    {item.component}
                                                </div>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </InventoryVehicle>
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
                                        disabled={stepActiveIndex >= itemsMenuCount}
                                        className='uppercase px-6'
                                        outlined
                                    >
                                        Next
                                    </Button>
                                    <Button
                                        onClick={() => {}}
                                        disabled={!isValidData}
                                        className='uppercase px-6'
                                    >
                                        Save
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
