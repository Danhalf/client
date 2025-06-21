import { CurrencyInput, TextInput } from "dashboard/common/form/inputs";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { InputNumberChangeEvent } from "primereact/inputnumber";
import { useState } from "react";

export const DealTotalsProfit = () => {
    const [miscCostFirstText, setMiscCostFirstText] = useState<string>("");
    const [miscCostSecondText, setMiscCostSecondText] = useState<string>("");
    const [miscCostFirstValue, setMiscCostFirstValue] = useState<number>(0);
    const [miscCostSecondValue, setMiscCostSecondValue] = useState<number>(0);
    const [miscCostFirstCommission, setMiscCostFirstCommission] = useState<boolean>(false);
    const [miscCostSecondCommission, setMiscCostSecondCommission] = useState<boolean>(false);

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
                                inputId={`misc-cost-first-commission1`}
                                checked={miscCostFirstCommission}
                                tooltip='Include in Commission1 Base'
                                onChange={() => {
                                    setMiscCostFirstCommission(!miscCostFirstCommission);
                                }}
                            />

                            <Checkbox
                                inputId={`misc-cost-first-commission`}
                                checked={miscCostSecondCommission}
                                tooltip='Include in Commission Base'
                                onChange={() => {
                                    setMiscCostSecondCommission(miscCostSecondCommission);
                                }}
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
                                inputId={`misc-cost-second-commission`}
                                checked={miscCostSecondCommission}
                                tooltip='Include in Commission Base'
                                onChange={() => {
                                    setMiscCostSecondCommission(miscCostSecondCommission);
                                }}
                            />
                            <Checkbox
                                inputId={`misc-cost-second-commission`}
                                checked={miscCostSecondCommission}
                                tooltip='Include in Commission Base'
                                onChange={() => {
                                    setMiscCostSecondCommission(miscCostSecondCommission);
                                }}
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
