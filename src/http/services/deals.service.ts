import { authorizedUserApiInstance } from "http/index";
import { QueryParams } from "common/models/query-params";
import { BaseResponse, Status } from "common/models/base-response";
import { Deal, DealType } from "common/models/deals";

export interface TotalDealsList extends BaseResponse {
    total: number;
}

export const getDealsList = async (uid: string, queryParams: QueryParams) => {
    try {
        const request = await authorizedUserApiInstance.get<Deal[] | TotalDealsList>(
            `deals/${uid}/list`,
            {
                params: queryParams,
            }
        );
        return request.data;
    } catch (error) {
        // TODO: add error handler
    }
};

export const getDealInfo = async (uid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<Deal>(`deals/${uid}/info`);
        if (request.data.status === Status.OK) {
            return request.data;
        }
    } catch (error) {
        // TODO: add error handler
    }
};
interface TypeResponse extends BaseResponse {
    deal_types: DealType[];
}

export const getDealTypes = async () => {
    try {
        const request = await authorizedUserApiInstance.get<TypeResponse>("deals/listdealtypes");
        return request.data.deal_types;
    } catch (error) {
        // TODO: add error handler
    }
};
