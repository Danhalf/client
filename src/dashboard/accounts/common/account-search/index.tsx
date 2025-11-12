import { Dialog } from "primereact/dialog";
import { SearchInput } from "dashboard/common/form/inputs";
import { QueryParams } from "common/models/query-params";
import { useState } from "react";
import { DropdownChangeEvent, DropdownProps } from "primereact/dropdown";
import { useStore } from "store/hooks";
import { AccountInfo } from "common/models/accounts";
import { getAccountsList } from "http/services/accounts.service";
import { AccountsDataTable } from "dashboard/accounts";
import { ALL_FIELDS, RETURNED_FIELD_TYPE } from "common/constants/fields";
import { useToastMessage } from "common/hooks";

const FIELD: keyof AccountInfo = "name";

interface AccountSearchProps extends DropdownProps {
    onRowClick?: (accountName: string) => void;
    returnedField?: RETURNED_FIELD_TYPE<AccountInfo>;
    getFullInfo?: (account: AccountInfo) => void;
    onClear?: () => void;
    validateOnBlur?: boolean;
}

export const AccountSearch = ({
    name,
    value,
    onRowClick,
    onChange,
    returnedField,
    getFullInfo,
    onClear,
    validateOnBlur = false,
    ...props
}: AccountSearchProps) => {
    const [options, setOptions] = useState<AccountInfo[]>([]);
    const userStore = useStore().userStore;
    const { authUser } = userStore;
    const [dialogVisible, setDialogVisible] = useState<boolean>(false);
    const [isSearched, setIsSearched] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { showWarning } = useToastMessage();

    const handleAccountInputChange = async (searchValue: string) => {
        if (!searchValue.trim()) {
            setIsSearched(false);
            setOptions([]);
            return;
        }
        setIsLoading(true);
        const field = returnedField === ALL_FIELDS ? FIELD : returnedField || FIELD;
        const qry = `${searchValue}.${field}`;
        const params: QueryParams = {
            qry,
        };
        const response = await getAccountsList(authUser!.useruid, params);

        if (Array.isArray(response)) {
            setOptions(response);
        } else {
            setOptions([]);
        }
        setIsSearched(true);
        setIsLoading(false);
    };

    const handleOnRowClick = (accountName: string) => {
        onRowClick && onRowClick(accountName);
        setDialogVisible(false);
    };

    const handleGetFullInfo = (account: AccountInfo) => {
        getFullInfo && getFullInfo(account);
        setDialogVisible(false);
    };

    const handleOnChange = (event: DropdownChangeEvent) => {
        const selectedValue = event.value;

        if (returnedField === ALL_FIELDS) {
            const selectedAccount = options.find((account) => account[FIELD] === selectedValue);

            if (selectedAccount && getFullInfo) {
                getFullInfo(selectedAccount);
            }
        }

        if (onChange) {
            onChange(event);
        }
        setIsSearched(false);
    };

    const handleBlur = () => {
        if (!validateOnBlur || !value || !value.trim() || isLoading) {
            return;
        }

        const field = returnedField === ALL_FIELDS ? FIELD : returnedField || FIELD;
        const matchedAccount = options.find((account) => account[field] === value);

        if (matchedAccount) {
            if (returnedField === ALL_FIELDS && getFullInfo) {
                getFullInfo(matchedAccount);
            }
        } else if (value.trim()) {
            showWarning("Account not found. Only existing accounts can be selected in this field.");
            if (onClear) {
                onClear();
            } else if (onChange) {
                onChange({ value: "" } as DropdownChangeEvent);
            }
        }
        setIsSearched(false);
    };

    const displayOptions =
        validateOnBlur && isSearched && options.length === 0
            ? [{ [FIELD]: "Account not found" } as AccountInfo]
            : options;

    return (
        <>
            <SearchInput
                name={name}
                title={name}
                optionValue={returnedField === ALL_FIELDS ? FIELD : returnedField || FIELD}
                optionLabel={FIELD}
                options={displayOptions}
                onInputChange={handleAccountInputChange}
                value={value}
                onChange={handleOnChange}
                onBlur={validateOnBlur ? handleBlur : undefined}
                onIconClick={() => {
                    setDialogVisible(true);
                }}
                {...props}
            />
            <Dialog
                header={<div className='uppercase'>Choose an Account</div>}
                visible={dialogVisible}
                style={{ width: "75vw", height: "75vh" }}
                maximizable
                modal
                onHide={() => setDialogVisible(false)}
            >
                <AccountsDataTable
                    onRowClick={handleOnRowClick}
                    returnedField={
                        returnedField === ALL_FIELDS
                            ? undefined
                            : (returnedField as keyof AccountInfo)
                    }
                    getFullInfo={handleGetFullInfo}
                />
            </Dialog>
        </>
    );
};
