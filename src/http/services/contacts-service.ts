import { authorizedUserApiInstance } from "../index";
import { QueryParams } from "common/models/query-params";
import {
    Contact,
    ContactUser,
    ContactsCategories,
    SalespersonsList,
    TotalUsers,
} from "common/models/contact";
import { BaseResponse, Status } from "common/models/base-response";

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
        if (request.data.status === Status.OK) {
            return request.data;
        }
    } catch (error) {
        // TODO: add error handler
    }
};

export const getContactsTypeList = async (uid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<ContactsCategories>(
            `contacts/${uid}/listtypes`
        );
        if (request.data.status === Status.OK) {
            return request.data.contact_types;
        }
    } catch (error) {
        // TODO: add error handler
    }
};

export const getContactsSalesmanList = async (uid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<SalespersonsList[]>(
            `user/${uid}/salespersons`
        );
        if (request.status === 200) {
            return request.data;
        }
    } catch (error) {
        // TODO: add error handler
    }
};

export const setContactDL = async (
    contactuid: string,
    { dluidback, dluidfront }: { dluidfront?: string; dluidback?: string }
) => {
    try {
        const response = await authorizedUserApiInstance.post<BaseResponse>(
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
