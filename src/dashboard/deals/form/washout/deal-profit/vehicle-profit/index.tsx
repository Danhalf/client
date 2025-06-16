import { Card } from "primereact/card";
import { DealProfitItem } from "..";

export const DealVehicleProfit = () => {
    return (
        <Card className='profit-card vehicle-profit'>
            <div className='profit-card__header vehicle-profit__header'>Vehicle Profit</div>
            <div className='profit-card__body vehicle-profit__body'>
                <div className='vehicle-profit__inputs'>
                    <DealProfitItem
                        title='Trade 1 Allowance:'
                        value={0}
                        withInput
                        fieldName='Trade1Allowance'
                        onChange={({ value }) => {}}
                    />
                    <DealProfitItem
                        title='Trade 1 ACV:'
                        value={0}
                        withInput
                        fieldName='Trade1ACV'
                        onChange={({ value }) => {}}
                    />
                    <DealProfitItem
                        title='Trade 2 Allowance:'
                        value={0}
                        withInput
                        fieldName='Trade1Allowance'
                        onChange={({ value }) => {}}
                    />
                    <DealProfitItem
                        title='Trade 2 ACV:'
                        value={0}
                        withInput
                        fieldName='Trade2ACV'
                        onChange={({ value }) => {}}
                    />
                </div>
            </div>
        </Card>
    );
};
