import "./index.css";
import { useEffect, useRef, useState } from "react";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { FileUpload, FileUploadHeaderTemplateOptions } from "primereact/fileupload";
import { MediaLimits } from "common/models";
import { Tag } from "primereact/tag";
import { InputNumber } from "primereact/inputnumber";
import { Accordion, AccordionTab } from "primereact/accordion";
import { getUserGeneralSettings, getWatermark } from "http/services/settings.service";
import { useToast } from "dashboard/common/toast";
import { TOAST_LIFETIME } from "common/settings";
import { useStore } from "store/hooks";
import { GeneralSettings } from "common/models/general-settings";

const limitations: MediaLimits = {
    formats: ["PNG", "JPEG"],
    maxResolution: "1200x1200",
    maxSize: 2,
};

interface LogoSettings {
    isActive: boolean;
    x?: number;
    y?: number;
}

export const SettingsWatermarking = () => {
    const userStore = useStore().userStore;
    const { authUser } = userStore;
    const [enableWatermark, setEnableWatermark] = useState<boolean>(false);
    const [logoSettings, setLogoSettings] = useState<LogoSettings>({ isActive: false });
    const fileUploadRef = useRef<FileUpload>(null);
    const toast = useToast();

    const handleGetWatermark = async () => {
        if (!authUser) return;
        const userSettings = await getUserGeneralSettings();
        if (userSettings && userSettings.error) {
            return toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: userSettings.error,
                life: TOAST_LIFETIME,
            });
        }
        const settingsResponse = userSettings as GeneralSettings;
        if (!settingsResponse.logomediauid) return;
        const watermark = await getWatermark(settingsResponse.logomediauid);
        if (watermark.error) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: watermark.error,
                life: TOAST_LIFETIME,
            });
        } else {
            setLogoSettings({
                isActive: !!settingsResponse.logoenabled,
                x: settingsResponse.logoposX,
                y: settingsResponse.logoposY,
            });
        }
    };

    useEffect(() => {
        handleGetWatermark();
    }, []);

    const itemTemplate = (inFile: object) => {
        const file = inFile as File;
        return (
            <div className='flex align-items-center presentation'>
                <div className='flex align-items-center w-full'>
                    <img
                        alt={file.name}
                        src={URL.createObjectURL(file)}
                        role='presentation'
                        width={"100%"}
                        height={"100%"}
                        className='presentation__image'
                    />
                </div>
                <Button
                    type='button'
                    icon='pi pi-times'
                    className='p-button presentation__remove-button'
                    onClick={() => fileUploadRef.current?.clear()}
                />
            </div>
        );
    };

    const chooseTemplate = ({ chooseButton }: FileUploadHeaderTemplateOptions) => (
        <>
            <div className='image-choose'>{chooseButton}</div>
            <div className='upload-info'>
                <span className='media__upload-text-info'>
                    Max resolution: {limitations.maxResolution}px
                </span>
                <span className='media__upload-text-info'>
                    Max size is {limitations.maxSize} Mb
                </span>
                <div className='media__upload-formats'>
                    {limitations.formats.map((format) => (
                        <Tag key={format} className='media__upload-tag' value={format} />
                    ))}
                </div>
            </div>
        </>
    );

    const emptyTemplate = () => {
        return (
            <div className='empty-template'>
                <div className='flex align-items-center justify-content-center flex-column h-full'>
                    <i className='adms-upload media__upload-icon' />
                    <span className=' media__upload-icon-label'>Drag and drop image here</span>
                </div>
                <div className='media__upload-splitter h-full'>
                    <div className='media__line' />
                    <span>or</span>
                    <div className='media__line' />
                </div>
            </div>
        );
    };

    return (
        <div className='settings-form watermarking'>
            <div className='settings-form__title'>Watermarking</div>
            <div className='grid align-items-center'>
                <div className='col-6 p-0'>
                    <Checkbox
                        inputId='enableWatermark'
                        name='enableWatermark'
                        value={enableWatermark}
                        onChange={() => setEnableWatermark(!enableWatermark)}
                        checked
                    />
                    <label htmlFor='enableWatermark' className='ml-3 white-space-nowrap'>
                        Enable watermarking
                    </label>
                </div>

                <div className='col-6 flex watermarking__buttons justify-content-end'>
                    <Button
                        label='Restore default'
                        className='watermarking__button'
                        outlined
                        type='button'
                        severity='danger'
                    />
                    <Button
                        label='Preview'
                        className='watermarking__button'
                        outlined
                        type='button'
                    />
                </div>

                <hr className='form-line' />

                <div className='col-12 p-0'>
                    <FileUpload
                        ref={fileUploadRef}
                        accept='image/*'
                        maxFileSize={limitations.maxSize * 1000000}
                        chooseLabel='Choose from files'
                        chooseOptions={{
                            icon: <></>,
                        }}
                        headerTemplate={chooseTemplate}
                        itemTemplate={itemTemplate}
                        emptyTemplate={emptyTemplate}
                        progressBarTemplate={<></>}
                        className='col-12'
                    />
                </div>

                <div className='col-12 watermarking__logo-settings'>
                    <Checkbox
                        inputId='addLogo'
                        name='addLogo'
                        value={logoSettings.isActive}
                        onChange={() =>
                            setLogoSettings({ ...logoSettings, isActive: !logoSettings.isActive })
                        }
                        checked
                    />
                    <label htmlFor='addLogo' className='ml-3'>
                        Add logo
                    </label>

                    <span className='p-float-label watermarking__input'>
                        <InputNumber
                            value={logoSettings.x}
                            allowEmpty
                            onChange={(e) => setLogoSettings({ ...logoSettings, x: e.value || 0 })}
                        />
                        <label className='float-label'>PosX</label>
                    </span>

                    <span className='p-float-label watermarking__input'>
                        <InputNumber
                            value={logoSettings.y}
                            allowEmpty
                            onChange={(e) => setLogoSettings({ ...logoSettings, y: e.value || 0 })}
                        />
                        <label className='float-label'>PosY</label>
                    </span>
                </div>

                <div className='col-12 watermarking__accordion p-0'>
                    <Accordion>
                        <AccordionTab header='TEXT BLOCK 1'>
                            <p className='m-0'></p>
                        </AccordionTab>
                    </Accordion>
                    <Button
                        icon='pi pi-plus'
                        className='watermarking__add-button'
                        label='Add new block'
                        outlined
                        type='button'
                    />
                </div>
            </div>
        </div>
    );
};
