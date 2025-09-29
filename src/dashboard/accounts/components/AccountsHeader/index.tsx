import { ReactElement } from "react";
import { Button } from "primereact/button";
import { GlobalSearchInput } from "dashboard/common/form/inputs";

interface AccountsHeaderProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    onAdvancedSearch: () => void;
    onPrint: () => void;
    onDownload: () => void;
    isLoading: boolean;
}

export default function AccountsHeader({
    searchValue,
    onSearchChange,
    onAdvancedSearch,
    onPrint,
    onDownload,
    isLoading,
}: AccountsHeaderProps): ReactElement {
    return (
        <div className='grid datatable-controls'>
            <GlobalSearchInput
                value={searchValue}
                onChange={(event) => onSearchChange(event.target.value)}
                enableDebounce
            />
            <Button
                className='contact-top-controls__button'
                label='Advanced search'
                severity='success'
                type='button'
                onClick={onAdvancedSearch}
            />
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
        </div>
    );
}
