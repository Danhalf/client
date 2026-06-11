import { ChangeEvent, ReactElement, useRef } from "react";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Loader } from "dashboard/common/loader";
import { contactFormTooltipOptions } from "dashboard/contacts/form/common/tooltip";

const SCAN_DL_TOOLTIP = "Data received from the DL's backside will fill in related fields";
const OVERWRITE_TOOLTIP = "Data received from the DL's backside will overwrite user-entered data";

interface ScanDlControlsProps {
    checkboxId: string;
    isScanning: boolean;
    allowOverwrite: boolean;
    onAllowOverwriteChange: (allowOverwrite: boolean) => void;
    onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

export const ScanDlControls = ({
    checkboxId,
    isScanning,
    allowOverwrite,
    onAllowOverwriteChange,
    onFileChange,
    className = "col-12 flex gap-4",
}: ScanDlControlsProps): ReactElement => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className={className}>
            <Button
                type='button'
                label={isScanning ? "Scanning" : "Scan driver license"}
                className={`general-info__button ${isScanning ? "general-info__button--loading" : ""}`}
                tooltip={SCAN_DL_TOOLTIP}
                tooltipOptions={contactFormTooltipOptions({ position: "mouse" })}
                outlined={!isScanning}
                onClick={() => fileInputRef.current?.click()}
                loading={isScanning}
                loadingIcon={<Loader size='small' includeText={false} color='white' />}
            />
            <input
                type='file'
                accept='image/*'
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={onFileChange}
            />
            <div className='general-info-overwrite pb-3'>
                <Checkbox
                    checked={allowOverwrite}
                    inputId={checkboxId}
                    className='general-info-overwrite__checkbox'
                    onChange={() => onAllowOverwriteChange(!allowOverwrite)}
                />
                <label htmlFor={checkboxId} className='general-info-overwrite__label'>
                    Overwrite data
                </label>
                <Button
                    text
                    tooltip={OVERWRITE_TOOLTIP}
                    icon='icon adms-help'
                    outlined
                    type='button'
                    className='general-info-overwrite__icon'
                    tooltipOptions={contactFormTooltipOptions({ position: "right" })}
                />
            </div>
        </div>
    );
};
