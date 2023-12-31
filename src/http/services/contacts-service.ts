import { authorizedUserApiInstance } from "../index";
import { QueryParams } from "common/models/query-params";
import { BaseResponse } from "common/models/base-response";

export interface ContactsCategories {
    status: "OK";
    contact_types: ContactType[];
}

export interface ContactType {
    id: number;
    name: string;
}

export interface ContactUser {
    ZIP: string;
    companyName: string;
    contactuid: string;
    created: string;
    dluidback: string;
    dluidfront: string;
    email1: string;
    email2: string;
    firstName: string;
    lastName: string;
    fullName: string;
    messager1: string;
    messager2: string;
    phone1: string;
    phone2: string;
    state: string;
    streetAddress: string;
    type: number;
    updated: string;
    userName: string;
    useruid: string;
}

export interface TotalUsers extends BaseResponse {
    total: number;
}

export const getContactsCategories = async () => {
    try {
        const request = await authorizedUserApiInstance.get<ContactsCategories>(
            `contacts/0/listtypes`
        );
        return request.data;
    } catch (error) {
        // TODO: add error handler
    }
};

export const getContacts = async (uid: string, queryParams: QueryParams) => {
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
