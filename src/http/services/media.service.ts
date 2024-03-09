import { BaseResponse } from "common/models/base-response";
import {
    InventoryMedia,
    CreateMediaItemRecordResponse,
    InventorySetResponse,
} from "common/models/inventory";
import { authorizedUserApiInstance } from "http/index";

export const getInventoryMediaItemList = async (
    inventoryID: string
): Promise<InventoryMedia[] | undefined> => {
    try {
        const request = await authorizedUserApiInstance.get<InventoryMedia[]>(
            `inventory/${inventoryID}/media`
        );
        if (request) {
            return request.data;
        } else throw new Error();
    } catch (error) {
        // TODO: add error handler
    }
};

export const getInventoryMediaItem = async (mediaID: string): Promise<string | undefined> => {
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
        // TODO: add error handler
        return undefined;
    }
};

export const createMediaItemRecord = async () => {
    try {
        const response = await authorizedUserApiInstance.post<CreateMediaItemRecordResponse>(
            "media/0/meta",
            { mediaType: 1 }
        );

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        // TODO: add error handler
    }
};

export const uploadInventoryMedia = async (inventoryUid: string, inventoryData: FormData) => {
    try {
        const response = await authorizedUserApiInstance.post<InventorySetResponse>(
            `media/${inventoryUid || 0}/media`,
            inventoryData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        // TODO: add error handler
    }
};

export const pairMediaWithInventoryItem = async (inventoryUid: string, mediaitemuid: string) => {
    try {
        const response = await authorizedUserApiInstance.post<BaseResponse>(
            `inventory/${inventoryUid}/media`,
            {
                mediaitemuid,
            }
        );

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        // TODO: add error handler
    }
};

export const deleteMediaImage = async (itemuid: string) => {
    try {
        const response = await authorizedUserApiInstance.post<BaseResponse>(
            `inventory/${itemuid}/deletemedia`
        );
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        // TODO add error handler
    }
};
