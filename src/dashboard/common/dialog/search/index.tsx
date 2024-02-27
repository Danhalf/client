import { ChangeEvent, ReactElement } from "react";
import { DashboardDialog, DashboardDialogProps } from "..";
import { InputText } from "primereact/inputtext";

export interface SearchField<T> {
    key: keyof T & string;
    value: string | undefined;
}
interface AdvancedSearchDialogProps<T> extends DashboardDialogProps {
    visible: boolean;
    buttonDisabled: boolean;
    onInputChange: (key: keyof T, value: string) => void;
    fields: SearchField<T>[];
}
export const AdvancedSearchDialog = <T,>({
    visible,
    buttonDisabled,
    onHide,
    onInputChange,
    fields,
    action,
}: AdvancedSearchDialogProps<T>): ReactElement => {
    const handleInputClear = async (key: keyof T) => {
        onInputChange(key, "");
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
                    fields.map(({ key, value }) => (
                        <span className='p-float-label p-input-icon-right' key={key}>
                            <InputText
                                className='w-full'
                                value={value ?? ""}
                                onChange={({ target }) => onInputChange(key, target.value)}
                            />
                            {value && (
                                <i
                                    className='pi pi-times cursor-pointer'
                                    onClick={() => handleInputClear(key)}
                                />
                            )}
                            <label className='float-label'>{key}</label>
                        </span>
                    ))}
            </div>
        </DashboardDialog>
    );
};
