import { observer } from "mobx-react-lite";
import { ReactElement, useEffect, useState } from "react";
import "./index.css";
import { CompanySearch } from "dashboard/contacts/common/company-search";
import { BorderedCheckbox } from "dashboard/common/form/inputs";
import { useStore } from "store/hooks";
import { Contact, ContactTypeNameList, ContactUser } from "common/models/contact";
import { Deal } from "common/models/deals";
import { getContactInfo } from "http/services/contacts-service";
import { Status } from "common/models/base-response";

export const DealGeneralSeller = observer((): ReactElement => {
    const store = useStore().dealStore;
    const {
        deal: { salesperson1uid, salesperson2uid, differentSeller, differentSellerUID },
        changeDeal,
    } = store;

    const [salesperson1Name, setSalesperson1Name] = useState<string>("");
    const [salesperson2Name, setSalesperson2Name] = useState<string>("");
    const [differentSellerName, setDifferentSellerName] = useState<string>("");

    const handleGetContactInfo = async (uid: string, key: keyof Deal) => {
        const response = await getContactInfo(uid);
        if (response?.status !== Status.ERROR) {
            const contact = response as Contact;
            return contact?.userName;
        }
    };

    useEffect(() => {
        if (salesperson1uid) {
            handleGetContactInfo(salesperson1uid, "salesperson1uid");
        }
        if (salesperson2uid) {
            handleGetContactInfo(salesperson2uid, "salesperson2uid");
        }
        if (differentSellerUID) {
            handleGetContactInfo(differentSellerUID, "differentSellerUID");
        }
    }, [salesperson1uid, salesperson2uid, differentSellerUID]);

    const handleGetFullInfo = (contact: ContactUser, key: keyof Deal) => {
        changeDeal({
            key,
            value: contact.contactuid,
        });

        if (key === "salesperson1uid") {
            setSalesperson1Name(contact.userName);
        } else if (key === "salesperson2uid") {
            setSalesperson2Name(contact.userName);
        } else if (key === "differentSellerUID") {
            setDifferentSellerName(contact.userName);
        }
    };

    return (
        <div className='grid deal-general-seller row-gap-2'>
            <div className='col-6'>
                <CompanySearch
                    value={salesperson1Name}
                    onChange={({ target: { value } }) => {
                        setSalesperson1Name(value);
                        if (!value) {
                            changeDeal({ key: "salesperson1uid", value: "" });
                        }
                    }}
                    getFullInfo={(contact) => handleGetFullInfo(contact, "salesperson1uid")}
                    name='Salesman 1'
                />
            </div>
            <div className='col-6'>
                <CompanySearch
                    value={salesperson2Name}
                    onChange={({ target: { value } }) => {
                        setSalesperson2Name(value);
                        if (!value) {
                            changeDeal({ key: "salesperson2uid", value: "" });
                        }
                    }}
                    getFullInfo={(contact) => handleGetFullInfo(contact, "salesperson2uid")}
                    name='Salesman 2'
                />
            </div>

            <hr className='col-12 form-line' />

            <div className='col-3'>
                <BorderedCheckbox
                    checked={!!differentSeller}
                    onChange={() =>
                        changeDeal({ key: "differentSeller", value: !differentSeller ? 1 : 0 })
                    }
                    name='Different seller'
                />
            </div>
            {!!differentSeller && (
                <div className='col-6'>
                    <CompanySearch
                        name='Seller'
                        value={differentSellerName}
                        onChange={({ target: { value } }) => {
                            setDifferentSellerName(value);
                            if (!value) {
                                changeDeal({ key: "differentSellerUID", value: "" });
                            }
                        }}
                        getFullInfo={(contact) => handleGetFullInfo(contact, "differentSellerUID")}
                        contactCategory={ContactTypeNameList.DEALERS}
                    />
                </div>
            )}
        </div>
    );
});
