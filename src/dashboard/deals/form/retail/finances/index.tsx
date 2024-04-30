import { observer } from "mobx-react-lite";
import { ReactElement, useEffect, useState } from "react";
import "./index.css";
import { CurrencyInput } from "dashboard/common/form/inputs";
import { Button } from "primereact/button";
import {
    dealFinancesRecalculate,
    dealFinancesWashout,
    getDealFiance,
} from "http/services/deals.service";
import { useParams } from "react-router-dom";
import { DealFinance } from "common/models/deals";

export const DealRetailFinances = observer((): ReactElement => {
    const { id } = useParams();
    const [finance, setFinance] = useState<DealFinance>();

    useEffect(() => {
        if (id) {
            getDealFiance(id).then((data) => setFinance(data));
        }
    }, [id]);

    const changeFinance = (key: string, value: number | null) => {
        if (finance) {
            setFinance({ ...finance, [key]: value });
        }
    };

    return (
        <div className='grid deal-retail-finances row-gap-2'>
            <div className='col-12'>
                <div className='flex justify-content-end gap-3 mt-5 mr-3'>
                    <Button
                        disabled
                        severity={"secondary"}
                        onClick={() => {
                            id && dealFinancesWashout(id);
                        }}
                        className='finances__button bold px-6'
                    >
                        Washout
                    </Button>
                    <Button
                        severity={"secondary"}
                        onClick={() => {
                            id && dealFinancesRecalculate(id);
                        }}
                        className='finances__button bold px-6'
                    >
                        Recalculate
                    </Button>
                </div>
            </div>
            <div className='col-6 finances-column'>
                <div className='finances-item'>
                    <label className='finances-item__label bold'>Cash Price</label>
                    <CurrencyInput
                        className='finances-item__input'
                        value={Number(finance?.CashPrice) || 0}
                        onChange={({ value }) => changeFinance("CashPrice", value)}
                    />
                </div>
                <div className='finances-item'>
                    <label className='finances-item__label'>Total Trade Allowance</label>
                    <CurrencyInput
                        className='finances-item__input'
                        value={Number(finance?.TradeAllowance) || 0}
                        onChange={({ value }) => changeFinance("TradeAllowance", value)}
                    />
                </div>

                <div className='finances-item finances-item--grey'>
                    <span className='finances-item__label'>Taxable amount</span>
                    <span className='finances-item__amount'>
                        ${finance?.TaxableAmount || "0.00"}
                    </span>
                </div>

                <div className='finances-item'>
                    <label className='finances-item__label'>Tax Rate</label>
                    <CurrencyInput
                        className='finances-item__input'
                        value={Number(finance?.TaxRate) || 0}
                        onChange={({ value }) => changeFinance("TaxRate", value)}
                    />
                </div>
                <div className='finances-item'>
                    <label className='finances-item__label'>Taxes</label>
                    <CurrencyInput
                        className='finances-item__input'
                        value={Number(finance?.Taxes) || 0}
                        onChange={({ value }) => changeFinance("Taxes", value)}
                    />
                </div>

                <div className='finances-item finances-item--grey'>
                    <span className='finances-item__label'>Subtotal</span>
                    <span className='finances-item__amount'> ${finance?.SubTotal || "0.00"}</span>
                </div>

                <div className='finances-item'>
                    <label className='finances-item__label'>Accessory Price</label>
                    <CurrencyInput className='finances-item__input' />
                </div>
                <div className='finances-item'>
                    <label className='finances-item__label'>Miscellaneous</label>
                    <CurrencyInput className='finances-item__input' />
                </div>
                <div className='finances-item'>
                    <label className='finances-item__label'>Tag Fee</label>
                    <CurrencyInput className='finances-item__input' />
                </div>
                <div className='finances-item'>
                    <label className='finances-item__label'>Title Transfer Fee</label>
                    <CurrencyInput className='finances-item__input' />
                </div>
                <div className='finances-item'>
                    <label className='finances-item__label'>License and Registration Fees</label>
                    <CurrencyInput className='finances-item__input' />
                </div>
                <div className='finances-item'>
                    <label className='finances-item__label'>Service Contract</label>
                    <CurrencyInput className='finances-item__input' />
                </div>
            </div>

            <div className='col-6 finances-column'>
                <div className='finances-item'>
                    <label className='finances-item__label'>GAP</label>
                    <CurrencyInput className='finances-item__input' />
                </div>
                <div className='finances-item'>
                    <label className='finances-item__label'>Accident & Health</label>
                    <CurrencyInput className='finances-item__input' />
                </div>
                <div className='finances-item'>
                    <label className='finances-item__label'>Credit Life</label>
                    <CurrencyInput className='finances-item__input' />
                </div>
                <div className='finances-item'>
                    <label className='finances-item__label'>VSI</label>
                    <CurrencyInput className='finances-item__input' />
                </div>
                <div className='finances-item'>
                    <label className='finances-item__label'>
                        Electronic Registration & Titling
                    </label>
                    <CurrencyInput className='finances-item__input' />
                </div>
                <div className='finances-item'>
                    <label className='finances-item__label'>Documentation Fee</label>
                    <CurrencyInput className='finances-item__input' />
                </div>

                <div className='finances-item finances-item--grey'>
                    <span className='finances-item__label'>Total Price</span>
                    <span className='finances-item__amount'>$0.00</span>
                </div>

                <div className='finances-item'>
                    <label className='finances-item__label'>Trade in Pay-Off Amount</label>
                    <span className='finances-item__amount'>$0.00</span>
                </div>
                <div className='finances-item'>
                    <label className='finances-item__label'>Net Trade Allowance</label>
                    <span className='finances-item__amount'>$0.00</span>
                </div>
                <div className='finances-item'>
                    <label className='finances-item__label'>Cash Down Payment</label>
                    <CurrencyInput className='finances-item__input' />
                </div>
                <div className='finances-item'>
                    <label className='finances-item__label'>Total Down Payment</label>
                    <span className='finances-item__amount'>$0.00</span>
                </div>

                <div className='finances-item finances-item--grey'>
                    <span className='finances-item__label'>Amount Financed</span>
                    <span className='finances-item__amount'>$0.00</span>
                </div>
            </div>
        </div>
    );
});
