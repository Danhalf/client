import { authorizedUserApiInstance } from "http/index";
import { QueryParams } from "common/models/query-params";
import { BaseResponse } from "common/models/base-response";

export interface TotalExportToWebList extends BaseResponse {
    total: number;
}

export const getExportToWebList = async (useruid: string, queryParams?: QueryParams) => {
    try {
        const request = await authorizedUserApiInstance.get<any[] | TotalExportToWebList>(
            `inventory/${useruid}/weblist`,
            {
                params: queryParams,
            }
        );
        return request.data;
    } catch (error) {
        // TODO: add error handler
    }
};
