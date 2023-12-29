/* eslint-disable no-unused-vars */
import { authorizedUserApiInstance } from "http/index";

export const getSupportMessages = async (useruid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<any[]>(`log/${useruid}/support`);
        return request.data;
    } catch (error) {
        // TODO: add error handler
    }
};

export const getLatestSupportMessages = async (useruid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<any[]>(`log/${useruid}/latest`);
        return request.data;
    } catch (error) {
        // TODO: add error handler
    }
};
