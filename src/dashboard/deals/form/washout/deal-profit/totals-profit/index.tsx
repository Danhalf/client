import { CurrencyInput, TextInput } from "dashboard/common/form/inputs";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { InputNumberChangeEvent } from "primereact/inputnumber";
import { useState } from "react";

enum MISC_COST_OPTIONS {
    COMMISSION1 = "commission1",
    COMMISSION = "commission",
}

export const DealTotalsProfit = () => {
    const [miscCostFirstText, setMiscCostFirstText] = useState<string>("");
    const [miscCostSecondText, setMiscCostSecondText] = useState<string>("");
    const [miscCostFirstValue, setMiscCostFirstValue] = useState<number>(0);
    const [miscCostSecondValue, setMiscCostSecondValue] = useState<number>(0);

    const [firstMiscSelectedOption, setFirstMiscSelectedOption] =
        useState<MISC_COST_OPTIONS | null>(null);

    const [secondMiscSelectedOption, setSecondMiscSelectedOption] =
        useState<MISC_COST_OPTIONS | null>(null);

    const handleFirstMiscSelection = (optionId: MISC_COST_OPTIONS) => {
        if (firstMiscSelectedOption === optionId) {
            setFirstMiscSelectedOption(null);
        } else {
            setFirstMiscSelectedOption(optionId);
        }
    };

    const handleSecondMiscSelection = (optionId: MISC_COST_OPTIONS) => {
        if (secondMiscSelectedOption === optionId) {
            setSecondMiscSelectedOption(null);
        } else {
            setSecondMiscSelectedOption(optionId);
        }
    };

    return (
        <Card className='profit-card totals-profit'>
            <div className='profit-card__header totals-profit__header'>Totals</div>
            <div className='profit-card__body totals-profit__body'>
                <div className='totals-content'>
                    <div className='totals-content__info totals-content__info--red'>
                        <span className='totals-content__info-title'>Vehicle Profit:</span>
                        <span className='totals-content__info-value'>$0.00</span>
                    </div>
                    <div className='totals-content__info totals-content__info--green'>
                        <span className='totals-content__info-title'>(+) F&amp;I Profit:</span>
                        <span className='totals-content__info-value'>$0.00</span>
                    </div>
                    <div className='totals-content__info totals-content__info--blue'>
                        <span className='totals-content__info-title'>(+) F&amp;I Profit:</span>
                        <span className='totals-content__info-value'>$0.00</span>
                    </div>

                    <div className='totals-row totals-misc'>
                        <TextInput
                            name='(-) Misc. Cost'
                            value={miscCostFirstText}
                            height={32}
                            className='totals-misc__input'
                            onChange={(e) => setMiscCostFirstText(e.target.value)}
                        />
                        <CurrencyInput
                            name='Misc. Cost'
                            value={miscCostFirstValue}
                            className='totals-misc__input'
                            onChange={(e: InputNumberChangeEvent) =>
                                setMiscCostFirstValue(Number(e.value))
                            }
                        />
                        <div className='deal-profit__includes'>
                            <Checkbox
                                inputId='misc-cost-first-commission1'
                                checked={firstMiscSelectedOption === MISC_COST_OPTIONS.COMMISSION1}
                                tooltip='Include in Commission1 Base'
                                onChange={() =>
                                    handleFirstMiscSelection(MISC_COST_OPTIONS.COMMISSION1)
                                }
                            />

                            <Checkbox
                                inputId='misc-cost-first-commission'
                                checked={firstMiscSelectedOption === MISC_COST_OPTIONS.COMMISSION}
                                tooltip='Include in Commission Base'
                                onChange={() =>
                                    handleFirstMiscSelection(MISC_COST_OPTIONS.COMMISSION)
                                }
                            />
                        </div>
                    </div>
                    <div className='totals-row totals-misc'>
                        <TextInput
                            name='(-) Misc. Cost'
                            height={32}
                            value={miscCostSecondText}
                            className='totals-misc__input'
                            onChange={(e) => setMiscCostSecondText(e.target.value)}
                        />
                        <CurrencyInput
                            name='Misc. Cost'
                            value={miscCostSecondValue}
                            className='totals-misc__input'
                            onChange={(e: InputNumberChangeEvent) =>
                                setMiscCostSecondValue(Number(e.value))
                            }
                        />
                        <div className='deal-profit__includes'>
                            <Checkbox
                                inputId='misc-cost-second-commission1'
                                checked={secondMiscSelectedOption === MISC_COST_OPTIONS.COMMISSION1}
                                tooltip='Include in Commission1 Base'
                                onChange={() =>
                                    handleSecondMiscSelection(MISC_COST_OPTIONS.COMMISSION1)
                                }
                            />
                            <Checkbox
                                inputId='misc-cost-second-commission'
                                checked={secondMiscSelectedOption === MISC_COST_OPTIONS.COMMISSION}
                                tooltip='Include in Commission Base'
                                onChange={() =>
                                    handleSecondMiscSelection(MISC_COST_OPTIONS.COMMISSION)
                                }
                            />
                        </div>
                    </div>
                    <div className='totals-row'>
                        <span>(+) Reserve Refund from Finance Co.:</span>
                        <span>$0.00</span>
                    </div>
                    <div className='totals-row'>
                        <span>(+) Vehicle Pack:</span>
                        <span>$0.00</span>
                    </div>
                    <div className='totals-row'>
                        <span>(+) Doc Fee:</span>
                        <span>$0.00</span>
                    </div>
                    <div className='totals-row totals-total-profit'>
                        <span>(=) Total Profit:</span>
                        <span>$0.00</span>
                    </div>
                </div>
            </div>
        </Card>
    );
};
