import { CurrencyInput } from "dashboard/common/form/inputs";

export const SettingsFees = () => {
    return (
        <>
            <div className='text-lg pb-2 font-semibold'>Fees</div>
            <CurrencyInput
                title='Default documentation fee'
                minFractionDigits={2}
                locale='en-US'
                value={421}
            />
            <CurrencyInput
                title='Default vehicle pack'
                minFractionDigits={2}
                locale='en-US'
                value={421}
            />
            <CurrencyInput
                title='Default title fee'
                minFractionDigits={2}
                locale='en-US'
                value={421}
            />
            <CurrencyInput
                title='Default tag fee'
                minFractionDigits={2}
                locale='en-US'
                value={421}
            />
            <CurrencyInput
                title='Default transfer tag fee'
                minFractionDigits={2}
                locale='en-US'
                value={421}
            />
            <CurrencyInput
                title='Default spare tag fee'
                minFractionDigits={2}
                locale='en-US'
                value={421}
            />
            <CurrencyInput
                title='Default spare transfer tag fee'
                minFractionDigits={2}
                locale='en-US'
                value={421}
            />
        </>
    );
};
