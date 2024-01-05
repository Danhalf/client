/* eslint-disable jsx-a11y/anchor-is-valid */
import { Steps } from "primereact/steps";
import "./index.css";
import { useEffect, useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { InventoryVehicle } from "./vehicle";
import { inventorySections } from "../common";
import { Button } from "primereact/button";

export const CreateInventory = () => {
    const [stepActiveIndex, setStepActiveIndex] = useState<number>(6);
    const [accordionActiveIndex, setAccordionActiveIndex] = useState<number | number[]>([0]);

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
                                                model={section.items}
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
                                <InventoryVehicle
                                    itemsLength={inventorySections[0].getLength() - 1}
                                    menuIndex={stepActiveIndex}
                                    setMenuIndex={setStepActiveIndex}
                                />
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
                                        // disabled={menuIndex !== itemsLength}
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
