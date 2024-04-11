/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { observer } from "mobx-react-lite";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { ReactElement, useEffect, useRef, useState } from "react";
import "./index.css";
import { DateInput } from "dashboard/common/form/inputs";
import {
    FileUpload,
    FileUploadHeaderTemplateOptions,
    FileUploadSelectEvent,
} from "primereact/fileupload";
import { Button } from "primereact/button";
import { useStore } from "store/hooks";
import { STATES_LIST } from "common/constants/states";
import { DLSide } from "store/stores/contact";
import { useParams } from "react-router-dom";
import { Image } from "primereact/image";

const SexList = [
    {
        name: "M",
    },
    {
        name: "F",
    },
];

enum DLSides {
    FRONT = "front",
    BACK = "back",
}

export const ContactsIdentificationInfo = observer((): ReactElement => {
    const [sex, setSex] = useState<string>("");
    const { id } = useParams();
    const store = useStore().contactStore;
    const {
        contact,
        frontSideDL,
        backSideDL,
        getImagesDL,
        removeImagesDL,
        frontSideDLurl,
        backSideDLurl,
    } = store;
    const fileUploadFrontRef = useRef<FileUpload>(null);
    const fileUploadBackRef = useRef<FileUpload>(null);

    useEffect(() => {
        getImagesDL();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contact]);

    const onTemplateSelect = (e: FileUploadSelectEvent, side: DLSide) => {
        if (side === DLSides.FRONT) {
            store.frontSideDL = e.files[0];
        }
        if (side === DLSides.BACK) {
            store.backSideDL = e.files[0];
        }
    };

    const handleDeleteImage = (side: DLSide, isString: boolean = false) => {
        if (side === DLSides.FRONT) {
            fileUploadFrontRef.current?.clear();
            store.frontSideDL = {} as File;
        }
        if (side === DLSides.BACK) {
            fileUploadBackRef.current?.clear();
            store.backSideDL = {} as File;
        }
        isString && removeImagesDL();
    };

    const itemTemplate = (image: File | string, side: DLSide) => {
        const isString = typeof image === "string";
        const alt = isString ? "driven license" : image?.name;
        const src = isString ? image : URL.createObjectURL(image);
        return (
            <div className='flex align-items-center dl-presentation relative'>
                <img alt={alt} src={src} role='presentation' className='dl-presentation__image' />
                <Button
                    type='button'
                    icon='pi pi-times'
                    onClick={() => handleDeleteImage(side, isString)}
                    className='p-button dl-presentation__remove-button'
                />
            </div>
        );
    };

    const chooseTemplate = ({ chooseButton }: FileUploadHeaderTemplateOptions, side: DLSide) => {
        const { size } = side === DLSides.FRONT ? frontSideDL : backSideDL;
        return (
            <div
                className={`col-6 ml-auto flex justify-content-center flex-wrap mb-3 dl-header ${
                    size ? "dl-header__active" : ""
                }`}
            >
                {chooseButton}
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <div className='grid col-6 ml-auto'>
                <div className='flex align-items-center flex-column col-12'>
                    <i className='pi pi-cloud-upload dl__upload-icon' />
                    <span className='text-center dl__upload-icon-label'>
                        Drag and Drop Images Here
                    </span>
                </div>
                <div className='col-12 flex justify-content-center align-items-center dl__upload-splitter'>
                    <hr className='dl__line mr-4 flex-1' />
                    <span>or</span>
                    <hr className='dl__line ml-4 flex-1' />
                </div>
            </div>
        );
    };

    return (
        <div className='grid address-info row-gap-2'>
            <div className='col-3'>
                <Dropdown
                    optionLabel='name'
                    optionValue='name'
                    filter
                    placeholder="DL's State"
                    value={contact?.extdata?.Buyer_DL_State}
                    options={STATES_LIST}
                    className='w-full identification-info__dropdown'
                />
            </div>

            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText
                        className='identification-info__text-input w-full'
                        value={contact?.extdata?.Buyer_Driver_License_Num}
                    />
                    <label className='float-label'>Driver License's Number</label>
                </span>
            </div>

            <div className='col-3 mr-2'>
                <DateInput
                    placeholder="DL's exp. date"
                    value={contact?.extdata?.Buyer_DL_Exp_Date}
                    className='identification-info__date-input w-full'
                />
            </div>

            <div className='col-3'>
                <Dropdown
                    optionLabel='name'
                    optionValue='name'
                    filter
                    placeholder='Sex'
                    value={contact?.extdata?.Buyer_Sex || sex}
                    options={SexList}
                    onChange={({ target: { value } }) => setSex(value)}
                    className='w-full identification-info__dropdown'
                />
            </div>

            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText
                        className='identification-info__text-input w-full'
                        value={contact?.extdata?.Buyer_SS_Number}
                    />
                    <label className='float-label'>Social Security Number</label>
                </span>
            </div>

            <div className='col-3'>
                <DateInput
                    placeholder='Date of Birth'
                    value={contact?.extdata?.Buyer_Date_Of_Birth}
                    className='identification-info__date-input w-full'
                />
            </div>
            {id && (
                <>
                    <div className='flex col-12'>
                        <h3 className='identification__title m-0 pr-3'>Driver license's photos</h3>
                        <hr className='identification__line flex-1' />
                    </div>

                    <div
                        className={`col-6 identification-dl ${
                            frontSideDL.size ? "identification-dl__active" : ""
                        }`}
                    >
                        <div className='identification-dl__title'>Frontside</div>
                        {frontSideDLurl ? (
                            itemTemplate(frontSideDLurl, DLSides.FRONT)
                        ) : (
                            <FileUpload
                                ref={fileUploadFrontRef}
                                accept='image/*'
                                headerTemplate={(props) => chooseTemplate(props, DLSides.FRONT)}
                                itemTemplate={(file) => itemTemplate(file as File, DLSides.FRONT)}
                                emptyTemplate={emptyTemplate}
                                onSelect={(event) => onTemplateSelect(event, DLSides.FRONT)}
                                progressBarTemplate={<></>}
                            />
                        )}
                    </div>
                    <div
                        className={`col-6 identification-dl ${
                            backSideDL.size ? "identification-dl__active" : ""
                        }`}
                    >
                        <div className='identification-dl__title'>Backside</div>
                        <FileUpload
                            ref={fileUploadBackRef}
                            accept='image/*'
                            headerTemplate={(props) => chooseTemplate(props, DLSides.BACK)}
                            itemTemplate={(file) => itemTemplate(file as File, DLSides.BACK)}
                            emptyTemplate={emptyTemplate}
                            onSelect={(event) => onTemplateSelect(event, DLSides.BACK)}
                            progressBarTemplate={<></>}
                        />
                    </div>
                </>
            )}
        </div>
    );
});
