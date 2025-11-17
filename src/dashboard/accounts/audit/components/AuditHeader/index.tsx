import { ReactElement } from "react";
import { Button } from "primereact/button";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { GlobalSearchInput } from "dashboard/common/form/inputs";
import { TruncatedText } from "dashboard/common/display";

interface AuditHeaderProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    onPrint: () => void;
    onDownload: () => void;
    isLoading: boolean;
    selectedAccountType: string;
    onAccountTypeChange: (type: string) => void;
}

export default function AuditHeader({
    searchValue,
    onSearchChange,
    onPrint,
    onDownload,
    isLoading,
    selectedAccountType,
    onAccountTypeChange,
}: AuditHeaderProps): ReactElement {
    const accountTypeOptions = [
        { name: "Buy Here Pay Here", value: "Buy Here Pay Here" },
        { name: "Cash Deal", value: "Cash Deal" },
        { name: "Cash Deal with Outside Financing", value: "Cash Deal with Outside Financing" },
        { name: "Cash Deal with Outside Lease", value: "Cash Deal with Outside Lease" },
        { name: "Cash Deal for Related Finance", value: "Cash Deal for Related Finance" },
        { name: "Wholesale", value: "Wholesale" },
        { name: "Dismantled", value: "Dismantled" },
        { name: "Lease Here Pay Here", value: "Lease Here Pay Here" },
    ];

    const accountTypeItemTemplate = (option: { name: string; value: string }) => {
        return <div className='accounts-filter__item'>{option?.name}</div>;
    };

    const accountTypeSelectedItemTemplate = (option: { name: string; value: string }) => {
        return (
            <TruncatedText className='accounts-filter__selected' withTooltip text={option?.name} />
        );
    };

    return (
        <div className='datatable-controls'>
            <span className='p-float-label accounts-filter-wrapper'>
                <Dropdown
                    optionValue='value'
                    optionLabel='name'
                    inputId='account-type-input'
                    value={selectedAccountType}
                    options={accountTypeOptions}
                    valueTemplate={accountTypeSelectedItemTemplate}
                    className='accounts-filter'
                    itemTemplate={accountTypeItemTemplate}
                    onChange={(e: DropdownChangeEvent) => {
                        onAccountTypeChange(e.value);
                    }}
                />
                <label className='float-label' htmlFor='account-type-input'>
                    Filter by
                </label>
                {selectedAccountType && (
                    <Button
                        icon='pi pi-times'
                        type='button'
                        className='accounts-filter__clear-button'
                        onClick={() => onAccountTypeChange("")}
                    />
                )}
            </span>
            <Button
                severity='success'
                type='button'
                icon='icon adms-print'
                tooltip='Print accounts form'
                onClick={onPrint}
                disabled={isLoading}
            />
            <Button
                severity='success'
                type='button'
                icon='icon adms-download'
                tooltip='Download accounts form'
                onClick={onDownload}
                disabled={isLoading}
            />

            <div className='ml-auto'>
                <GlobalSearchInput
                    value={searchValue}
                    onInputChange={onSearchChange}
                    enableDebounce
                />
            </div>
        </div>
    );
}
