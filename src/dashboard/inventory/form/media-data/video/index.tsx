import "./index.css";
import { ReactElement, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { LimitationsPanel } from "dashboard/common/tooltip";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import {
    FileUpload,
    FileUploadUploadEvent,
    ItemTemplateOptions,
    FileUploadHeaderTemplateOptions,
} from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import { MediaLimitations } from "common/models/inventory";

const limitations: MediaLimitations = {
    formats: ["MP4", "MKV", "MOV"],
    codecs: "H.264, HEVC",
    minResolution: "1280x720 (up to 60P)",
    prefResolution: "FHD 1920x1080 (up to 60P)",
    maxResolution: "4K (up to 60P)",
    maxDuration: 300,
    maxSize: 32,
    maxUpload: 4,
};

export const VideoMedia = observer((): ReactElement => {
    const [checked, setChecked] = useState<boolean>(false);
    const [totalCount, setTotalCount] = useState(0);
    const fileUploadRef = useRef<FileUpload>(null);

    const onTemplateUpload = (e: FileUploadUploadEvent) => {
        setTotalCount(e.files.length);
    };

    const onTemplateRemove = (file: File, callback: Function) => {
        callback();
    };

    const itemTemplate = (inFile: object, props: ItemTemplateOptions) => {
        const file = inFile as File;
        return (
            <div className='flex align-items-center presentation'>
                <div className='flex align-items-center'>
                    <img
                        alt={file.name}
                        src={URL.createObjectURL(file)}
                        role='presentation'
                        width={29}
                        height={29}
                        className='presentation__video'
                    />
                    <span className='presentation__label flex flex-column text-left ml-3'>
                        {file.name}
                    </span>
                </div>
                <Button
                    type='button'
                    icon='pi pi-times'
                    className='p-button presentation__remove-button'
                    onClick={() => onTemplateRemove(file, props.onRemove)}
                />
            </div>
        );
    };

    const chooseTemplate = ({ chooseButton }: FileUploadHeaderTemplateOptions) => {
        return (
            <div className='w-full flex justify-content-center flex-wrap mb-3 video-choose'>
                {totalCount ? (
                    <div className='video-choose__selected flex align-items-center'>
                        To upload more drag and drop video files
                        <span className='bold mx-3'>or</span>
                        {chooseButton}
                    </div>
                ) : (
                    <>
                        {chooseButton}
                        <div className='flex w-full justify-content-center align-items-center mt-4 relative'>
                            <span className='media__upload-text-info media__upload-text-info--bold'>
                                Up to {limitations.maxUpload} items
                            </span>
                            <span className='media__upload-text-info'>
                                Maximal size is {limitations.maxSize} Mb
                            </span>
                            {limitations.formats.map((format) => (
                                <Tag key={format} className='media__upload-tag' value={format} />
                            ))}
                            <div className='media-tooltip'>
                                <LimitationsPanel>
                                    <p>
                                        <b> Supported codecs</b>: {limitations.codecs}
                                    </p>
                                    <p>
                                        <b>Supported formats</b>:
                                        {limitations.formats.map((format, index) => (
                                            <span key={index}>
                                                {format}
                                                {index !== limitations.formats.length - 1 && ", "}
                                            </span>
                                        ))}
                                    </p>
                                    <p>
                                        <b>Minimal resolution</b>: {limitations.minResolution}
                                    </p>
                                    <p>
                                        <b>Preffered resolution</b>: {limitations.prefResolution}
                                    </p>
                                    <p>
                                        <b>Maximal resolution</b>: {limitations.maxResolution}
                                    </p>
                                    <p>
                                        <b>Maximal duration</b>: {limitations.maxDuration} seconds
                                    </p>
                                    <p>
                                        <b>Maximal size</b>: {limitations.maxSize} MBytes
                                    </p>
                                    <p>
                                        <b>Batch upload</b>: Up to {limitations.maxUpload} items
                                    </p>
                                </LimitationsPanel>
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <div className='grid'>
                <div className='flex align-items-center flex-column col-12'>
                    <i className='pi pi-cloud-upload media__upload-icon' />
                    <span className=' media__upload-icon-label'>
                        Drag and drop Video files here
                    </span>
                </div>
                <div className='col-12 flex justify-content-center align-items-center media__upload-splitter'>
                    <hr className='media__line mr-4 flex-1' />
                    <span>or</span>
                    <hr className='media__line ml-4 flex-1' />
                </div>
            </div>
        );
    };

    const chooseOptions = {
        className: "media__button",
        label: "Choose from files",
        icon: "none",
    };

    return (
        <div className='media grid'>
            <FileUpload
                ref={fileUploadRef}
                multiple
                accept='video/*'
                maxFileSize={limitations.maxSize * 1000000}
                onUpload={onTemplateUpload}
                headerTemplate={chooseTemplate}
                itemTemplate={itemTemplate}
                emptyTemplate={emptyTemplate}
                chooseOptions={chooseOptions}
                progressBarTemplate={<></>}
                className='col-12'
            />
            <div className='col-12 mt-4 media-input'>
                <Dropdown className='media-input__dropdown' placeholder='Category' />
                <InputText className='media-input__text' placeholder='Comment' />
                <Button
                    severity={totalCount ? "success" : "secondary"}
                    disabled={!totalCount}
                    className='p-button media-input__button'
                >
                    Save
                </Button>
            </div>
            <div className='media__uploaded media-uploaded'>
                <h2 className='media-uploaded__title uppercase m-0'>uploaded video files</h2>
                <hr className='media-uploaded__line flex-1' />
                <label className='cursor-pointer media-uploaded__label'>
                    <Checkbox
                        checked={checked}
                        onChange={() => {
                            setChecked(!checked);
                        }}
                        className='media-uploaded__checkbox'
                    />
                    Export to Web
                </label>
            </div>
            <div className='media-videos'>
                <div className='w-full text-center'>No video files added yet.</div>
            </div>
        </div>
    );
});
