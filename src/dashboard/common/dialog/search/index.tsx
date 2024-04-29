import { ReactElement, useCallback, useEffect, useState } from "react";
import { DashboardDialog, DashboardDialogProps } from "..";
import { InputText } from "primereact/inputtext";
import "./index.css";
import { Dropdown, DropdownProps } from "primereact/dropdown";
import { AuthUser } from "http/services/auth.service";
import { LS_APP_USER } from "common/constants/localStorage";
import {
    ListData,
    MakesListData,
    getInventoryAutomakesList,
    getInventoryExteriorColorsList,
    getInventoryInteriorColorsList,
} from "http/services/inventory-service";
import { getKeyValue } from "services/local-storage.service";

export interface SearchField<T> {
    key: keyof T & string;
    value: string | undefined;
    type: "text" | "dropdown";
}
interface AdvancedSearchDialogProps<T> extends DashboardDialogProps {
    onInputChange: (key: keyof T, value: string) => void;
    fields: SearchField<T>[];
    onSearchClear?: (key: keyof T) => void;
}
export const AdvancedSearchDialog = <T,>({
    visible,
    buttonDisabled,
    onHide,
    onInputChange,
    onSearchClear,
    fields,
    action,
}: AdvancedSearchDialogProps<T>): ReactElement => {
    const [automakesList, setAutomakesList] = useState<MakesListData[]>([]);
    const [automakesModelList, setAutomakesModelList] = useState<ListData[]>([]);

    useEffect(() => {
        // const authUser: AuthUser = getKeyValue(LS_APP_USER);
        getInventoryAutomakesList().then((list) => {
            if (list) {
                const upperCasedList = list.map((item) => ({
                    ...item,
                    name: item.name.toUpperCase(),
                }));
                setAutomakesList(upperCasedList);
            }
        });
    }, []);

    // const handleSelectMake = useCallback(() => {
    //     getAutoMakeModelList(makeSting).then((list) => {
    //         if (list && Object.keys(list).length) {
    //             setAutomakesModelList(list);
    //         } else {
    //             setAutomakesModelList([]);
    //         }
    //     });
    // }, [inventory.Make]);

    // useEffect(() => {
    //     if (inventory.Make) handleSelectMake();
    // }, [handleSelectMake, inventory.Make]);

    const selectedAutoMakesTemplate = (option: MakesListData, props: DropdownProps) => {
        if (option) {
            return (
                <div className='flex align-items-center'>
                    <img
                        alt={option.name}
                        // src={option?.logo || defaultMakesLogo}
                        className='mr-2 vehicle-general__dropdown-icon'
                    />
                    <div>{option.name}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const autoMakesOptionTemplate = (option: MakesListData) => {
        return (
            <div className='flex align-items-center'>
                <img
                    alt={option.name}
                    // src={option?.logo || defaultMakesLogo}
                    className='mr-2 vehicle-general__dropdown-icon'
                />
                <div>{option.name}</div>
            </div>
        );
    };

    return (
        <DashboardDialog
            className='search-dialog'
            footer='Search'
            header='Advanced search'
            visible={visible}
            buttonDisabled={buttonDisabled}
            action={action}
            onHide={onHide}
        >
            <div className='flex flex-column gap-4 pt-4'>
                {fields &&
                    fields.map(({ key, value, type }) => (
                        <span className='p-float-label p-input-icon-right' key={key}>
                            {type === "text" && (
                                <InputText
                                    className='w-full'
                                    value={value ?? ""}
                                    onChange={({ target }) => onInputChange(key, target.value)}
                                />
                            )}
                            {type === "dropdown" && (
                                <Dropdown
                                    className='w-full'
                                    value={value ?? ""}
                                    onChange={({ target }) => onInputChange(key, target.value)}
                                />
                            )}
                            {value && onSearchClear && (
                                <i
                                    className='pi pi-times cursor-pointer search-dialog__clear'
                                    onClick={() => onSearchClear(key)}
                                />
                            )}
                            <label className='float-label'>{key}</label>
                        </span>
                    ))}
            </div>
        </DashboardDialog>
    );
};
