/* eslint-disable no-unused-vars */
import { authorizedUserApiInstance } from "http/index";

export const getSupportMessages = async (useruid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<any[]>(`logs/${useruid}/support`);
        // eslint-disable-next-line no-console
        console.log(request);
        return request.data;
    } catch (error) {
        // TODO: add error handler
    }
};

export const deleteTask = async (taskIndex: number) => {
    try {
        const request = await authorizedUserApiInstance.post<any>(`tasks/${taskIndex}/delete`);
        return request.data;
    } catch (error) {
        // TODO: add error handler
    }
};
