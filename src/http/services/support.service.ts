import { isAxiosError } from "axios";
import { BaseResponseError, Status } from "common/models/base-response";
import { QueryParams } from "common/models/query-params";
import { authorizedUserApiInstance } from "http/index";

export interface SupportMessage {
    email: string;
    topic: string;
    message: string;
}

export interface SupportHistory {
    clientuid: string;
    created: string;
    deleted: string;
    flags: number;
    index: number;
    itemuid: string;
    message: string;
    priority: number;
    threaduid: string;
    topic: string;
    updated: string;
    useruid: string;
    username: string;
}

export const getSupportMessages = async (useruid: string, params?: QueryParams) => {
    try {
        const request = await authorizedUserApiInstance.get<SupportHistory[] | BaseResponseError>(
            `log/${useruid}/support`,
            {
                params,
            }
        );
        return request.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while getting support messages",
            };
        }
    }
};

export const getLatestSupportMessages = async (useruid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<SupportHistory[]>(
            `log/${useruid}/latest`
        );
        return request.data;
    } catch (error) {
        // TODO: add error handler
    }
};

export const getSupportThread = async (threaduid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<any[]>(`log/${threaduid}/thread`);
        return request.data;
    } catch (error) {
        // TODO: add error handler
    }
};

export const createOrUpdateSupportMessage = async (
    supportData: SupportMessage,
    itemuid?: string | undefined
) => {
    try {
        await authorizedUserApiInstance
            .post<SupportMessage>(`log/${itemuid || 0}/support`, supportData)
            .then((response) => {
                return response.status;
            });
    } catch (error) {
        // TODO: add error handler
    }
};
