import { DealProfitItem } from "dashboard/deals/form/washout/deal-profit";
import { useStore } from "store/hooks";

export const AccountWash = () => {
    const { dealWashout, changeDealWashout } = useStore().dealStore;

    return (
        <div className='account-wash__body'>
            <DealProfitItem
                title='BHPH Collected Interest:'
                value={Number(dealWashout.BHPHCollectedInterest) || 0}
                currency='$'
                justify='start'
            />
            <DealProfitItem
                title='Collected Interest From Other Source:'
                value={Number(dealWashout.CollectedInterestOther) || 0}
                currency='%'
                withInput
                fieldName='CollectedInterestOther'
                onChange={({ value }: any) =>
                    changeDealWashout("CollectedInterestOther", String(value))
                }
            />
            <DealProfitItem
                title='Total Collected Interest:'
                value={Number(dealWashout.TotalCollectedInterest) || 0}
                currency='$'
                justify='start'
                className='deal-profit__item--bold'
            />

            <div className='splitter my-0'>
                <hr className='splitter__line flex-1' />
            </div>

            <DealProfitItem
                title='Total Collected (Payments + Trade):'
                value={Number(dealWashout.TotalCollected) || 0}
                currency='$'
                justify='start'
            />
            <DealProfitItem
                title='Total Deal Cost (-) (w/ tags, tax, etc):'
                value={Number(dealWashout.TotalDealCost) || 0}
                currency='$'
                justify='start'
            />
            <DealProfitItem
                title='(=) Actual Profit Realized:'
                value={Number(dealWashout.ActualProfitRealized) || 0}
                currency='$'
                className='deal-profit__item--bold'
                justify='start'
            />
        </div>
    );
};
