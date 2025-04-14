import "./index.css";
import { ChangeEvent, ReactElement, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useParams } from "react-router-dom";
import { useStore } from "store/hooks";
import { CATEGORIES } from "common/constants/media-categories";
import { Loader } from "dashboard/common/loader";
import { InputTextarea } from "primereact/inputtextarea";

export const LinksMedia = observer((): ReactElement => {
    const store = useStore().inventoryStore;
    const { id } = useParams();
    const {
        getInventory,
        saveInventoryLinks,
        uploadFileLinks,
        // uploadFileLinks,
        links,
        isLoading,
        // removeMedia,
        fetchLinks,
        clearMedia,
        isFormChanged,
    } = store;
    const [totalCount] = useState<number>(0);

    useEffect(() => {
        if (id) {
            isFormChanged ? fetchLinks() : getInventory(id).then(() => fetchLinks());
        }

        return () => {
            clearMedia();
        };
    }, [fetchLinks, id]);

    const handleCategorySelect = (e: DropdownChangeEvent) => {
        // store.uploadFileLinks = {
        //     ...store.uploadFileLinks,
        //     data: {
        //         ...store.uploadFileLinks.data,
        //         contenttype: e.target.value,
        //     },
        // };
    };

    const handleCommentaryChange = (e: ChangeEvent<HTMLInputElement>) => {
        // store.uploadFileLinks = {
        //     ...store.uploadFileLinks,
        //     data: {
        //         ...store.uploadFileLinks.data,
        //         notes: e.target.value,
        //     },
        // };
    };

    const handleDeleteLink = (mediauid: string) => {
        // removeMedia(mediauid, fetchLinks);
    };

    return (
        <div className='media grid'>
            {isLoading && <Loader overlay />}
            <div className='col-12'>
                <span className='p-float-label'>
                    <InputTextarea
                        className='media-input__text w-full'
                        value={uploadFileLinks?.data?.mediaurl || ""}
                        onChange={(e) => {
                            store.uploadFileLinks = {
                                ...store.uploadFileLinks,
                                data: { ...store.uploadFileLinks.data, mediaurl: e.target.value },
                            };
                        }}
                    />
                    <label htmlFor='link'>Link</label>
                </span>
            </div>

            <div className='col-12 mt-4 media-input'>
                <Dropdown
                    className='media-input__dropdown'
                    placeholder='Category'
                    optionLabel={"name"}
                    optionValue={"id"}
                    options={[...CATEGORIES]}
                    // value={uploadFileLinks?.data?.contenttype || 0}
                    onChange={handleCategorySelect}
                />
                <InputText
                    className='media-input__text'
                    placeholder='Comment'
                    // value={uploadFileLinks?.data?.notes || ""}
                    onChange={handleCommentaryChange}
                />
                <Button
                    severity={totalCount ? "success" : "secondary"}
                    disabled={!totalCount || isLoading}
                    className='p-button media-input__button'
                    onClick={saveInventoryLinks}
                >
                    Save
                </Button>
            </div>
            <div className='media__uploaded media-uploaded'>
                <h2 className='media-uploaded__title uppercase m-0'>uploaded links</h2>
                <hr className='media-uploaded__line flex-1' />
            </div>
            <div className='media-links'>
                {links.length ? (
                    links.map(({ info }: any, index: number) => {
                        return (
                            <div key={info} className='media-links__item'>
                                <div className='media-links__info link-info'>
                                    <div className='link-info__item'>
                                        <span className='link-info__icon'>
                                            <i className='pi pi-th-large' />
                                        </span>
                                        <span className='link-info__text--bold'>
                                            {
                                                CATEGORIES.find(
                                                    (category) => category.id === info?.contenttype
                                                )?.name
                                            }
                                        </span>
                                    </div>
                                    <div className='link-info__item'>
                                        <span className='link-info__icon'>
                                            <span className='link-info__icon'>
                                                <i className='pi pi-comment' />
                                            </span>
                                        </span>
                                        <span className='link-info__text'>{info?.notes}</span>
                                    </div>
                                    <div className='link-info__item'>
                                        <span className='link-info__icon'>
                                            <i className='pi pi-calendar' />
                                        </span>
                                        <span className='link-info__text'>{info?.created}</span>
                                    </div>
                                </div>
                                <button
                                    className='media-links__close'
                                    onClick={() => handleDeleteLink(info)}
                                >
                                    <i className='pi pi-times' />
                                </button>
                            </div>
                        );
                    })
                ) : (
                    <div className='w-full text-center'>No links added yet.</div>
                )}
            </div>
        </div>
    );
});
