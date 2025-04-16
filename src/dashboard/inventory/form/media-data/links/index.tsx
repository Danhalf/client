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
import { useToast } from "dashboard/common/toast";
import { MediaLinkRowExpansionTemplate } from "./link-item";
import { MediaItem, UploadMediaLink } from "common/models/inventory";
import { DataTable, DataTableRowClickEvent } from "primereact/datatable";
import { Column } from "primereact/column";

const isValidUrl = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

export const LinksMedia = observer((): ReactElement => {
    const store = useStore().inventoryStore;
    const { id } = useParams();
    const toast = useToast();
    const [expandedRows, setExpandedRows] = useState<MediaItem[]>([]);
    const [isUrlValid, setIsUrlValid] = useState(true);
    const {
        getInventory,
        saveInventoryLinks,
        uploadFileLinks,
        links,
        isLoading,
        fetchLinks,
        clearMedia,
        isFormChanged,
        formErrorMessage,
    } = store;

    useEffect(() => {
        if (id) {
            isFormChanged ? fetchLinks() : getInventory(id).then(() => fetchLinks());
        }

        return () => {
            clearMedia();
        };
    }, [fetchLinks, id]);

    useEffect(() => {
        if (formErrorMessage) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: formErrorMessage,
            });
        }
    }, [formErrorMessage, toast]);

    const handleCategorySelect = (e: DropdownChangeEvent) => {
        store.uploadFileLinks = {
            ...store.uploadFileLinks,
            contenttype: e.target.value,
        };
    };

    const handleCommentaryChange = (e: ChangeEvent<HTMLInputElement>) => {
        store.uploadFileLinks = {
            ...store.uploadFileLinks,
            notes: e.target.value,
        };
    };

    const handleUrlChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const url = e.target.value;
        const isValid = url ? isValidUrl(url) : true;
        setIsUrlValid(isValid);

        store.uploadFileLinks = {
            ...uploadFileLinks,
            mediaurl: url,
        };
    };

    const handleUploadLink = () => {
        if (formErrorMessage) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: formErrorMessage,
            });
            return;
        }

        saveInventoryLinks();
    };

    const handleCopyLink = (url: string) => {
        navigator.clipboard
            .writeText(url)
            .then(() => {
                toast.current?.show({
                    severity: "success",
                    summary: "Success",
                    detail: "URL copied to clipboard",
                });
            })
            .catch(() => {
                toast.current?.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Failed to copy URL",
                });
            });
    };

    const handleNavigateToLink = (url: string) => {
        if (url) {
            window.open(url, "_blank");
        } else {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: "Invalid URL",
            });
        }
    };

    const handleRowExpansionClick = (data: MediaItem) => {
        const index = expandedRows.findIndex((item) => item.itemuid === data.itemuid);
        if (index === -1) {
            setExpandedRows([...expandedRows, data]);
        } else {
            const newExpandedRows = [...expandedRows];
            newExpandedRows.splice(index, 1);
            setExpandedRows(newExpandedRows);
        }
    };

    const rowExpansionTemplate = (data: MediaItem) => {
        return (
            <MediaLinkRowExpansionTemplate
                notes={data.info?.notes}
                contenttype={data.info?.contenttype}
            />
        );
    };

    const actionColumnTemplate = (rowData: MediaItem) => {
        const mediaUrl = (rowData.info as UploadMediaLink)?.mediaurl || "";
        return (
            <div className='flex gap-2'>
                <Button
                    tooltip='Navigate to link'
                    type='button'
                    className='inventory-links__navigate-button'
                    icon='adms-open'
                    text
                    onClick={() => handleNavigateToLink(mediaUrl)}
                />
                <Button
                    tooltip='Copy link'
                    type='button'
                    className='inventory-links__copy-button'
                    icon='adms-copy'
                    text
                    onClick={() => handleCopyLink(mediaUrl)}
                />
                <Button
                    tooltip='Delete link'
                    type='button'
                    className='inventory-links__delete-button'
                    icon='icon adms-trash-can'
                    text
                />
            </div>
        );
    };

    const numberColumnTemplate = (rowData: MediaItem, { rowIndex }: { rowIndex: number }) => {
        return (
            <div className='flex gap-2'>
                <span className='link-number'>{rowIndex + 1}</span>
                <Button
                    tooltip='Expand'
                    type='button'
                    className='inventory-links__expand-button'
                    icon='pi pi-angle-down'
                    text
                    onClick={() => handleRowExpansionClick(rowData)}
                />
            </div>
        );
    };

    const handleRowToggle = (e: DataTableRowClickEvent) => {
        setExpandedRows(e.data as MediaItem[]);
    };

    const linkControlTemplate = () => {
        return (
            <div className='link-control p-0 flex justify-content-center'>
                <Button
                    icon='pi pi-arrow-circle-up'
                    type='button'
                    rounded
                    text
                    severity='success'
                    tooltip='Up'
                    className='p-button-text link-control__button'
                />
                <Button
                    icon='pi pi-arrow-circle-down'
                    type='button'
                    rounded
                    text
                    severity='success'
                    tooltip='Down'
                    className='p-button-text link-control__button'
                />
            </div>
        );
    };

    return (
        <div className='media-links grid'>
            {isLoading && <Loader overlay />}
            <div className='col-12'>
                <span className='p-float-label'>
                    <InputTextarea
                        className='media-links__textarea w-full'
                        value={uploadFileLinks?.mediaurl || ""}
                        onChange={handleUrlChange}
                    />
                    <label htmlFor='link'>URL</label>
                </span>
            </div>

            <div className='col-12 mt-2 media-input'>
                <Dropdown
                    className='media-input__dropdown'
                    placeholder='Category'
                    optionLabel={"name"}
                    optionValue={"id"}
                    options={[...CATEGORIES]}
                    value={uploadFileLinks?.contenttype || 0}
                    onChange={handleCategorySelect}
                />
                <InputText
                    className='media-input__text'
                    placeholder='Comment'
                    value={uploadFileLinks?.notes || ""}
                    onChange={handleCommentaryChange}
                />
                <Button
                    type='button'
                    disabled={isLoading || !isUrlValid || !uploadFileLinks?.mediaurl}
                    tooltip={!isUrlValid ? "Please enter a valid URL" : ""}
                    tooltipOptions={{ showOnDisabled: true, position: "mouse" }}
                    severity={!isUrlValid ? "secondary" : "success"}
                    className='p-button media-input__button'
                    onClick={handleUploadLink}
                >
                    Save
                </Button>
            </div>
            <div className='media-links mt-4 col-12'>
                <div className='inventory-content w-full'>
                    {links.length ? (
                        <DataTable
                            value={links}
                            rowExpansionTemplate={rowExpansionTemplate}
                            expandedRows={expandedRows}
                            onRowToggle={handleRowToggle}
                            className='media-links-table'
                        >
                            <Column body={linkControlTemplate} style={{ width: "10%" }} />
                            <Column
                                header='#'
                                body={numberColumnTemplate}
                                style={{ width: "10%" }}
                            />
                            <Column field='info.mediaurl' header='URL' style={{ width: "65%" }} />
                            <Column body={actionColumnTemplate} style={{ width: "15%" }} />
                        </DataTable>
                    ) : (
                        <div className='media-links__empty'>No links added yet.</div>
                    )}
                </div>
            </div>
        </div>
    );
});
