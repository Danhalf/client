import { authorizedUserApiInstance } from "../index";
import { QueryParams } from "common/models/query-params";
import {
    Contact,
    ContactUser,
    ContactsCategories,
    SalespersonsList,
    ScanBarcodeDL,
    SetContactResponse,
    TotalUsers,
} from "common/models/contact";
import { BaseResponseError, Status } from "common/models/base-response";
import { isAxiosError } from "axios";
import { ListData } from "common/models";
import {
    InventoryMedia,
    InventoryMediaPostData,
    InventorySetResponse,
} from "common/models/inventory";
import { BaseResponse } from "common/models/base-response";

export const getContacts = async (uid: string, queryParams?: QueryParams) => {
    try {
        const request = await authorizedUserApiInstance.get<ContactUser[]>(`contacts/${uid}/list`, {
            params: queryParams,
        });
        return request.data;
    } catch (error) {
        // TODO: add error handler
    }
};

export const getContactsAmount = async (uid: string, queryParams: QueryParams) => {
    try {
        const request = await authorizedUserApiInstance.get<TotalUsers>(`contacts/${uid}/list`, {
            params: queryParams,
        });
        return request.data;
    } catch (error) {
        // TODO: add error handler
    }
};

export const getContactInfo = async (uid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<Contact>(`contacts/${uid}/info`);
        return request.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while getting contact info",
            };
        }
    }
};

export const getContactsTypeList = async (uid: string | "0") => {
    try {
        const request = await authorizedUserApiInstance.get<ContactsCategories>(
            `contacts/${uid}/listtypes`
        );
        if (request.data.status === Status.OK) {
            return request.data?.contact_types;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error on get contacts type list",
            };
        }
    }
};

export const getContactDeleteReasonsList = async (uid: string | "0") => {
    try {
        const request = await authorizedUserApiInstance.get<ListData[]>(
            `contacts/${uid}/listdeletionreasons`
        );
        return request.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while getting contact delete reasons",
            };
        }
    }
};

export const getContactsSalesmanList = async (uid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<SalespersonsList[] | BaseResponseError>(
            `user/${uid}/salespersons`
        );
        return request.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while getting contacts salesman list",
            };
        }
    }
};

export const setContact = async (
    contactuid: string | null,
    contactData: Partial<Contact>
): Promise<BaseResponseError | undefined> => {
    try {
        const response = await authorizedUserApiInstance.post<SetContactResponse>(
            `contacts/${contactuid || 0}/set`,
            contactData
        );

        return response.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error:
                    error.response?.data.info ||
                    error.response?.data.error ||
                    "Error while setting contact",
                errorField: error.response?.data.errorField,
            };
        }
    }
};

export const setContactDL = async (
    contactuid: string,
    { dluidback, dluidfront }: { dluidfront?: string; dluidback?: string }
) => {
    try {
        const response = await authorizedUserApiInstance.post<BaseResponseError>(
            `contacts/${contactuid}/dlicense`,
            {
                dluidfront,
                dluidback,
                contactuid,
            }
        );

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        // TODO: add error handler
    }
};

export const getContactsProspectList = async (contactuid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<unknown[] | BaseResponseError>(
            `contacts/${contactuid}/listprospect`
        );
        if (request.status === 200) {
            return request.data;
        }
    } catch (error: Error | BaseResponseError | unknown) {
        const errorMessage = "Error while getting contacts prospect list";
        if (error instanceof Error) {
            return {
                status: Status.ERROR,
                error: error.message || errorMessage,
            };
        }
        return {
            status: Status.ERROR,
            error: error || errorMessage,
        };
    }
};

export const deleteContact = async (contactuid: string, data: Record<string, string>) => {
    try {
        const response = await authorizedUserApiInstance.post<BaseResponseError>(
            `contacts/${contactuid}/delete`,
            data
        );
        return response.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while deleting contact",
            };
        }
    }
};

export const deleteContactFrontDL = async (contactuid: string) => {
    try {
        const response = await authorizedUserApiInstance.post<BaseResponseError>(
            `contacts/${contactuid}/deletedlicensefront`
        );

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error,
            };
        }
    }
};

export const deleteContactBackDL = async (contactuid: string) => {
    try {
        const response = await authorizedUserApiInstance.post<BaseResponseError>(
            `contacts/${contactuid}/deletedlicenseback`
        );

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while deleting contact back DL",
            };
        }
    }
};

export const getContactMediaItemList = async (
    contactID: string
): Promise<InventoryMedia[] | BaseResponseError | undefined> => {
    try {
        const request = await authorizedUserApiInstance.get<InventoryMedia[]>(
            `contacts/${contactID}/media`
        );
        if (request) {
            return request.data;
        } else throw new Error();
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while getting contact media item",
            };
        }
    }
};

export const getContactMediaItem = async (
    mediaID: string
): Promise<string | BaseResponseError | undefined> => {
    try {
        const response = await authorizedUserApiInstance.get(`media/${mediaID}/media`, {
            responseType: "blob",
        });

        const dataUrl = await new Promise<string>((resolve) => {
            const reader = new window.FileReader();
            reader.addEventListener("load", (event) => {
                resolve(event.target?.result as string);
            });
            reader.readAsDataURL(response.data);
        });

        return dataUrl;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while getting contact media item",
            };
        }
    }
};

export const uploadContactMedia = async (contactUid: string, contactData: FormData) => {
    try {
        const response = await authorizedUserApiInstance.post<InventorySetResponse>(
            `media/${contactUid || 0}/media`,
            contactData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error:
                    error.response?.data.info ||
                    error.response?.data.error ||
                    "Error while uploading contact media",
            };
        }
    }
};

export const setContactMediaItemData = async (
    contactUid: string,
    {
        mediaitemuid,
        notes,
        itemuid,
        order,
        mediaurl,
        contenttype,
        useruid,
        type,
    }: Partial<InventoryMediaPostData>
) => {
    try {
        const id = contactUid ? contactUid : 0;
        const response = await authorizedUserApiInstance.post<BaseResponseError>(
            `contacts/${id}/media`,
            {
                mediaitemuid,
                mediaurl,
                useruid,
                itemuid,
                contenttype,
                notes,
                order,
                type,
            }
        );

        if (response.data.status === Status.OK) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error:
                    error.response?.data.info ||
                    error.response?.data.error ||
                    "Error while setting contact media item data",
            };
        }
    }
};

export const deleteContactMedia = async (itemuid: string) => {
    try {
        const response = await authorizedUserApiInstance.post<BaseResponse>(
            `contacts/${itemuid}/deletemedia`
        );
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error,
            };
        }
    }
};

export const checkContactOFAC = async (contactuid: string = "0", contact: Contact) => {
    try {
        const response = await authorizedUserApiInstance.post<BaseResponseError>(
            `contacts/${contactuid}/check`,
            { ...contact }
        );

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error,
            };
        }
    }
};

export const scanContactDL = async (dlImage: File) => {
    try {
        const formData = new FormData();
        formData.append("dlImage", dlImage);

        const response = await authorizedUserApiInstance.post<ScanBarcodeDL>(
            "decoder/dlbarcode",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.info || error.response?.data.error,
            };
        }
    }
};
