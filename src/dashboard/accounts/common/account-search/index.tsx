import { Dialog } from "primereact/dialog";
import { SearchInput } from "dashboard/common/form/inputs";
import { QueryParams } from "common/models/query-params";
import { useState } from "react";
import { DropdownProps } from "primereact/dropdown";
import { useStore } from "store/hooks";
import { AccountInfo } from "common/models/accounts";
import { getAccountsList } from "http/services/accounts.service";
import { AccountsDataTable } from "dashboard/accounts";

const FIELD: keyof AccountInfo = "name";

interface DealSearchProps extends DropdownProps {
    onRowClick?: (dealName: string) => void;
    returnedField?: keyof AccountInfo;
    getFullInfo?: (deal: AccountInfo) => void;
}

export const AccountSearch = ({
    name,
    value,
    onRowClick,
    onChange,
    returnedField,
    getFullInfo,
    ...props
}: DealSearchProps) => {
    const [options, setOptions] = useState<AccountInfo[]>([]);
    const userStore = useStore().userStore;
    const { authUser } = userStore;
    const [dialogVisible, setDialogVisible] = useState<boolean>(false);

    const handleDealInputChange = async (searchValue: string) => {
        if (!searchValue.trim()) {
            return;
        }
        const qry = returnedField ? `${searchValue}.${returnedField}` : `${searchValue}.${FIELD}`;
        const params: QueryParams = {
            qry,
        };
        const response = await getAccountsList(authUser!.useruid, params);

        if (Array.isArray(response)) {
            setOptions(response);
        } else {
            setOptions([]);
        }
    };

    const handleOnRowClick = (dealName: string) => {
        onRowClick && onRowClick(dealName);
        setDialogVisible(false);
    };

    const handleGetFullInfo = (deal: AccountInfo) => {
        getFullInfo && getFullInfo(deal);
        setDialogVisible(false);
    };

    return (
        <>
            <SearchInput
                name={name}
                title={name}
                optionValue={returnedField || FIELD}
                optionLabel={FIELD}
                options={options}
                onInputChange={handleDealInputChange}
                value={value}
                onChange={onChange}
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
                    returnedField={returnedField}
                    getFullInfo={handleGetFullInfo}
                />
            </Dialog>
        </>
    );
};
