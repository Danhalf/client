import "./index.css";
import { ReactElement, useRef, useState } from "react";
// import { useStore } from "store/hooks";
import { observer } from "mobx-react-lite";
import { Toast } from "primereact/toast";
import {
    FileUpload,
    FileUploadHeaderTemplateOptions,
    FileUploadProps,
    FileUploadSelectEvent,
    FileUploadUploadEvent,
    ItemTemplateOptions,
} from "primereact/fileupload";
import { ProgressBar } from "primereact/progressbar";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { Tag } from "primereact/tag";

// export const ImagesMedia = observer((): ReactElement => {
//  const store = useStore().inventoryStore;
//  const { inventory, changeInventory } = store;

//  return (

//  )
// });

export const ImagesMedia = () => {
    const toast = useRef<Toast>(null);
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef<FileUpload>(null);

    const onTemplateSelect = (e: FileUploadUploadEvent) => {
        let _totalSize = totalSize;
        let files = e.files;

        for (let i = 0; i < files.length; i++) {
            _totalSize += files[i].size || 0;
        }

        setTotalSize(_totalSize);
    };

    const onTemplateUpload = (e: FileUploadUploadEvent) => {
        let _totalSize = 0;

        e.files.forEach((file) => {
            _totalSize += file.size || 0;
        });

        setTotalSize(_totalSize);
        toast.current?.show({ severity: "info", summary: "Success", detail: "File Uploaded" });
    };

    const onTemplateRemove = (file: File, callback: Function) => {
        setTotalSize(totalSize - file.size);
        callback();
    };

    // const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {
    //     return <></>;
    // };

    const itemTemplate = (inFile: object, props: ItemTemplateOptions) => {
        const file = inFile as File;
        return (
            <div className='flex align-items-center flex-wrap'>
                <div className='flex align-items-center'>
                    <img alt={file.name} role='presentation' width={100} />
                    <span className='flex flex-column text-left ml-3'>{file.name}</span>
                </div>
                <Button
                    type='button'
                    icon='pi pi-times'
                    className='p-button-outlined p-button-rounded p-button-danger'
                    onClick={() => onTemplateRemove(file, props.onRemove)}
                />
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <>
                <div className='flex align-items-center flex-column'>
                    <i
                        className='pi pi-cloud-upload mt-3 p-5'
                        style={{
                            fontSize: "4em",
                            borderRadius: "50%",
                            color: "var(--admss-app-medium-blue)",
                        }}
                    ></i>
                    <span
                        style={{ fontSize: "1.2em", color: "var(--admss-app-primary)" }}
                        className=''
                    >
                        Drag and Drop Images Here
                    </span>
                </div>
                <div
                    style={{
                        backgroundColor: "transparent",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <Button type='button' className='p-button' onClick={() => {}}>
                        Choose from files
                    </Button>
                </div>
            </>
        );
    };

    const chooseOptions = {
        icon: "pi pi-fw pi-images",
        className: "button-primary",
    };
    const uploadOptions = {
        icon: "pi pi-fw pi-cloud-upload",
        className: "custom-upload-btn p-button-success p-button-rounded p-button-outlined",
    };
    const cancelOptions = {
        icon: "pi pi-fw pi-times",
        className: "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined",
    };

    return (
        <div>
            <Toast ref={toast}></Toast>

            <Tooltip target='.custom-choose-btn' content='Choose from files' position='bottom' />
            <Tooltip target='.custom-upload-btn' content='Upload' position='bottom' />

            <FileUpload
                ref={fileUploadRef}
                name='demo[]'
                url='/api/upload'
                multiple
                accept='image/*'
                maxFileSize={1000000}
                onUpload={onTemplateUpload}
                //  onSelect={onTemplateSelect}
                headerTemplate={<></>}
                itemTemplate={itemTemplate}
                emptyTemplate={emptyTemplate}
                chooseOptions={chooseOptions}
                uploadOptions={uploadOptions}
                cancelOptions={cancelOptions}
            />
        </div>
    );
};
