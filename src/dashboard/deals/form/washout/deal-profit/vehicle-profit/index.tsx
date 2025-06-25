import { Card } from "primereact/card";
import { DealProfitItem, INCLUDE_OPTIONS } from "..";
import { useState } from "react";
import { useStore } from "store/hooks";
import { Button } from "primereact/button";
import { useLocation, useNavigate } from "react-router-dom";
import { INVENTORY_STEPS } from "dashboard/inventory/form";

export const DealVehicleProfit = () => {
    const { dealWashout, inventory, changeDealWashout } = useStore().dealStore;
    const inventoryStore = useStore().inventoryStore;
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const [includeOverallowance, setIncludeOverallowance] = useState<INCLUDE_OPTIONS | null>(null);
    const [includeVehicleProfit, setIncludeVehicleProfit] = useState<INCLUDE_OPTIONS | null>(null);

    const handleNavigateToExpenses = () => {
        inventoryStore.memoRoute = pathname;
        navigate(`/dashboard/inventory/${inventory.itemuid}?step=${INVENTORY_STEPS.EXPENSES}`);
    };

    return (
        <Card className='profit-card vehicle-profit'>
            <div className='profit-card__header vehicle-profit__header'>Vehicle Profit</div>
            <div className='profit-card__body vehicle-profit__body'>
                <Button
                    icon='pi pi-plus'
                    tooltip='Expenses'
                    className='vehicle-profit__expenses-button'
                    onClick={handleNavigateToExpenses}
                />
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
                <div className='vehicle-profit__info'>
                    <DealProfitItem
                        title='Cash Price:'
                        justify='start'
                        includes
                        currency='$'
                        value={0}
                        onChange={({ value }) => {}}
                    />
                    <DealProfitItem
                        numberSign='-'
                        title='Vehicle Cost:'
                        includes
                        justify='start'
                        currency='$'
                        value={Number(dealWashout.VehicleCost) || 0}
                        onChange={({ value }) => {
                            changeDealWashout("VehicleCost", String(value));
                        }}
                    />
                    <DealProfitItem
                        numberSign='-'
                        title='Expenses:'
                        includes
                        justify='start'
                        currency='$'
                        value={Number(dealWashout.Expenses) || 0}
                        onChange={({ value }) => {
                            changeDealWashout("Expenses", String(value));
                        }}
                    />
                    <DealProfitItem
                        numberSign='-'
                        title='Overallowance:'
                        includes
                        includeCheckbox={includeOverallowance}
                        includeCheckboxOnChange={setIncludeOverallowance}
                        justify='start'
                        currency='$'
                        value={Number(dealWashout.Overllowance) || 0}
                        onChange={({ value }) => {
                            changeDealWashout("Overllowance", String(value));
                        }}
                    />
                    <div className='splitter my-0'>
                        <hr className='splitter__line flex-1' />
                    </div>
                    <DealProfitItem
                        numberSign='='
                        title='Vehicle Profit:'
                        currency='$'
                        className='deal-profit__item--blue'
                        includes
                        includeCheckbox={includeVehicleProfit}
                        includeCheckboxOnChange={setIncludeVehicleProfit}
                        value={0}
                        onChange={({ value }) => {}}
                    />
                </div>
            </div>
        </Card>
    );
};
