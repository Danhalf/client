import { authorizedUserApiInstance } from "http/index";

export const inventoryDecodeVIN = async (vin: string) => {
    try {
        const request = await authorizedUserApiInstance.get<Record<string, string>>(
            `decoder/${vin}/vindecode`
        );
        return request.data;
    } catch (error) {
        // TODO: add error handler
    }
};
