import { authorizedUserApiInstance } from "../index";
import { ContactsCategories } from "common/models/contact";
import { Status } from "common/models/base-response";

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
