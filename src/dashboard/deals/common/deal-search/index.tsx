import { Dialog } from "primereact/dialog";
import { SearchInput } from "dashboard/common/form/inputs";
import { QueryParams } from "common/models/query-params";
import { useState } from "react";
import { DropdownChangeEvent, DropdownProps } from "primereact/dropdown";
import { Deal } from "common/models/deals";
import { useStore } from "store/hooks";
import { DealsDataTable } from "dashboard/deals";
import { getDealsList } from "http/services/deals.service";
import { ALL_FIELDS, RETURNED_FIELD_TYPE } from "common/constants/fields";
import { useToastMessage } from "common/hooks";

const FIELD: keyof Deal = "contactinfo";

interface DealSearchProps extends DropdownProps {
    onRowClick?: (dealName: string) => void;
    originalPath?: string;
    returnedField?: RETURNED_FIELD_TYPE<Deal>;
    getFullInfo?: (deal: Deal) => void;
    onClear?: () => void;
    validateOnBlur?: boolean;
}

export const DealSearch = ({
    name,
    value,
    onRowClick,
    onChange,
    originalPath,
    returnedField,
    getFullInfo,
    onClear,
    validateOnBlur = false,
    ...props
}: DealSearchProps) => {
    const [options, setOptions] = useState<Deal[]>([]);
    const userStore = useStore().userStore;
    const { authUser } = userStore;
    const [dialogVisible, setDialogVisible] = useState<boolean>(false);
    const [isSearched, setIsSearched] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { showWarning } = useToastMessage();

    const handleDealInputChange = async (searchValue: string) => {
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
        const response = await getDealsList(authUser!.useruid, params);

        if (Array.isArray(response)) {
            setOptions(response);
        } else {
            setOptions([]);
        }
        setIsSearched(true);
        setIsLoading(false);
    };

    const handleOnRowClick = (dealName: string) => {
        onRowClick && onRowClick(dealName);
        setDialogVisible(false);
    };

    const handleGetFullInfo = (deal: Deal) => {
        getFullInfo && getFullInfo(deal);
        setDialogVisible(false);
    };

    const handleOnChange = (event: DropdownChangeEvent) => {
        const selectedValue = event.value;

        if (returnedField === ALL_FIELDS) {
            const selectedDeal = options.find((deal) => deal[FIELD] === selectedValue);

            if (selectedDeal && getFullInfo) {
                getFullInfo(selectedDeal);
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
        const matchedDeal = options.find((deal) => deal[field] === value);

        if (matchedDeal) {
            if (returnedField === ALL_FIELDS && getFullInfo) {
                getFullInfo(matchedDeal);
            }
        } else if (value.trim()) {
            showWarning("Deal not found. Only existing deals can be selected in this field.");
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
            ? [{ [FIELD]: "Deal not found" } as Deal]
            : options;

    return (
        <>
            <SearchInput
                name={name}
                title={name}
                optionValue={returnedField === ALL_FIELDS ? FIELD : returnedField || FIELD}
                optionLabel={FIELD}
                options={displayOptions}
                onInputChange={handleDealInputChange}
                value={value}
                onChange={handleOnChange}
                onBlur={validateOnBlur ? handleBlur : undefined}
                onIconClick={() => {
                    setDialogVisible(true);
                }}
                {...props}
            />
            <Dialog
                header={<div className='uppercase'>Choose a Deal</div>}
                visible={dialogVisible}
                style={{ width: "75vw", height: "75vh" }}
                maximizable
                modal
                onHide={() => setDialogVisible(false)}
            >
                <DealsDataTable
                    onRowClick={handleOnRowClick}
                    originalPath={originalPath}
                    returnedField={
                        returnedField === ALL_FIELDS ? undefined : (returnedField as keyof Deal)
                    }
                    getFullInfo={handleGetFullInfo}
                />
            </Dialog>
        </>
    );
};
