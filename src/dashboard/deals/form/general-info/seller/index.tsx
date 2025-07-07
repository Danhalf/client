import { observer } from "mobx-react-lite";
import { ReactElement, useEffect, useState } from "react";
import "./index.css";
import { BorderedCheckbox } from "dashboard/common/form/inputs";
import { useStore } from "store/hooks";
import { SalespersonsList } from "common/models/contact";
import { ComboBox } from "dashboard/common/form/dropdown";
import { getContactsSalesmanList } from "http/services/contacts-service";

enum DealGeneralSellerKeys {
    FIRST_SALES_PERSON_ID = "salesperson1uid",
    FIRST_SALES_PERSON_NAME = "salesperson1name",
    SECOND_SALES_PERSON_ID = "salesperson2uid",
    SECOND_SALES_PERSON_NAME = "salesperson2name",
    DIFFERENT_SELLER = "differentSeller",
    DIFFERENT_SELLER_ID = "differentSellerUID",
    DIFFERENT_SELLER_NAME = "differentSellerInfo",
}

export const DealGeneralSeller = observer((): ReactElement => {
    const store = useStore().dealStore;
    const userStore = useStore().userStore;
    const { authUser } = userStore;
    const [salespersonList, setSalespersonList] = useState<SalespersonsList[]>([]);

    const {
        deal: { salesperson1name, salesperson2name, differentSeller, differentSellerInfo },
        changeDeal,
    } = store;

    const handleGetSalespersonList = async () => {
        const response = await getContactsSalesmanList(authUser!.useruid);
        if (response && Array.isArray(response)) {
            setSalespersonList(response);
        }
    };

    useEffect(() => {
        handleGetSalespersonList();
    }, [authUser]);

    return (
        <div className='grid deal-general-seller row-gap-2'>
            <div className='col-6'>
                <ComboBox
                    options={salespersonList}
                    optionLabel='name'
                    optionValue='useruid'
                    value={salesperson1name}
                    onChange={(event) => {
                        changeDeal({
                            key: DealGeneralSellerKeys.FIRST_SALES_PERSON_ID,
                            value: event.target.value,
                        });
                    }}
                    name='Salesman 1'
                />
            </div>
            <div className='col-6'>
                <ComboBox
                    options={salespersonList}
                    optionLabel='name'
                    optionValue='useruid'
                    value={salesperson2name}
                    onChange={(event) => {
                        changeDeal({
                            key: DealGeneralSellerKeys.SECOND_SALES_PERSON_ID,
                            value: event.target.value,
                        });
                    }}
                    name='Salesman 2'
                />
            </div>

            <hr className='col-12 form-line' />

            <div className='col-3'>
                <BorderedCheckbox
                    checked={!!differentSeller}
                    onChange={() =>
                        changeDeal({
                            key: DealGeneralSellerKeys.DIFFERENT_SELLER,
                            value: !differentSeller ? 1 : 0,
                        })
                    }
                    name='Different seller'
                />
            </div>
            {!!differentSeller && (
                <div className='col-6'>
                    <ComboBox
                        options={salespersonList}
                        optionLabel='name'
                        optionValue='useruid'
                        value={differentSellerInfo}
                        onChange={(event) => {
                            changeDeal({
                                key: DealGeneralSellerKeys.DIFFERENT_SELLER_ID,
                                value: event.target.value,
                            });
                        }}
                        name='Seller'
                    />
                </div>
            )}
        </div>
    );
});
